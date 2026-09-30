'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Gift, User, Copy, Check, Share2,
  ArrowLeft, Info, AlertTriangle, ExternalLink,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ARV_CONFIG } from '@/lib/arv-config';
import { shortAddress, copyToClipboard } from '@/lib/utils';

type WalletId = 'main' | 'reward' | 'user';

interface WalletOption {
  id: WalletId;
  label: string;
  address: string;
  color: 'gold' | 'green' | 'blue';
  icon: React.ReactNode;
  isAdmin: boolean;
}

export default function ReceivePage() {
  const router = useRouter();
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletId | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const wallets: WalletOption[] = [
      {
        id: 'main',
        label: 'کیف اصلی',
        address: ARV_CONFIG.wallets.main.address,
        color: 'gold',
        icon: <Shield size={20} />,
        isAdmin: true,
      },
      {
        id: 'reward',
        label: 'کیف پاداش',
        address: ARV_CONFIG.wallets.reward.address,
        color: 'green',
        icon: <Gift size={20} />,
        isAdmin: true,
      },
      {
        id: 'user',
        label: 'کیف کاربر',
        address: localStorage.getItem('arv_user_address') || '',
        color: 'blue',
        icon: <User size={20} />,
        isAdmin: false,
      },
    ];

    setWalletOptions(wallets);

    const userAddress = localStorage.getItem('arv_user_address');
    if (userAddress) {
      setSelectedWallet('user');
    } else {
      setSelectedWallet('main');
    }
  }, []);

  const selected = walletOptions.find((w) => w.id === selectedWallet);

  const handleCopy = async () => {
    if (!selected?.address) return;
    const ok = await copyToClipboard(selected.address);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!selected?.address) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'ARV Wallet Address',
          text: 'آدرس کیف پول ARV من: ' + selected.address,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <Header />
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">
                <span className="gold-gradient">دریافت ARV</span>
              </h1>
              <p className="text-xs text-[var(--arv-text-muted)]">
                آدرس کیف پول خود را به اشتراک بگذارید
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {walletOptions.map((wallet) => {
              const isActive = selectedWallet === wallet.id;
              const hasAddress = !!wallet.address;
              return (
                <button
                  key={wallet.id}
                  onClick={() => hasAddress && setSelectedWallet(wallet.id)}
                  disabled={!hasAddress}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    isActive
                      ? 'border-[var(--arv-gold)] bg-[var(--arv-gold)]/10'
                      : hasAddress
                      ? 'border-[var(--arv-blue)]/40 hover:border-[var(--arv-gold)]/40'
                      : 'border-[var(--arv-blue)]/20 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-2 ${
                      wallet.color === 'gold'
                        ? 'bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]'
                        : wallet.color === 'green'
                        ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                        : 'bg-blue-400/15 text-blue-400'
                    }`}
                  >
                    {wallet.icon}
                  </div>
                  <div className="text-xs font-bold">{wallet.label}</div>
                </button>
              );
            })}
          </div>

          {selected?.address && (
            <>
              <GlowCard glowColor={selected.color} className="text-center">
                <div className="py-4">
                  <div className="text-xs text-[var(--arv-text-muted)] mb-4">
                    کد QR برای دریافت ARV
                  </div>
                  <div className="inline-block p-4 bg-white rounded-2xl">
                    <QRCodeSVG
                      value={selected.address}
                      size={200}
                      level="H"
                      fgColor="#0a1929"
                    />
                  </div>
                  <div className="mt-4 text-xs text-[var(--arv-text-muted)]">
                    با اپ کیف پول اسکن کنید
                  </div>
                </div>
              </GlowCard>

              <GlowCard glowColor="blue">
                <div className="mb-3">
                  <div className="text-xs text-[var(--arv-text-muted)] mb-2">
                    آدرس {selected.label}
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20">
                    <code
                      className="font-mono text-xs break-all block text-center"
                      dir="ltr"
                    >
                      {selected.address}
                    </code>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <GradientButton
                    variant="gold"
                    size="md"
                    fullWidth
                    onClick={handleCopy}
                    icon={copied ? <Check size={16} /> : <Copy size={16} />}
                  >
                    {copied ? 'کپی شد' : 'کپی آدرس'}
                  </GradientButton>

                  <GradientButton
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={handleShare}
                    icon={<Share2 size={16} />}
                  >
                    اشتراک‌گذاری
                  </GradientButton>
                </div>
              </GlowCard>

              <a
                href={`${ARV_CONFIG.network.explorer}/address/${selected.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <GlowCard glowColor="green" hover>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--arv-success)]/15 flex items-center justify-center">
                        <ExternalLink size={18} className="text-[var(--arv-success)]" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">مشاهده در BscScan</div>
                        <div className="text-xs text-[var(--arv-text-muted)]">
                          تراکنش‌ها و موجودی
                        </div>
                      </div>
                    </div>
                    <ArrowLeft size={18} className="rotate-180 text-[var(--arv-text-muted)]" />
                  </div>
                </GlowCard>
              </a>
            </>
          )}

          <GlowCard glowColor="gold" className="border-r-4 border-[var(--arv-warning)]">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={20}
                className="text-[var(--arv-warning)] flex-shrink-0 mt-1"
              />
              <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
                <div className="font-bold text-[var(--arv-warning)] mb-2">
                  توجه مهم
                </div>
                <div>• فقط توکن ARV (BEP-20) به این آدرس بفرستید</div>
                <div>• شبکه باید {ARV_CONFIG.network.nameShort} باشد</div>
                <div>• ارسال به شبکه اشتباه = از دست دادن دارایی</div>
                <div>• آدرس را با دقت بررسی کنید</div>
              </div>
            </div>
          </GlowCard>

          <GlowCard glowColor="blue">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-400 flex-shrink-0 mt-1" />
              <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
                <div className="font-bold text-white mb-2">اطلاعات شبکه</div>
                <div>• نام: {ARV_CONFIG.network.name}</div>
                <div>• Chain ID: {ARV_CONFIG.network.chainId}</div>
                <div>• استاندارد: {ARV_CONFIG.token.standard}</div>
                <div>• قرارداد: {shortAddress(ARV_CONFIG.token.address, 6)}</div>
              </div>
            </div>
          </GlowCard>

        </div>
      </main>
    </div>
  );
}
