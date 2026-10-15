/**
 * سرویس Referral - سیستم دعوت اختصاصی DApp
 * کد از آدرس کیف کاربر تولید می‌شود
 */

import { storageGet, storageSet } from './storage';

const REFERRAL_KEY = 'arv_referral_data';

export interface ReferralData {
  code: string;
  address: string;
  invitedAddresses: string[];
  createdAt: number;
}

/**
 * تولید کد اختصاصی از آدرس کیف
 */
export function generateReferralCode(address: string): string {
  if (!address) return '';
  const clean = address.toLowerCase().replace('0x', '');
  // ۸ کاراکتر اول از hash آدرس
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = ((hash << 5) - hash) + clean.charCodeAt(i);
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(36).toUpperCase().padStart(6, '0').slice(0, 6);
  return `ARV${hex}`;
}

/**
 * ذخیره اطلاعات Referral
 */
export async function saveReferralData(data: ReferralData): Promise<void> {
  await storageSet(REFERRAL_KEY, JSON.stringify(data));
}

/**
 * خواندن اطلاعات Referral
 */
export async function loadReferralData(): Promise<ReferralData | null> {
  try {
    const raw = await storageGet(REFERRAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * ساخت لینک دعوت
 */
export function buildReferralLink(code: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://arv-dapp-pro.surge.sh');
  return `${base}/?ref=${code}`;
}

/**
 * ذخیره کد دعوت‌کننده (وقتی کاربر با لینک میاد)
 */
export async function saveReferrerCode(code: string): Promise<void> {
  await storageSet('arv_referrer_code', code);
}

/**
 * خواندن کد دعوت‌کننده
 */
export async function loadReferrerCode(): Promise<string | null> {
  return await storageGet('arv_referrer_code');
}

/**
 * دریافت کد از URL
 */
export function getRefFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}

// ===== توابع جدید: پاداش دعوت =====

const REFERRAL_STATS_KEY = 'arv_referral_stats';

export interface ReferralStats {
  code: string;              // کد معرف
  referrerAddress: string;   // آدرس معرف
  invitedAddresses: string[];// لیست آدرس‌های دعوت‌شده
  totalReward: number;       // پاداش کل (ARV)
  lastUpdated: number;
}

/**
 * ذخیره/به‌روزرسانی آمار معرف
 */
export async function saveReferralStats(stats: ReferralStats): Promise<void> {
  await storageSet(REFERRAL_STATS_KEY, JSON.stringify(stats));
}

/**
 * خواندن آمار معرف
 */
export async function loadReferralStats(): Promise<ReferralStats | null> {
  try {
    const raw = await storageGet(REFERRAL_STATS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReferralStats;
  } catch {
    return null;
  }
}

/**
 * وقتی کاربر جدید با کد معرف، کیف ساخت → اضافه به لیست
 * @param referrerCode کد معرف
 * @param newAddress آدرس کاربر جدید
 * @param rewardAmount پاداش به ARV (پیش‌فرض: 100)
 */
export async function registerInvite(
  referrerCode: string,
  newAddress: string,
  rewardAmount: number = 100
): Promise<ReferralStats | null> {
  if (!referrerCode || !newAddress) return null;

  // چک کن قبلاً این کد استفاده نشده
  const existing = await loadReferralStats();
  if (existing && existing.code === referrerCode) {
    // اگه آدرس قبلاً اضافه شده، کاری نکن
    if (existing.invitedAddresses.includes(newAddress.toLowerCase())) {
      return existing;
    }
    // اضافه کن
    existing.invitedAddresses.push(newAddress.toLowerCase());
    existing.totalReward += rewardAmount;
    existing.lastUpdated = Date.now();
    await saveReferralStats(existing);
    return existing;
  }

  // اگه اولین باره
  const stats: ReferralStats = {
    code: referrerCode,
    referrerAddress: '',
    invitedAddresses: [newAddress.toLowerCase()],
    totalReward: rewardAmount,
    lastUpdated: Date.now(),
  };
  await saveReferralStats(stats);
  return stats;
}

/**
 * پاک کردن کد معرف (بعد از استفاده موفق)
 */
export async function clearReferrerCode(): Promise<void> {
  await storageSet('arv_referrer_code', '');
}
