'use client';

import { useAccount } from 'wagmi';
import { ARV_CONFIG } from '../arv-config';

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserRoleInfo {
  role: UserRole;
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
  address: string | null;
}

/**
 * تشخیص نقش کاربر بر اساس آدرس کیف پول متصل
 * - Admin: آدرس کیف اصلی یا کیف پاداش
 * - User: هر آدرس دیگه‌ای که وصل بشه
 * - Guest: هیچ آدرسی وصل نیست
 */
export function useUserRole(): UserRoleInfo {
  const { address, isConnected } = useAccount();

  // چک کردن localStorage برای کیف کاربر
  const userWalletAddress =
    typeof window !== 'undefined'
      ? localStorage.getItem('arv_user_address')
      : null;

  // آدرس فعلی: یا از wagmi، یا از localStorage
  const currentAddress = (address || userWalletAddress || '').toLowerCase();

  // آدرس‌های مدیرکل
  const mainWallet = ARV_CONFIG.wallets.main.address.toLowerCase();
  const rewardWallet = ARV_CONFIG.wallets.reward.address.toLowerCase();

  // تشخیص نقش
  let role: UserRole = 'guest';
  if (currentAddress) {
    if (currentAddress === mainWallet || currentAddress === rewardWallet) {
      role = 'admin';
    } else {
      role = 'user';
    }
  }

  return {
    role,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    isGuest: role === 'guest',
    address: currentAddress || null,
  };
}
