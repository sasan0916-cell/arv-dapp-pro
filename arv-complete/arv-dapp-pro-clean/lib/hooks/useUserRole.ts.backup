'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { fetchAdminSession, onAdminChanged } from '../admin-client';

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserRoleInfo {
  role: UserRole;
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
  address: string | null;
  loading: boolean;
}

export function useUserRole(): UserRoleInfo {
  const { address } = useAccount();
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [loading, setLoading] = useState(true);

  // نقش مدیر فقط از نشست امضاشدهٔ سرور می‌آید (نه sessionStorage و نه آدرس کیف پول)
  useEffect(() => {
    let alive = true;
    const refresh = () =>
      fetchAdminSession().then((s) => {
        if (!alive) return;
        setIsAdminSession(s.admin);
        setLoading(false);
      });
    refresh();
    const off = onAdminChanged(refresh);
    return () => {
      alive = false;
      off();
    };
  }, []);

  const userWalletAddress =
    typeof window !== 'undefined' ? localStorage.getItem('arv_user_address') : null;
  const currentAddress = (address || userWalletAddress || '').toLowerCase();

  let role: UserRole = 'guest';
  if (isAdminSession) role = 'admin';
  else if (currentAddress) role = 'user';

  return {
    role,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    isGuest: role === 'guest',
    address: currentAddress || null,
    loading,
  };
}
