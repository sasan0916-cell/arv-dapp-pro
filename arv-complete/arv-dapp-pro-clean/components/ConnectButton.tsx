'use client';

import { useMemo, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut, X, Smartphone, Globe, QrCode, ShieldCheck } from 'lucide-react';
import { shortAddress } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

function connectorIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('walletconnect')) return <QrCode size={18} />;
  if (lower.includes('coinbase')) return <Smartphone size={18} />;
  if (lower.includes('metamask')) return <Wallet size={18} />;
  return <Globe size={18} />;
}

export function ConnectButton() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const visibleConnectors = useMemo(() => {
    const seen = new Set<string>();
    return connectors.filter((item) => {
      // Some browsers expose the same injected provider more than once.
      const key = `${item.id}:${item.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [connectors]);

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        title={connector?.name ?? 'External wallet'}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--arv-gold)]/10 border border-[var(--arv-gold)]/40 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/20 transition-all text-sm"
      >
        <ShieldCheck size={16} />
        <span className="font-mono text-xs">{shortAddress(address)}</span>
        <LogOut size={14} />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="arv-btn-gold flex items-center gap-2 text-sm"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Wallet size={16} />
        {isPending
          ? language === 'en' ? 'Connecting...' : 'در حال اتصال...'
          : language === 'en' ? 'Connect Wallet' : 'اتصال کیف پول'}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-3" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="connect-wallet-title"
            className="w-full max-w-md rounded-3xl border border-[var(--arv-gold)]/20 bg-[var(--arv-blue-dark)] shadow-2xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--arv-blue)]">
              <div>
                <h2 id="connect-wallet-title" className="text-lg font-bold text-white">
                  {language === 'en' ? 'Connect an external wallet' : 'اتصال کیف پول خارجی'}
                </h2>
                <p className="text-xs text-[var(--arv-text-muted)] mt-1">
                  {language === 'en'
                    ? 'Your private key stays inside your wallet.'
                    : 'کلید خصوصی داخل کیف پول شما باقی می‌ماند.'}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-white/5" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {visibleConnectors.map((item) => (
                <button
                  key={item.uid}
                  onClick={() => {
                    connect({ connector: item });
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 rounded-2xl border border-[var(--arv-blue)] bg-[var(--arv-blue)]/20 px-4 py-4 text-right hover:border-[var(--arv-gold)]/50 hover:bg-[var(--arv-blue)]/40 transition-all"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--arv-gold)]/10 text-[var(--arv-gold)]">
                    {connectorIcon(item.name)}
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-white">{item.name}</span>
                    <span className="block text-xs text-[var(--arv-text-muted)] mt-0.5">
                      {item.name.toLowerCase().includes('walletconnect')
                        ? language === 'en' ? 'QR / mobile wallet connection' : 'اتصال QR / کیف پول موبایل'
                        : language === 'en' ? 'Sign securely in your wallet' : 'امضای امن داخل کیف پول'}
                    </span>
                  </span>
                </button>
              ))}

              {visibleConnectors.length === 0 && (
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                  {language === 'en'
                    ? 'No external wallet provider was detected. Open this DApp inside a wallet browser or use WalletConnect.'
                    : 'هیچ کیف پول خارجی شناسایی نشد. DApp را داخل مرورگر کیف پول باز کنید یا از WalletConnect استفاده کنید.'}
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                  {error.message}
                </div>
              )}
            </div>

            <div className="px-5 pb-5 text-[11px] text-[var(--arv-text-muted)] leading-5">
              {language === 'en'
                ? 'External wallets can approve and sign swaps, approvals and transfers without exposing private keys to ARV Super DApp.'
                : 'کیف پول‌های خارجی می‌توانند Swap، Approval و انتقال را بدون افشای کلید خصوصی برای ARV Super DApp تأیید و امضا کنند.'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
