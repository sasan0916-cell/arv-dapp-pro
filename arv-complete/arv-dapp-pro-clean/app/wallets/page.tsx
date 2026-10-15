'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wallet, Plus, RotateCcw, Shield, Gift, User, Copy, Eye,
  EyeOff, Check, ExternalLink, Trash2, KeyRound, Fingerprint,
  ArrowUpRight, ArrowDownRight, Send, Download, RefreshCw, DollarSign
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import TokenLogo from '@/components/ui/TokenLogo';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import Skeleton from '@/components/ui/Skeleton';
import { ARV_CONFIG } from '@/lib/arv-config';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { shortAddress, copyToClipboard } from '@/lib/utils';
import { getARVBalance, getBNBBalance } from '@/lib/services/token-service';
import { formatUnits } from 'viem';
import { PortfolioCard } from '@/components/ui/PortfolioCard';

interface WalletCard {
  id: 'main' | 'reward' | 'user';
  label: string;
  address: string;
  share?: number;
  amount?: string;
  isAdmin: boolean;
  hasWallet: boolean;
  hasBiometric: boolean;
  color: 'gold' | 'blue' | 'green';
  icon: React.ReactNode;
}

export default function WalletsPage() {
  const router = useRouter();
  const { isAdmin } = useUserRole();
  const { address: connectedAddress } = useAccount();
  const [wallets, setWallets] = useState<WalletCard[]>([
    {
      id: 'user',
      label: 'کیف کاربر',
      address: '',
      isAdmin: false,
      hasWallet: false,
      hasBiometric: false,
      color: 'blue',
      icon: <User size={24} />,
    },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hideAddress, setHideAddress] = useState<Record<string, boolean>>({});
  const [userAssets, setUserAssets] = useState({
    arv: '0',
    bnb: '0',
    loading: true,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async () => {
        const { storageHas } = await import('@/lib/services/storage');
        const updated = await Promise.all(wallets.map(async (w) => ({
          ...w,
          address: w.address || localStorage.getItem('arv_' + w.id + '_address') || '',
          hasWallet: await storageHas(`arv_wallet_${w.id}`),
          hasBiometric: !!localStorage.getItem(`arv_cred_${w.id}`),
        })));
        setWallets(updated);
      })();
    }
  }, []);

  // خواندن دارایی‌های کاربر
  useEffect(() => {
    async function loadAssets() {
      if (!connectedAddress) {
        setUserAssets({ arv: '0', bnb: '0', loading: false });
        return;
      }
      try {
        setUserAssets((s) => ({ ...s, loading: true }));
        const [arvBal, bnbBal] = await Promise.all([
          getARVBalance(connectedAddress),
          getBNBBalance(connectedAddress),
        ]);
        setUserAssets({
          arv: formatUnits(arvBal, 18),
          bnb: formatUnits(bnbBal, 18),
          loading: false,
        });
      } catch (e) {
        console.error(e);
        setUserAssets((s) => ({ ...s, loading: false }));
      }
    }
    loadAssets();
    const id = setInterval(loadAssets, 30000);
    return () => clearInterval(id);
  }, [connectedAddress]);

  const handleCopy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleHide = (id: string) => {
    setHideAddress((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleWallets = isAdmin ? wallets : wallets.filter((w) => w.isAdmin === false);

  // قیمت‌های شبیه‌سازی‌شده برای محاسبه دلاری
  const PRICES = {
    ARV: 0.00245,
    BNB: 612.45,
  };

  const arvValue = Number(userAssets.arv) * PRICES.ARV;
  const bnbValue = Number(userAssets.bnb) * PRICES.BNB;
  const totalValue = arvValue + bnbValue;

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-x-hidden">
        <div className="p-4 md:p-6 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              <span className="gold-gradient">کیف پول‌های من</span>
            </h1>
            <p className="text-sm text-[var(--arv-text-muted)]">
              مدیریت کیف پول‌های مستقل ARV
            </p>
          </div>

          {/* Total Portfolio Value Card */}
          {connectedAddress && (
            <GlowCard glowColor="gold">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--arv-gold)] to-yellow-600 flex items-center justify-center shadow-lg shadow-[var(--arv-gold)]/30">
                    <DollarSign size={24} className="text-[#050912]" />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--arv-text-muted)]">ارزش کل دارایی</div>
                    <div className="text-2xl md:text-3xl font-bold gold-gradient">
                      {userAssets.loading ? (
                        <Skeleton className="h-8 w-32 mt-1" />
                      ) : (
                        <AnimatedNumber value={totalValue} decimals={2} prefix="$" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--arv-text-muted)]">شبکه</div>
                  <div className="text-sm font-bold">{ARV_CONFIG.network.nameShort}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--arv-text-muted)]">
                <span className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></span>
                <span>به‌روزرسانی خودکار هر ۳۰ ثانیه</span>
              </div>
            </GlowCard>
          )}

          {/* Assets Section */}
          {connectedAddress && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Wallet size={18} className="text-[var(--arv-gold)]" />
                  دارایی‌های من
                </h2>
                <button
                  onClick={() => {
                    if (connectedAddress) {
                      getARVBalance(connectedAddress).then(b => setUserAssets(s => ({ ...s, arv: formatUnits(b, 18) })));
                      getBNBBalance(connectedAddress).then(b => setUserAssets(s => ({ ...s, bnb: formatUnits(b, 18) })));
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {/* ARV Asset */}
                <div className="arv-card hover:scale-[1.01] transition-all">
                  <div className="flex items-center gap-3">
                    <TokenLogo symbol="ARV" size={40} />
                    <div className="flex-1">
                      <div className="font-bold text-sm">ARV</div>
                      <div className="text-[10px] text-[var(--arv-text-muted)]">Arvand Khabar</div>
                    </div>
                    <div className="text-right">
                      {userAssets.loading ? (
                        <Skeleton className="h-5 w-20 mb-1" />
                      ) : (
                        <>
                          <div className="font-bold text-sm" dir="ltr">
                            <AnimatedNumber value={Number(userAssets.arv)} decimals={2} suffix=" ARV" />
                          </div>
                          <div className="text-[10px] text-[var(--arv-gold)]" dir="ltr">
                            ${(Number(userAssets.arv) * PRICES.ARV).toFixed(2)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link href="/send" className="flex-1 text-center py-1.5 rounded-lg bg-[var(--arv-gold)]/15 text-[var(--arv-gold)] text-xs font-bold hover:bg-[var(--arv-gold)]/25 transition-all flex items-center justify-center gap-1">
                      <Send size={12} /> ارسال
                    </Link>
                    <Link href="/receive" className="flex-1 text-center py-1.5 rounded-lg bg-blue-400/15 text-blue-400 text-xs font-bold hover:bg-blue-400/25 transition-all flex items-center justify-center gap-1">
                      <Download size={12} /> دریافت
                    </Link>
                  </div>
                </div>

                {/* BNB Asset */}
                <div className="arv-card hover:scale-[1.01] transition-all">
                  <div className="flex items-center gap-3">
                    <TokenLogo symbol="BNB" size={40} />
                    <div className="flex-1">
                      <div className="font-bold text-sm">BNB</div>
                      <div className="text-[10px] text-[var(--arv-text-muted)]">Binance Coin</div>
                    </div>
                    <div className="text-right">
                      {userAssets.loading ? (
                        <Skeleton className="h-5 w-20 mb-1" />
                      ) : (
                        <>
                          <div className="font-bold text-sm" dir="ltr">
                            <AnimatedNumber value={Number(userAssets.bnb)} decimals={4} suffix=" BNB" />
                          </div>
                          <div className="text-[10px] text-[var(--arv-gold)]" dir="ltr">
                            ${(Number(userAssets.bnb) * PRICES.BNB).toFixed(2)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Portfolio Card */}
          <PortfolioCard />

          {/* Wallet Cards */}
          <div className="space-y-4">
            {visibleWallets.map((wallet, i) => (
              <GlowCard key={wallet.id} glowColor={wallet.color} delay={i * 0.1}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        wallet.color === 'gold'
                          ? 'bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]'
                          : wallet.color === 'green'
                          ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                          : 'bg-blue-400/15 text-blue-400'
                      }`}
                    >
                      {wallet.icon}
                    </div>
                    <div>
                      <div className="font-bold text-lg flex items-center gap-2">
                        {wallet.label}
                        {wallet.isAdmin && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]">
                            مدیرکل
                          </span>
                        )}
                      </div>
                      {wallet.share && (
                        <div className="text-xs text-[var(--arv-text-muted)]">
                          {wallet.share}% از عرضه کل
                        </div>
                      )}
                    </div>
                  </div>

                  {wallet.hasWallet && (
                    <div className="flex items-center gap-1">
                      {wallet.hasBiometric && (
                        <div className="w-8 h-8 rounded-lg bg-[var(--arv-success)]/15 flex items-center justify-center">
                          <Fingerprint size={16} className="text-[var(--arv-success)]" />
                        </div>
                      )}
                      <div className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></div>
                    </div>
                  )}
                </div>

                {wallet.address || wallet.hasWallet ? (
                  <>
                    <div className="mb-3">
                      <label className="text-xs text-[var(--arv-text-muted)] mb-1 block">
                        آدرس
                      </label>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20">
                        <code className="flex-1 font-mono text-xs overflow-hidden text-ellipsis">
                          {hideAddress[wallet.id]
                            ? '•'.repeat(42)
                            : wallet.address}
                        </code>
                        <button
                          onClick={() => toggleHide(wallet.id)}
                          className="text-[var(--arv-text-muted)] hover:text-white"
                        >
                          {hideAddress[wallet.id] ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(wallet.address, wallet.id)}
                          className="text-[var(--arv-gold)] hover:text-[var(--arv-gold-light)]"
                        >
                          {copiedId === wallet.id ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {wallet.amount && (
                      <div className="mb-4">
                        <div className="text-xs text-[var(--arv-text-muted)] mb-1">
                          موجودی اولیه
                        </div>
                        <div className="text-2xl font-bold gold-gradient">
                          {Number(wallet.amount).toLocaleString('fa-IR')} ARV
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {wallet.hasWallet ? (
                        <>
                          <GradientButton variant="gold" size="sm" onClick={() => router.push(`/wallets/${wallet.id}/`)}>
                            ورود
                          </GradientButton>
                          <GradientButton variant="outline" size="sm" onClick={() => {}}>
                            <Trash2 size={14} />
                          </GradientButton>
                        </>
                      ) : (
                        <>
                          <GradientButton
                            variant="gold"
                            size="sm"
                            href={`/wallets/restore?wallet=${wallet.id}`}
                            icon={<KeyRound size={14} />}
                          >
                            ساخت / بازیابی
                          </GradientButton>
                          <a
                            href={`${ARV_CONFIG.links.bscscanMainWallet}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl text-xs border border-[var(--arv-gold)]/40 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/10 flex items-center gap-1"
                          >
                            BscScan <ExternalLink size={12} />
                          </a>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-sm text-[var(--arv-text-muted)] mb-4">
                      هنوز کیف پولی نساخته‌اید
                    </div>
                    <div className="flex gap-2 justify-center">
                      <GradientButton
                        variant="gold"
                        size="sm"
                        href="/wallets/create"
                        icon={<Plus size={14} />}
                      >
                        ساخت کیف جدید
                      </GradientButton>
                      <GradientButton
                        variant="outline"
                        size="sm"
                        href="/wallets/restore"
                        icon={<RotateCcw size={14} />}
                      >
                        بازیابی
                      </GradientButton>
                    </div>
                  </div>
                )}
              </GlowCard>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/wallets/create">
              <GlowCard glowColor="gold" hover>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--arv-gold)]/15 flex items-center justify-center">
                    <Plus size={24} className="text-[var(--arv-gold)]" />
                  </div>
                  <div>
                    <div className="font-bold">ساخت کیف جدید</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">
                      ۱۲ کلمه بازیابی
                    </div>
                  </div>
                </div>
              </GlowCard>
            </Link>

            <Link href="/wallets/restore">
              <GlowCard glowColor="blue" hover>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-400/15 flex items-center justify-center">
                    <RotateCcw size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="font-bold">بازیابی</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">
                      ۱۲ کلمه یا ۶۴ کاراکتر
                    </div>
                  </div>
                </div>
              </GlowCard>
            </Link>
          </div>

          {/* Info */}
          <GlowCard glowColor="gold">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-[var(--arv-gold)] flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold mb-2">امنیت کیف پول</div>
                <ul className="text-sm text-[var(--arv-text-muted)] space-y-1 list-disc pr-4">
                  <li>کلید خصوصی شما فقط روی دستگاه شما ذخیره می‌شود (رمزنگاری‌شده)</li>
                  <li>هرگز کلید خصوصی خود را با کسی به اشتراک نگذارید</li>
                  <li>۱۲ کلمه بازیابی را در جای امن یادداشت کنید</li>
                  <li>اثر انگشت را برای امنیت بیشتر فعال کنید</li>
                </ul>
              </div>
            </div>
          </GlowCard>

        </div>
      </main>
    </div>
  );
}
