'use client';

import Image from 'next/image';

import {
  Coins, Shield, Gift, PieChart, TrendingUp, Info, ExternalLink,
  Copy, Check, Calendar, Lock, Users, Award,
} from 'lucide-react';
import { useState } from 'react';
import {
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { GlowCard } from '@/components/ui/GlowCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { ARV_CONFIG } from '@/lib/arv-config';
import { shortAddress, copyToClipboard, formatNumber } from '@/lib/utils';

const DISTRIBUTION_DATA = [
  {
    name: 'کیف اصلی',
    value: 60,
    color: '#d4af37',
    label: 'کیف اصلی (۶۰٪)',
  },
  {
    name: 'کیف پاداش',
    value: 40,
    color: '#48bb78',
    label: 'کیف پاداش (۴۰٪)',
  },
];

export default function TokenomicsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const tokenInfo = [
    { label: 'نام توکن', value: ARV_CONFIG.token.name },
    { label: 'نماد', value: ARV_CONFIG.token.symbol },
    { label: 'اعشار', value: ARV_CONFIG.token.decimals.toString() },
    { label: 'استاندارد', value: ARV_CONFIG.token.standard },
    { label: 'شبکه', value: ARV_CONFIG.network.nameShort },
    { label: 'Chain ID', value: ARV_CONFIG.network.chainId.toString() },
  ];

  const supplyInfo = [
    {
      label: 'عرضه Testnet',
      value: Number(ARV_CONFIG.token.totalSupplyTestnet),
      color: 'gold' as const,
      icon: <Coins size={20} />,
    },
    {
      label: 'عرضه Mainnet',
      value: Number(ARV_CONFIG.token.totalSupplyMainnet),
      color: 'green' as const,
      icon: <TrendingUp size={20} />,
    },
  ];

  const vestingSchedule = [
    {
      phase: 'Testnet',
      percent: 100,
      unlock: 'آزاد شده',
      status: 'done' as const,
    },
    {
      phase: 'Mainnet - فاز ۱',
      percent: 30,
      unlock: 'پس از راه‌اندازی',
      status: 'pending' as const,
    },
    {
      phase: 'Mainnet - فاز ۲',
      percent: 40,
      unlock: '۶ ماه بعد',
      status: 'pending' as const,
    },
    {
      phase: 'Mainnet - فاز ۳',
      percent: 30,
      unlock: '۱۲ ماه بعد',
      status: 'pending' as const,
    },
  ];

  return (
    <div className="flex min-h-screen">
      
      <main className="flex-1 overflow-x-hidden">
        
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              <span className="gold-gradient">توکنومیک ARV</span>
            </h1>
            <p className="text-xs text-[var(--arv-text-muted)]">
              اقتصاد توکن و توزیع عرضه
            </p>
          </div>

          {/* Hero */}
          <GlowCard glowColor="gold">
            <div className="text-center py-4">
              <div className="w-24 h-24 mx-auto relative rounded-full overflow-hidden shadow-2xl shadow-[var(--arv-gold)]/30 mb-4">
                <Image
                  src="/arv-logo.png"
                  alt="ARV Logo"
                  fill
                  sizes="96px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-2xl font-bold mb-1">
                <span className="gold-gradient">{ARV_CONFIG.token.name}</span>
              </div>
              <div className="text-sm text-[var(--arv-text-muted)] mb-4">
                {ARV_CONFIG.token.symbol} • {ARV_CONFIG.token.standard} • {ARV_CONFIG.network.nameShort}
              </div>
              <div className="inline-block px-4 py-2 rounded-full bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/30">
                <span className="text-xs text-[var(--arv-text-muted)]">عرضه کل Mainnet: </span>
                <span className="font-bold gold-gradient">
                  {formatNumber(Number(ARV_CONFIG.token.totalSupplyMainnet))} ARV
                </span>
              </div>
            </div>
          </GlowCard>

          {/* Supply */}
          <div className="grid grid-cols-2 gap-4">
            {supplyInfo.map((item, i) => (
              <GlowCard key={i} glowColor={item.color} delay={i * 0.1}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.color === 'gold'
                        ? 'bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]'
                        : 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="text-xs text-[var(--arv-text-muted)]">
                    {item.label}
                  </div>
                </div>
                <div
                  className={`text-2xl md:text-3xl font-bold ${
                    item.color === 'gold' ? 'gold-gradient' : 'text-[var(--arv-success)]'
                  }`}
                >
                  <AnimatedNumber value={item.value} decimals={0} />
                </div>
                <div className="text-xs text-[var(--arv-text-muted)] mt-1">ARV</div>
              </GlowCard>
            ))}
          </div>

          {/* Distribution Chart */}
          <GlowCard glowColor="gold">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <PieChart size={20} className="text-[var(--arv-gold)]" />
              توزیع عرضه
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Pie Chart */}
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <RePieChart>
                    <Pie
                      data={DISTRIBUTION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {DISTRIBUTION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#1e3a5f',
                        border: '1px solid rgba(212,175,55,0.3)',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                      formatter={(v: any) => [`${v}%`, 'سهم']}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {DISTRIBUTION_DATA.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--arv-blue)]/20"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ background: item.color }}
                      />
                      <span className="text-sm font-bold">{item.name}</span>
                    </div>
                    <span
                      className="text-lg font-bold"
                      style={{ color: item.color }}
                    >
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlowCard>

          {/* Wallets */}
          <GlowCard glowColor="gold">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Shield size={20} className="text-[var(--arv-gold)]" />
              کیف پول‌های توزیع
            </h2>

            <div className="space-y-3">
              {/* Main */}
              <div className="p-4 rounded-xl bg-[var(--arv-gold)]/10 border border-[var(--arv-gold)]/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-[var(--arv-gold)]" />
                    <span className="font-bold text-sm">کیف اصلی</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--arv-gold)]">
                    ۶۰٪ • {formatNumber(6000000)} ARV
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--arv-blue)]/40">
                  <code className="flex-1 font-mono text-xs truncate" dir="ltr">
                    {ARV_CONFIG.wallets.main.address}
                  </code>
                  <button
                    onClick={() => handleCopy(ARV_CONFIG.wallets.main.address, 'main')}
                    className="text-[var(--arv-gold)]"
                  >
                    {copiedId === 'main' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Reward */}
              <div className="p-4 rounded-xl bg-[var(--arv-success)]/10 border border-[var(--arv-success)]/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gift size={18} className="text-[var(--arv-success)]" />
                    <span className="font-bold text-sm">کیف پاداش</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--arv-success)]">
                    ۴۰٪ • {formatNumber(4000000)} ARV
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--arv-blue)]/40">
                  <code className="flex-1 font-mono text-xs truncate" dir="ltr">
                    {ARV_CONFIG.wallets.reward.address}
                  </code>
                  <button
                    onClick={() => handleCopy(ARV_CONFIG.wallets.reward.address, 'reward')}
                    className="text-[var(--arv-gold)]"
                  >
                    {copiedId === 'reward' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Token Info */}
          <GlowCard glowColor="blue">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Info size={20} className="text-blue-400" />
              اطلاعات توکن
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tokenInfo.map((item, i) => (
                <div key={i}>
                  <div className="text-xs text-[var(--arv-text-muted)] mb-1">
                    {item.label}
                  </div>
                  <div className="font-bold text-sm">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--arv-blue)]/40">
              <div className="text-xs text-[var(--arv-text-muted)] mb-2">
                آدرس قرارداد
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--arv-blue)]/30">
                <code className="flex-1 font-mono text-xs truncate" dir="ltr">
                  {ARV_CONFIG.token.address}
                </code>
                <button
                  onClick={() => handleCopy(ARV_CONFIG.token.address, 'token')}
                  className="text-[var(--arv-gold)]"
                >
                  {copiedId === 'token' ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <a
                  href={ARV_CONFIG.links.bscscanToken}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--arv-gold)]"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </GlowCard>

          {/* Vesting Schedule */}
          <GlowCard glowColor="purple">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-purple-400" />
              برنامه آزادسازی (Vesting)
            </h2>

            <div className="space-y-3">
              {vestingSchedule.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    item.status === 'done'
                      ? 'bg-[var(--arv-success)]/10 border border-[var(--arv-success)]/30'
                      : 'bg-[var(--arv-blue)]/20 border border-[var(--arv-blue)]/40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.status === 'done'
                        ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                        : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'
                    }`}
                  >
                    {item.status === 'done' ? <Check size={18} /> : <Lock size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{item.phase}</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">
                      {item.unlock}
                    </div>
                  </div>
                  <div className="text-lg font-bold gold-gradient">
                    {item.percent}%
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Info */}
          <GlowCard glowColor="gold">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-[var(--arv-gold)] flex-shrink-0 mt-1" />
              <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
                <div className="font-bold text-white mb-2">درباره توکنومیک</div>
                <div>• توزیع ۶۰/۴۰ بین کیف اصلی و پاداش</div>
                <div>• عرضه Testnet: ۱۰ میلیون ARV (فعال)</div>
                <div>• عرضه Mainnet: ۱۰۰ میلیون ARV (آینده)</div>
                <div>• برنامه Vesting برای جلوگیری از فروش ناگهانی</div>
              </div>
            </div>
          </GlowCard>

        </div>
      </main>
    </div>
  );
}
