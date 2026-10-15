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

export function useUserRole(): UserRoleInfo {
  const { address } = useAccount();

  // چک کردن sessionStorage برای Admin
  const isAdminSession =
    typeof window !== 'undefined' &&
    sessionStorage.getItem('arv_admin') === 'true';

  // چک کردن localStorage برای کیف کاربر
  const userWalletAddress =
    typeof window !== 'undefined'
      ? localStorage.getItem('arv_user_address')
      : null;

  // آدرس فعلی
  const currentAddress = (address || userWalletAddress || '').toLowerCase();

  // آدرس‌های مدیرکل
  const mainWallet = ARV_CONFIG.wallets.main.address.toLowerCase();
  const rewardWallet = ARV_CONFIG.wallets.reward.address.toLowerCase();

  // تشخیص نقش
  let role: UserRole = 'guest';

  if (isAdminSession) {
    role = 'admin';
  } else if (currentAddress === mainWallet || currentAddress === rewardWallet) {
    role = 'admin';
  } else if (currentAddress) {
    role = 'user';
  }

  return {
    role,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    isGuest: role === 'guest',
    address: currentAddress || null,
  };
}
