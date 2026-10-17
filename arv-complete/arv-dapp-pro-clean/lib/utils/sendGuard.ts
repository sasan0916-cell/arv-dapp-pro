/**
 * lib/utils/sendGuard.ts
 *
 * 🛡️ Send Safeguards — محافظت از ارسال ARV/BNB
 *
 * این فایل تمام چک‌های امنیتی قبل از ارسال تراکنش رو جمع می‌کنه:
 * 1. آدرس معتبر و checksum
 * 2. آدرس صفر / burn
 * 3. Self-transfer
 * 4. آدرس قراردادهای محافظت‌شده (ARV/Factory/Router/Pair)
 * 5. حداقل مقدار
 * 6. موجودی کافی
 * 7. BNB کافی برای گس
 *
 * @version v6.14
 */

import { ethers } from 'ethers';
import { ARV_CONFIG } from '@/lib/arv-config';

// ============ ثابت‌های امنیتی ============

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';

/**
 * 🔥 آدرس قراردادهای ARV که نباید به‌شون ARV فرستاد
 * ارسال ARV به این آدرس‌ها = قفل شدن دائمی توکن‌ها
 */
export const PROTECTED_CONTRACTS: Record<string, string> = {
  ARVToken: '0x049C66b452f650a0d5F51536f5bC03f249C5163A',
  ARVFactory: '0xc13Eb18BAa7e6FF4cB7862a7BdE0425B42d549e8',
  ARVRouter: '0xB1330C8822cBcce124b6b94aA89e2C026F1B7d4e',
  ARVPair: '0xa36f98bc817c2862F5b6849A1F58de5052F69c29',
  ARVLPRewards: '0xAF16ecF0e7C160144D96198BB717d43B6A016A66',
};

const MIN_SEND_AMOUNT = 0.0001;
const MIN_BNB_FOR_GAS = ethers.parseEther('0.0005');

// ============ انواع ============

export interface GuardResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export interface GuardContext {
  recipient: string;
  amount: string;
  senderAddress?: string;
  arvBalance?: bigint;
  bnbBalance?: bigint;
  tokenDecimals?: number;
}

// ============ توابع چک ============

/**
 * آدرس صفر یا burn است؟
 */
export function isZeroOrBurnAddress(addr: string): boolean {
  if (!addr) return false;
  const lower = addr.toLowerCase();
  return lower === ZERO_ADDRESS.toLowerCase() || lower === BURN_ADDRESS.toLowerCase();
}

/**
 * Self-transfer؟ (آدرس مبدأ = مقصد)
 */
export function isSelfTransfer(sender: string | undefined, recipient: string): boolean {
  if (!sender || !recipient) return false;
  return sender.toLowerCase() === recipient.toLowerCase();
}

/**
 * آدرس مقصد یکی از قراردادهای محافظت‌شده است؟
 */
export function isProtectedContract(addr: string): string | null {
  if (!addr) return null;
  const lower = addr.toLowerCase();
  for (const [name, contractAddr] of Object.entries(PROTECTED_CONTRACTS)) {
    if (lower === contractAddr.toLowerCase()) return name;
  }
  return null;
}

/**
 * checksum آدرس معتبر است؟ (اگر آدرس مخلوط بزرگ/کوچک باشد)
 * آدرس تمام lowercase هم قبول است.
 */
export function hasValidChecksum(addr: string): boolean {
  if (!addr) return false;
  try {
    // اگه همه حروف بزرگ یا کوچک باشه، checksum نداره ولی معتبره
    const hasMixedCase = addr !== addr.toLowerCase() && addr !== addr.toUpperCase();
    if (!hasMixedCase) return ethers.isAddress(addr);
    return ethers.getAddress(addr) === addr;
  } catch {
    return false;
  }
}

/**
 * مقدار ارسال معتبر است؟ (عدد مثبت، حداقل، اعشار)
 */
export function validateAmount(
  amountStr: string,
  decimals = 18
): { ok: boolean; amount?: bigint; error?: string } {
  const trimmed = amountStr.trim();
  if (!trimmed) return { ok: false, error: 'مقدار را وارد کنید' };

  // فقط عدد دهدهی
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return { ok: false, error: 'مقدار نامعتبر — فقط عدد دهدهی مجاز است' };
  }

  let amountBig: bigint;
  try {
    amountBig = ethers.parseUnits(trimmed, decimals);
  } catch {
    return { ok: false, error: 'مقدار نامعتبر است' };
  }

  if (amountBig <= 0n) {
    return { ok: false, error: 'مقدار باید بزرگتر از صفر باشد' };
  }

  const amountNum = parseFloat(trimmed);
  if (amountNum < MIN_SEND_AMOUNT) {
    return {
      ok: false,
      error: `حداقل مقدار ارسال ${MIN_SEND_AMOUNT} است`,
    };
  }

  return { ok: true, amount: amountBig };
}

/**
 * موجودی کافی است؟
 */
export function hasEnoughBalance(
  amount: bigint,
  balance: bigint,
  label = 'ARV'
): { ok: boolean; error?: string } {
  if (balance < amount) {
    return { ok: false, error: `موجودی ${label} کافی نیست` };
  }
  return { ok: true };
}

/**
 * BNB کافی برای گس + مقدار (اگر native) هست؟
 */
export function hasEnoughBNBForGas(bnbBalance: bigint): { ok: boolean; error?: string } {
  if (bnbBalance < MIN_BNB_FOR_GAS) {
    return {
      ok: false,
      error: `موجودی ${ARV_CONFIG.network.nativeCurrency.symbol} برای کارمزد کافی نیست (حداقل 0.0005)`,
    };
  }
  return { ok: true };
}

// ============ تابع مرکزی ============

/**
 * 🛡️ اجرای همه چک‌ها
 * این تابع تمام چک‌های امنیتی رو انجام می‌ده و لیست خطا/هشدار برمی‌گردونه.
 */
export async function runAllChecks(ctx: GuardContext): Promise<GuardResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const decimals = ctx.tokenDecimals ?? ARV_CONFIG.token.decimals;

  // 1. آدرس معتبر
  if (!ctx.recipient) {
    errors.push('آدرس گیرنده را وارد کنید');
    return { ok: false, errors, warnings };
  }

  if (!ethers.isAddress(ctx.recipient)) {
    errors.push('آدرس گیرنده نامعتبر است');
    return { ok: false, errors, warnings };
  }

  // 2. checksum
  if (!hasValidChecksum(ctx.recipient)) {
    errors.push('آدرس گیرنده checksum معتبر ندارد');
  }

  // 3. آدرس صفر / burn
  if (isZeroOrBurnAddress(ctx.recipient)) {
    errors.push('❌ ارسال به آدرس صفر یا burn مجاز نیست — توکن‌ها از دست می‌روند');
  }

  // 4. self-transfer
  if (isSelfTransfer(ctx.senderAddress, ctx.recipient)) {
    warnings.push('⚠️ آدرس گیرنده با کیف شما یکسان است (فقط کارمزد پرداخت می‌کنید)');
  }

  // 5. قرارداد محافظت‌شده
  const protectedName = isProtectedContract(ctx.recipient);
  if (protectedName) {
    errors.push(
      `❌ ارسال به قرارداد ${protectedName} مجاز نیست — توکن‌ها برای همیشه قفل می‌شوند`
    );
  }

  // 6. مقدار
  const amtCheck = validateAmount(ctx.amount, decimals);
  if (!amtCheck.ok) {
    errors.push(amtCheck.error || 'مقدار نامعتبر');
    return { ok: false, errors, warnings };
  }

  // 7. موجودی
  if (ctx.arvBalance !== undefined) {
    const balCheck = hasEnoughBalance(amtCheck.amount!, ctx.arvBalance);
    if (!balCheck.ok) errors.push(balCheck.error!);
  }

  // 8. BNB برای گس
  if (ctx.bnbBalance !== undefined) {
    const gasCheck = hasEnoughBNBForGas(ctx.bnbBalance);
    if (!gasCheck.ok) errors.push(gasCheck.error!);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

// ============ Export همه ============
export const SendGuard = {
  isZeroOrBurnAddress,
  isSelfTransfer,
  isProtectedContract,
  hasValidChecksum,
  validateAmount,
  hasEnoughBalance,
  hasEnoughBNBForGas,
  runAllChecks,
  PROTECTED_CONTRACTS,
};
