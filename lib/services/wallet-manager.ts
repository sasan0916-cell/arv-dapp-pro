import { ARV_CONFIG } from '../arv-config';
import {
  WalletData,
  saveWallet,
  loadWallet,
  hasWallet,
  wipeWallet,
  createNewWallet,
  restoreFromInput,
} from './wallet-service';
import {
  registerBiometric,
  verifyBiometric,
  hasBiometric,
  removeBiometric,
  isBiometricAvailable,
} from './biometric';

export type WalletId = 'main' | 'reward' | 'user';

export interface ManagedWallet {
  id: WalletId;
  label: string;
  labelEn: string;
  address: string;
  share?: number; // 60 یا 40
  isAdmin: boolean;
  hasBiometric: boolean;
  createdAt: number;
}

export interface WalletSession {
  walletId: WalletId;
  address: string;
  unlockedAt: number;
}

const SESSION_KEY = 'arv_session';
const WALLETS_KEY = 'arv_wallets_meta';

// ===== لیست کیف پول‌ها =====

export function getAllWallets(): ManagedWallet[] {
  const stored = localStorage.getItem(WALLETS_KEY);
  if (!stored) {
    // پیش‌فرض: سه کیف پول
    return [
      {
        id: 'main',
        label: 'کیف اصلی',
        labelEn: 'Main Wallet',
        address: ARV_CONFIG.wallets.main.address,
        share: 60,
        isAdmin: true,
        hasBiometric: false,
        createdAt: Date.now(),
      },
      {
        id: 'reward',
        label: 'کیف پاداش',
        labelEn: 'Reward Wallet',
        address: ARV_CONFIG.wallets.reward.address,
        share: 40,
        isAdmin: true,
        hasBiometric: false,
        createdAt: Date.now(),
      },
      {
        id: 'user',
        label: 'کیف کاربر',
        labelEn: 'User Wallet',
        address: '',
        isAdmin: false,
        hasBiometric: false,
        createdAt: Date.now(),
      },
    ];
  }
  return JSON.parse(stored);
}

export function saveWalletsMeta(wallets: ManagedWallet[]): void {
  localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets));
}

export function getWallet(id: WalletId): ManagedWallet | null {
  return getAllWallets().find((w) => w.id === id) || null;
}

export function updateWalletMeta(
  id: WalletId,
  updates: Partial<ManagedWallet>
): void {
  const wallets = getAllWallets();
  const idx = wallets.findIndex((w) => w.id === id);
  if (idx >= 0) {
    wallets[idx] = { ...wallets[idx], ...updates };
    saveWalletsMeta(wallets);
  }
}

// ===== ساخت کیف پول =====

export async function createWallet(
  walletId: WalletId,
  password: string
): Promise<ManagedWallet> {
  const data = await createNewWallet();
  await saveWallet(walletId, data, password);

  const meta: ManagedWallet = {
    id: walletId,
    label: getWalletLabel(walletId),
    labelEn: getWalletLabelEn(walletId),
    address: data.address,
    share: walletId === 'main' ? 60 : walletId === 'reward' ? 40 : undefined,
    isAdmin: walletId === 'main' || walletId === 'reward',
    hasBiometric: false,
    createdAt: Date.now(),
  };

  updateWalletMeta(walletId, meta);
  return meta;
}

// ===== بازیابی کیف پول =====

export async function restoreWallet(
  walletId: WalletId,
  input: string,
  password: string
): Promise<ManagedWallet> {
  const data = restoreFromInput(input);
  await saveWallet(walletId, data, password);

  const meta: ManagedWallet = {
    id: walletId,
    label: getWalletLabel(walletId),
    labelEn: getWalletLabelEn(walletId),
    address: data.address,
    share: walletId === 'main' ? 60 : walletId === 'reward' ? 40 : undefined,
    isAdmin: walletId === 'main' || walletId === 'reward',
    hasBiometric: false,
    createdAt: Date.now(),
  };

  updateWalletMeta(walletId, meta);
  return meta;
}

// ===== باز کردن کیف پول =====

export async function unlockWallet(
  walletId: WalletId,
  password: string
): Promise<WalletData | null> {
  const data = await loadWallet(walletId, password);
  if (data) {
    setSession(walletId, data.address);
  }
  return data;
}

// ===== اثر انگشت =====

export async function enableBiometric(
  walletId: WalletId,
  userName: string
): Promise<boolean> {
  if (!(await isBiometricAvailable())) return false;
  await registerBiometric(walletId, userName);
  updateWalletMeta(walletId, { hasBiometric: true });
  return true;
}

export async function unlockWithBiometric(
  walletId: WalletId
): Promise<boolean> {
  const ok = await verifyBiometric(walletId);
  if (ok) {
    const meta = getWallet(walletId);
    if (meta) setSession(walletId, meta.address);
  }
  return ok;
}

export function disableBiometric(walletId: WalletId): void {
  removeBiometric(walletId);
  updateWalletMeta(walletId, { hasBiometric: false });
}

// ===== Session =====

export function setSession(walletId: WalletId, address: string): void {
  const session: WalletSession = {
    walletId,
    address,
    unlockedAt: Date.now(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): WalletSession | null {
  const stored = sessionStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// ===== حذف کیف پول =====

export function deleteWallet(walletId: WalletId): void {
  wipeWallet(walletId);
  disableBiometric(walletId);
  updateWalletMeta(walletId, { address: '', hasBiometric: false });
}

// ===== کمکی =====

function getWalletLabel(id: WalletId): string {
  return id === 'main' ? 'کیف اصلی' : id === 'reward' ? 'کیف پاداش' : 'کیف کاربر';
}

function getWalletLabelEn(id: WalletId): string {
  return id === 'main' ? 'Main Wallet' : id === 'reward' ? 'Reward Wallet' : 'User Wallet';
}

export function isAdminWallet(id: WalletId): boolean {
  return id === 'main' || id === 'reward';
}

export function walletExists(id: WalletId): boolean {
  return hasWallet(id);
}
