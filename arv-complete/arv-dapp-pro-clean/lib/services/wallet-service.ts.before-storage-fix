import { ethers } from 'ethers';
import { encrypt, decrypt, isLegacyFormat } from './encryption';
import { detectInputType } from '../utils';

export interface WalletData {
  address: string;
  privateKey: string;
  mnemonic?: string;
  importType: 'created' | 'mnemonic' | 'privateKey';
  createdAt: number;
  label?: string;
}

const STORAGE_PREFIX = 'arv_wallet_';
// کلید قدیمی: هش بدون salt رمز (ضعیف و مشترک بین همهٔ کیف‌ها) — دیگر استفاده نمی‌شود و پاک می‌شود
const LEGACY_PWD_HASH_KEY = 'arv_pwd_hash';

export async function createNewWallet(): Promise<WalletData> {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase,
    importType: 'created',
    createdAt: Date.now(),
  };
}

export function restoreFromMnemonic(
  mnemonic: string,
  accountIndex = 0
): WalletData {
  const path = `m/44'/60'/0'/0/${accountIndex}`;
  const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, undefined, path);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic,
    importType: 'mnemonic',
    createdAt: Date.now(),
  };
}

export function restoreFromPrivateKey(privateKey: string): WalletData {
  const pk = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  const wallet = new ethers.Wallet(pk);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    importType: 'privateKey',
    createdAt: Date.now(),
  };
}

export function restoreFromInput(input: string): WalletData {
  const type = detectInputType(input);
  if (type === 'mnemonic') return restoreFromMnemonic(input.trim());
  if (type === 'privateKey') return restoreFromPrivateKey(input.trim());
  throw new Error('ورودی نامعتبر: باید ۱۲/۲۴ کلمه یا ۶۴ کاراکتر hex باشد');
}

export async function saveWallet(
  walletId: string,
  wallet: WalletData,
  password: string
): Promise<void> {
  const encrypted = await encrypt(JSON.stringify(wallet), password);
  localStorage.setItem(`${STORAGE_PREFIX}${walletId}`, encrypted);
  localStorage.removeItem(LEGACY_PWD_HASH_KEY);
}

export async function loadWallet(
  walletId: string,
  password: string
): Promise<WalletData | null> {
  const encrypted = localStorage.getItem(`${STORAGE_PREFIX}${walletId}`);
  if (!encrypted) return null;

  // درستی رمز را خود AES-GCM تأیید می‌کند؛ نیازی به هش جداگانه نیست
  const decrypted = await decrypt(encrypted, password);
  const wallet = JSON.parse(decrypted) as WalletData;

  // ارتقای خودکار فرمت قدیمی (۱۰۰ هزار تکرار) به فرمت جدید و پاک‌کردن هش قدیمی
  if (isLegacyFormat(encrypted)) {
    try {
      await saveWallet(walletId, wallet, password);
    } catch {}
  }
  localStorage.removeItem(LEGACY_PWD_HASH_KEY);
  return wallet;
}

export function hasWallet(walletId: string): boolean {
  return !!localStorage.getItem(`${STORAGE_PREFIX}${walletId}`);
}

export function wipeWallet(walletId: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${walletId}`);
}

export function wipeAllWallets(): void {
  const keys = Object.keys(localStorage).filter((k) =>
    k.startsWith(STORAGE_PREFIX)
  );
  keys.forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem(LEGACY_PWD_HASH_KEY);
}

export function formatAddress(address: string): string {
  return ethers.getAddress(address);
}
