'use client';

import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import {
  Wallet,
  TrendingUp,
  Users,
  Activity,
  Coins,
  Gift,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { ARV_CONFIG } from '@/lib/arv-config';
import { getARVBalance, getTokenInfo } from '@/lib/services/token-service';
import { formatNumber, shortAddress } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const [arvBalance, setArvBalance] = useState<bigint>(0n);
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // بارگذاری اطلاعات توکن
  useEffect(() => {
    loadTokenInfo();
  }, []);

  // بارگذاری موجودی وقتی آدرس تغییر کرد
  useEffect(() => {
    if (address) loadBalance(address);
  }, [address]);

  async function loadTokenInfo() {
    try {
      const info = await getTokenInfo();
      setTokenInfo(info);
    } catch (e) {
      console.error('خطا در بارگذاری اطلاعات توکن:', e);
    }
  }

  async function loadBalance(addr: string) {
    setLoading(true);
    try {
      const bal = await getARVBalance(addr);
      setArvBalance(bal);
    } catch (e) {
      console.error('خطا در بارگذاری موجودی:', e);
    } finally {
      setLoading(false);
    }
  }

  const decimals = tokenInfo?.decimals ?? 18;
  const formattedBalance = formatUnits(arvBalance, decimals);
  const totalSupplyFormatted = tokenInfo
    ? formatUnits(tokenInfo.totalSupply, decimals)
    : '0';

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden">
        <Header />

        <div className="p-4 md:p-6 space-y-6">
          {/* Hero */}
          <section className="arv-card relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  <span className="gold-gradient">ARV</span> توکن
                </h1>
                <p className="text-[var(--arv-text-muted)] mb-2">
                  قدرت جامعه، آینده‌ی خبر
                </p>
                <p className="text-sm text-[var(--arv-text-muted)] leading-relaxed">
                  ARV توکن رسمی پلتفرم خبری اروند است؛ یک اکوسیستم غیرمتمرکز
                  برای حمایت از آزادی خبر، شفافیت و مشارکت جامعه.
                </p>
                <div className="flex gap-3 mt-6 flex-wrap">
                  <a
                    href={ARV_CONFIG.links.bscscanToken}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arv-btn-gold flex items-center gap-2 text-sm"
                  >
                    مشاهده قرارداد
                    <ExternalLink size={16} />
                  </a>
                  <a
                    href={ARV_CONFIG.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl border border-[var(--arv-gold)]/40 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/10 transition-all text-sm"
                  >
                    درباره پروژه
                  </a>
                </div>
              </div>

              {/* Logo */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[var(--arv-gold)] to-[var(--arv-gold-light)] flex items-center justify-center shadow-2xl shadow-[var(--arv-gold)]/20">
                <span className="text-[var(--arv-blue-dark)] text-5xl md:text-6xl font-bold">
                  ARV
                </span>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Coins size={20} />}
              label="عرضه کل"
              value={formatNumber(Number(totalSupplyFormatted))}
              sub={`${tokenInfo?.symbol || 'ARV'}`}
              color="gold"
            />
            <StatCard
              icon={<Users size={20} />}
              label="کیف اصلی (۶۰٪)"
              value={formatNumber(
                Number(totalSupplyFormatted) * 0.6
              )}
              sub="ARV"
              color="blue"
            />
            <StatCard
              icon={<Gift size={20} />}
              label="کیف پاداش (۴۰٪)"
              value={formatNumber(
                Number(totalSupplyFormatted) * 0.4
              )}
              sub="ARV"
              color="green"
            />
            <StatCard
              icon={<Activity size={20} />}
              label="شبکه"
              value="Testnet"
              sub={`Chain ${ARV_CONFIG.network.chainId}`}
              color="purple"
            />
          </section>

          {/* Balance Card */}
          <section className="arv-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--arv-gold)]/10 flex items-center justify-center">
                  <Wallet size={20} className="text-[var(--arv-gold)]" />
                </div>
                <div>
                  <div className="font-bold">کیف پول شما</div>
                  <div className="text-xs text-[var(--arv-text-muted)]">
                    {isConnected && address ? shortAddress(address) : 'وصل نشده'}
                  </div>
                </div>
              </div>
              {isConnected && (
                <button
                  onClick={() => address && loadBalance(address)}
                  className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
                  disabled={loading}
                >
                  <RefreshCw
                    size={18}
                    className={loading ? 'animate-spin' : ''}
                  />
                </button>
              )}
            </div>

            <div className="text-4xl font-bold gold-gradient mb-2">
              {isConnected ? formattedBalance : '0.00'}
            </div>
            <div className="text-sm text-[var(--arv-text-muted)]">
              ARV Tokens
            </div>

            {!isConnected && (
              <div className="mt-4 text-sm text-[var(--arv-warning)]">
                برای مشاهده موجودی، کیف پول خود را متصل کنید
              </div>
            )}
          </section>

          {/* Token Info */}
          {tokenInfo && (
            <section className="arv-card">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-[var(--arv-gold)]" />
                اطلاعات توکن ARV
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <InfoRow label="نام" value={tokenInfo.name} />
                <InfoRow label="نماد" value={tokenInfo.symbol} />
                <InfoRow label="اعشار" value={tokenInfo.decimals.toString()} />
                <InfoRow
                  label="شبکه"
                  value={ARV_CONFIG.network.name}
                />
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction
              href="/send"
              icon={<ArrowUpRight size={24} />}
              label="ارسال"
              color="gold"
            />
            <QuickAction
              href="/receive"
              icon={<Wallet size={24} />}
              label="دریافت"
              color="blue"
            />
            <QuickAction
              href="/swap"
              icon={<RefreshCw size={24} />}
              label="سواپ"
              color="green"
            />
            <QuickAction
              href="/history"
              icon={<Activity size={24} />}
              label="تاریخچه"
              color="purple"
            />
          </section>
        </div>
      </main>
    </div>
  );
}

// ===== کامپوننت‌های کمکی =====

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: 'gold' | 'blue' | 'green' | 'purple';
}) {
  const colorMap = {
    gold: 'text-[var(--arv-gold)]',
    blue: 'text-[var(--arv-blue-light)]',
    green: 'text-[var(--arv-success)]',
    purple: 'text-purple-400',
  };
  return (
    <div className="arv-card">
      <div className={`${colorMap[color]} mb-2`}>{icon}</div>
      <div className="text-xs text-[var(--arv-text-muted)] mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-[var(--arv-text-muted)] mt-1">{sub}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[var(--arv-text-muted)] mb-1">{label}</div>
      <div className="font-bold text-sm">{value}</div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: 'gold' | 'blue' | 'green' | 'purple';
}) {
  const colorMap = {
    gold: 'text-[var(--arv-gold)] border-[var(--arv-gold)]/30',
    blue: 'text-[var(--arv-blue-light)] border-[var(--arv-blue-light)]/30',
    green: 'text-[var(--arv-success)] border-[var(--arv-success)]/30',
    purple: 'text-purple-400 border-purple-400/30',
  };
  return (
    <a
      href={href}
      className={`arv-card flex flex-col items-center gap-2 py-6 border-2 ${colorMap[color]} hover:scale-105 transition-transform`}
    >
      {icon}
      <span className="text-sm font-bold">{label}</span>
    </a>
  );
}
