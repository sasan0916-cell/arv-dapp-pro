'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export type UserRole = 'user' | 'guest';

export interface UserRoleInfo {
  role: UserRole;
  isAdmin: boolean; // همیشه false — دسترسی مدیر حذف شده
  isUser: boolean;
  isGuest: boolean;
  address: string | null;
  loading: boolean;
}

export function useUserRole(): UserRoleInfo {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userWalletAddress =
      typeof window !== 'undefined' ? localStorage.getItem('arv_user_address') : null;
    setLoading(false);
  }, []);

  const userWalletAddress =
    typeof window !== 'undefined' ? localStorage.getItem('arv_user_address') : null;
  const currentAddress = (address || userWalletAddress || '').toLowerCase();

  const role: UserRole = currentAddress ? 'user' : 'guest';

  return {
    role,
    isAdmin: false,
    isUser: role === 'user',
    isGuest: role === 'guest',
    address: currentAddress || null,
    loading,
  };
}
