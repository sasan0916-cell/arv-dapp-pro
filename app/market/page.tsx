'use client';

import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Activity, Droplets, BarChart3,
  Users, DollarSign, RefreshCw, ExternalLink, LineChart, Flame,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { GlowCard } from '@/components/ui/GlowCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ARV_CONFIG } from '@/lib/arv-config';
import { shortAddress } from '@/lib/utils';

const generatePriceData = () => {
  const data = [];
  let price = 0.0234;
  const now = Date.now();
  for (let i = 30; i >= 0; i--) {
    price += (Math.random() - 0.45) * 0.001;
    data.push({
      time: new Date(now - i * 24 * 60 * 60 * 1000).toLocaleDateString('fa-IR', {
        month: 'short',
        day: 'numeric',
      }),
      price: Math.max(0.01, price),
    });
  }
  return data;
};

export default function MarketPage() {
  const [priceData] = useState(generatePriceData());
  const [range, setRange] = useState<'1H' | '24H' | '7D' | '30D'>('7D');
  const [loading, setLoading] = useState(false);

  const currentPrice = priceData[priceData.length - 1].price;
  const prevPrice = priceData[priceData.length - 2].price;
  const priceChange = ((currentPrice - prevPrice) / prevPrice) * 100;

  const stats = [
    { label: 'قیمت ARV', value: currentPrice, change: priceChange, prefix: '$', decimals: 4, icon: <DollarSign size={20} />, color: 'gold' as const },
    { label: 'حجم ۲۴ ساعته', value: 180000, change: 12.3, prefix: '$', decimals: 0, icon: <Activity size={20} />, color: 'blue' as const },
    { label: 'ارزش بازار', value: 234000, change: 8.1, prefix: '$', decimals: 0, icon: <BarChart3 size={20} />, color: 'green' as const },
    { label: 'تعداد هولدرها', value: 12458, change: 3.7, decimals: 0, icon: <Users size={20} />, color: 'purple' as const },
  ];

  const pools = [
    { name: 'ARV / BNB', tvl: 470000, apy: 18.4, volume: 85000, dex: 'PancakeSwap' },
    { name: 'ARV / USDT', tvl: 210000, apy: 12.7, volume: 42000, dex: 'PancakeSwap' },
  ];

  const whaleTransactions = [
    { address: '0xabc...def', amount: 10000, type: 'sell' as const, time: '۵ دقیقه پیش' },
    { address: '0x123...456', amount: 5000, type: 'buy' as const, time: '۱۲ دقیقه پیش' },
    { address: '0x789...abc', amount: 2500, type: 'buy' as const, time: '۲۵ دقیقه پیش' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <Header />
        <div className="p-4 md:p-6 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                <span className="gold-gradient">تحلیل بازار</span>
              </h1>
              <p className="text-sm text-[var(--arv-text-muted)]">داده‌های زنده بازار ARV</p>
            </div>
            <button onClick={() => setLoading(!loading)} className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <GlowCard key={i} glowColor={stat.color} delay={i * 0.1}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-[var(--arv-gold)]">{stat.icon}</div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${stat.change >= 0 ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]' : 'bg-[var(--arv-danger)]/15 text-[var(--arv-danger)]'}`}>
                    {stat.change >= 0 ? '▲' : '▼'}{Math.abs(stat.change).toFixed(2)}%
                  </div>
                </div>
                <div className="text-xs text-[var(--arv-text-muted)] mb-2">{stat.label}</div>
                <div className="text-xl md:text-2xl font-bold">
                  <AnimatedNumber value={stat.value} decimals={stat.decimals} prefix={stat.prefix} />
                </div>
              </GlowCard>
            ))}
          </div>

          <GlowCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <LineChart size={20} className="text-[var(--arv-gold)]" />
                نمودار قیمت ARV
              </h2>
              <div className="flex gap-1">
                {(['1H', '24H', '7D', '30D'] as const).map((r) => (
                  <button key={r} onClick={() => setRange(r)} className={`px-3 py-1 rounded-lg text-xs transition-all ${range === r ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)] font-bold' : 'text-[var(--arv-text-muted)] hover:bg-[var(--arv-blue)]/40'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4af37" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#a0aec0" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a0aec0" fontSize={10} tickLine={false} domain={['dataMin - 0.002', 'dataMax + 0.002']} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                  <Tooltip contentStyle={{ background: '#1e3a5f', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 12, color: '#fff' }} formatter={(v: any) => [`$${Number(v).toFixed(4)}`, 'قیمت']} />
                  <Area type="monotone" dataKey="price" stroke="#d4af37" strokeWidth={2} fill="url(#priceGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>

          <GlowCard>
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Droplets size={20} className="text-blue-400" />
              استخرهای نقدینگی
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pools.map((pool, i) => (
                <div key={i} className="arv-card bg-[var(--arv-blue)]/20 border border-[var(--arv-gold)]/20">
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold">{pool.name}</div>
                    <div className="text-xs px-2 py-1 rounded-lg bg-[var(--arv-success)]/15 text-[var(--arv-success)] font-bold">APY {pool.apy}%</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-[var(--arv-text-muted)]">TVL</div>
                      <div className="font-bold">$<AnimatedNumber value={pool.tvl} decimals={0} /></div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--arv-text-muted)]">حجم</div>
                      <div className="font-bold">$<AnimatedNumber value={pool.volume} decimals={0} /></div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-[var(--arv-text-muted)]">{pool.dex}</div>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard>
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Flame size={20} className="text-orange-400" />
              تراکنش‌های بزرگ
            </h2>
            <div className="space-y-2">
              {whaleTransactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--arv-blue)]/20">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'buy' ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]' : 'bg-[var(--arv-danger)]/15 text-[var(--arv-danger)]'}`}>
                      {tx.type === 'buy' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div>
                      <div className="font-mono text-xs">{tx.address}</div>
                      <div className="text-xs text-[var(--arv-text-muted)]">{tx.time}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold"><AnimatedNumber value={tx.amount} decimals={0} /> ARV</div>
                    <div className={`text-xs ${tx.type === 'buy' ? 'text-[var(--arv-success)]' : 'text-[var(--arv-danger)]'}`}>
                      {tx.type === 'buy' ? 'خرید' : 'فروش'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard glowColor="gold">
            <h2 className="font-bold mb-4">اطلاعات قرارداد</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">آدرس</span>
                <a href={ARV_CONFIG.links.bscscanToken} target="_blank" rel="noopener noreferrer" className="font-mono text-[var(--arv-gold)] hover:underline flex items-center gap-1">
                  {shortAddress(ARV_CONFIG.token.address, 8)}<ExternalLink size={12} />
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">شبکه</span>
                <span>{ARV_CONFIG.network.nameShort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">استاندارد</span>
                <span>{ARV_CONFIG.token.standard}</span>
              </div>
            </div>
          </GlowCard>

        </div>
      </main>
    </div>
  );
}
