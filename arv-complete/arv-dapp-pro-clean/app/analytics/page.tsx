'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Droplets, Link2, BarChart3, Activity, RefreshCw } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { StatCard3D } from '@/components/ui/StatCard3D';
import Skeleton from '@/components/ui/Skeleton';
import { useLanguage } from '@/lib/i18n';
import { fetchAnalytics, type AnalyticsData } from '@/lib/services/analytics-service';
import { shortAddress } from '@/lib/utils';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

export default function AnalyticsPage() {
  const { language } = useLanguage();
  const en = language === 'en';

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const d = await fetchAnalytics();
    setData(d);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 60000); // هر ۱ دقیقه
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-x-hidden">
        <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                <span className="gold-gradient">{en ? 'Analytics' : 'داشبورد آمار'}</span>
              </h1>
              <p className="text-xs text-[var(--arv-text-muted)]">
                {en ? 'Live stats from DEX' : 'آمار زنده از صرافی'}
              </p>
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="p-2 rounded-lg bg-[var(--arv-gold)]/10 border border-[var(--arv-gold)]/30 hover:bg-[var(--arv-gold)]/20 transition-all"
            >
              <RefreshCw size={16} className={'text-[var(--arv-gold)] ' + (loading ? 'animate-spin' : '')} />
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-3">
            {loading && !data ? (
              <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </>
            ) : (
              <>
                <StatCard3D
                  icon={<DollarSign size={20} />}
                  label={en ? 'Total Value Locked' : 'کل نقدینگی'}
                  value={data ? (data.bnbPrice === null ? '—' : '$' + data.tvlUSD.toFixed(2)) : '—'}
                  color="gold"
                  delay={0}
                />
                <StatCard3D
                  icon={<TrendingUp size={20} />}
                  label={en ? 'ARV Price' : 'قیمت ARV'}
                  value={data ? (data.bnbPrice === null ? '—' : '$' + data.arvPrice.toFixed(6)) : '—'}
                  color="green"
                  delay={0.05}
                />
                <StatCard3D
                  icon={<Droplets size={20} />}
                  label={en ? 'Pools' : 'استخرها'}
                  value={data?.poolCount || 0}
                  color="blue"
                  delay={0.1}
                />
                <StatCard3D
                  icon={<Link2 size={20} />}
                  label={en ? 'Network' : 'شبکه'}
                  value={data ? 'Chain #' + data.chainId : '-'}
                  color="purple"
                  delay={0.15}
                />
              </>
            )}
          </div>

          {/* Pool ARV/BNB Details */}
          <GlowCard glowColor="gold">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-[var(--arv-gold)]" />
              <h2 className="font-bold text-sm">
                {en ? 'ARV / BNB Pool' : 'استخر ARV / BNB'}
              </h2>
            </div>

            {loading && !data ? (
              <div className="space-y-2">
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--arv-text-muted)]">ARV Reserve</span>
                  <span className="font-mono font-bold" dir="ltr">
                    <AnimatedNumber value={Number(data?.arvReserve || 0)} decimals={2} /> ARV
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--arv-text-muted)]">BNB Reserve</span>
                  <span className="font-mono font-bold" dir="ltr">
                    <AnimatedNumber value={Number(data?.bnbReserve || 0)} decimals={6} /> BNB
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--arv-text-muted)]">TVL</span>
                  <span className="font-mono font-bold text-[var(--arv-gold)]" dir="ltr">
                    ${data?.bnbPrice === null ? '—' : (data?.tvlUSD.toFixed(2) || '0.00')}
                  </span>
                </div>
                {data?.pairAddress && (
                  <div className="pt-3 border-t border-[var(--arv-gold)]/10">
                    <div className="text-[10px] text-[var(--arv-text-muted)] mb-1">
                      Pair Address
                    </div>
                    <a
                      href={`${data.chainId === 97 ? 'https://testnet.bscscan.com' : 'https://bscscan.com'}/address/${data.pairAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-[var(--arv-gold)] hover:underline"
                      dir="ltr"
                    >
                      {shortAddress(data.pairAddress, 8)}
                    </a>
                  </div>
                )}
              </div>
            )}
          </GlowCard>

          {/* Live Network */}
          <GlowCard glowColor="green">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-[var(--arv-success)]" />
              <span className="font-bold text-xs">
                {en ? 'Live Network' : 'شبکه زنده'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></span>
              <span className="text-[var(--arv-text-muted)]">
                {en ? 'Auto-update every 60s' : 'به‌روزرسانی خودکار هر ۶۰ ثانیه'}
              </span>
            </div>
            {data?.lastUpdate && (
              <div className="text-[10px] text-[var(--arv-text-muted)] mt-2">
                {en ? 'Last update: ' : 'آخرین به‌روزرسانی: '}
                {new Date(data.lastUpdate).toLocaleTimeString()}
              </div>
            )}
          </GlowCard>

        </div>
      </main>
    </div>
  );
}
