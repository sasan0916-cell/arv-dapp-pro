'use client';
import { useState } from 'react';
import { QrCode, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface WalletConnectDirectProps {
  onConnected?: (address: string, chainId: number) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function WalletConnectDirect({ onConnected, onError, className = '' }: WalletConnectDirectProps) {
  const { language } = useLanguage();
  const en = language === 'en';
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const { EthereumProvider } = await import('@walletconnect/ethereum-provider');

      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'd4f1f06960747d4eaa9257344a89279d';

      const provider = await EthereumProvider.init({
        projectId,
        chains: [56],
        optionalChains: [97],
        showQrModal: true,
        qrModalOptions: {
          themeMode: 'dark',
        },
        metadata: {
          name: 'ARV Super DApp',
          description: 'Independent decentralized exchange on BNB Smart Chain',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://arv-dapp-pro.surge.sh',
          icons: ['https://arv-dapp-pro.surge.sh/arv-logo.png'],
        },
      });

      await provider.connect();

      const accounts = provider.accounts;
      const chainId = Number(provider.chainId);

      if (accounts && accounts.length > 0) {
        // ذخیره در localStorage برای دسترسی
        if (typeof window !== 'undefined') {
          localStorage.setItem('arv_wc_address', accounts[0]);
          localStorage.setItem('arv_wc_chainId', String(chainId));
        }
        if (onConnected) onConnected(accounts[0], chainId);
      }

      provider.on('disconnect', () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('arv_wc_address');
          localStorage.removeItem('arv_wc_chainId');
        }
      });
    } catch (e: any) {
      console.error('WalletConnect error:', e);
      const msg = e?.message || 'خطا در اتصال WalletConnect';
      if (onError) onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className={`w-full flex items-center gap-3 rounded-2xl border border-[var(--arv-blue)] bg-[var(--arv-blue)]/20 px-4 py-4 text-right hover:border-[var(--arv-gold)]/50 hover:bg-[var(--arv-blue)]/40 transition-all disabled:opacity-50 ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--arv-gold)]/10 text-[var(--arv-gold)]">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <QrCode size={18} />}
      </span>
      <span className="flex-1">
        <span className="block font-semibold text-white">WalletConnect</span>
        <span className="block text-xs text-[var(--arv-text-muted)] mt-0.5">
          {en ? 'QR / mobile wallet connection' : 'اتصال QR / کیف پول موبایل'}
        </span>
      </span>
    </button>
  );
}
