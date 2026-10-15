'use client';

import { useState, useEffect, useCallback } from 'react';
import { ARV_CONFIG } from '../arv-config';
import {
  getARVBalance,
  getTokenInfo,
  getBNBBalance,
} from '../services/token-service';

export interface AdminStats {
  loading: boolean;
  error: string | null;
  totalSupply: number;
  mainBalance: number;
  rewardBalance: number;
  mainBNB: number;
  rewardBNB: number;
  tokenName: string;
  tokenSymbol: string;
  totalUsers: number;
  totalTx: number;
  refresh: () => Promise<void>;
}

const DEFAULT_STATS: Omit<AdminStats, 'loading' | 'error' | 'refresh'> = {
  totalSupply: 0,
  mainBalance: 0,
  rewardBalance: 0,
  mainBNB: 0,
  rewardBNB: 0,
  tokenName: 'Arvand Khabar Token',
  tokenSymbol: 'ARV',
  totalUsers: 0,
  totalTx: 0,
};

export function useAdminStats(): AdminStats {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState(DEFAULT_STATS);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [info, mainBal, rewardBal, mainNative, rewardNative] =
        await Promise.all([
          getTokenInfo(),
          getARVBalance(ARV_CONFIG.wallets.main.address),
          getARVBalance(ARV_CONFIG.wallets.reward.address),
          getBNBBalance(ARV_CONFIG.wallets.main.address),
          getBNBBalance(ARV_CONFIG.wallets.reward.address),
        ]);

      const decimals = info.decimals || 18;
      const divisor = 10 ** decimals;

      setStats({
        tokenName: info.name,
        tokenSymbol: info.symbol,
        totalSupply: Number(info.totalSupply) / divisor,
        mainBalance: Number(mainBal) / divisor,
        rewardBalance: Number(rewardBal) / divisor,
        mainBNB: Number(mainNative) / 1e18,
        rewardBNB: Number(rewardNative) / 1e18,
        totalUsers: 0, // TODO: از دیتابیس
        totalTx: 0, // TODO: از BscScan
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'خطا در دریافت اطلاعات';
      console.error('useAdminStats error:', e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { ...stats, loading, error, refresh };
}
