'use client';

import {
  Globe, Shield, AlertTriangle, CheckCircle2, Clock, ExternalLink,
  Coins, Lock, FileCheck, Zap, ArrowRight,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { Sidebar } from '@/components/Sidebar';
import { ARV_CONFIG } from '@/lib/arv-config';
import { formatNumber, shortAddress } from '@/lib/utils';

export default function MainnetPage() {
  const testnet = ARV_CONFIG.networks.testnet;
  const mainnet = ARV_CONFIG.networks.mainnet;

  const milestones = [
    { label: 'قرارداد تست‌شده روی Testnet', status: 'done' as const, icon: <CheckCircle2 size={20} /> },
    { label: 'توکنومیک تأیید شده', status: 'done' as const, icon: <CheckCircle2 size={20} /> },
    { label: 'ممیزی امنیتی قرارداد', status: 'pending' as const, icon: <Clock size={20} /> },
    { label: 'اخذ مجوز قانونی', status: 'pending' as const, icon: <Clock size={20} /> },
    { label: 'Deploy روی BSC Mainnet', status: 'pending' as const, icon: <Clock size={20} /> },
    { label: 'انتشار رسمی و عرضه عمومی', status: 'pending' as const, icon: <Clock size={20} /> },
  ];

  const doneCount = milestones.filter((m) => m.status === 'done').length;
  const progress = Math.round((doneCount / milestones.length) * 100);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        
        <div className="p-4 md:p-6 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              <span className="gold-gradient">وضعیت Mainnet</span>
            </h1>
            <p className="text-sm text-[var(--arv-text-muted)]">
              مسیر انتشار رسمی ARV روی BNB Smart Chain Mainnet
            </p>
          </div>

          {/* Network Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Testnet */}
            <GlowCard glowColor="green" delay={0.1}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--arv-success)]/15 flex items-center justify-center">
                  <Zap size={24} className="text-[var(--arv-success)]" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">Testnet</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></span>
                    <span className="text-xs text-[var(--arv-success)] font-bold">فعال</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--arv-text-muted)]">شبکه</span>
                  <span className="font-bold">{testnet.nameShort}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--arv-text-muted)]">Chain ID</span>
                  <span className="font-bold">{testnet.chainId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--arv-text-muted)]">عرضه</span>
                  <span className="font-bold">{formatNumber(Number(ARV_CONFIG.token.totalSupplyTestnet))} ARV</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--arv-text-muted)]">قرارداد</span>
                  <a
                    href={ARV_CONFIG.links.bscscanToken}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-[var(--arv-gold)] hover:underline flex items-center gap-1"
                  >
                    {shortAddress(testnet.address, 6)}
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </GlowCard>

            {/* Mainnet */}
            <GlowCard glowColor="gold" delay={0.2}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--arv-gold)]/15 flex items-center justify-center">
                  <Globe size={24} className="text-[var(--arv-gold)]" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">Mainnet</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--arv-warning)] animate-pulse"></span>
                    <span className="text-xs text-[var(--arv-warning)] font-bold">در انتظار</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--arv-text-muted)]">شبکه</span>
                  <span className="font-bold">{mainnet.nameShort}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--arv-text-muted)]">Chain ID</span>
                  <span className="font-bold">{mainnet.chainId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--arv-text-muted)]">عرضه هدف</span>
                  <span className="font-bold">{formatNumber(Number(ARV_CONFIG.token.totalSupplyMainnet))} ARV</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--arv-text-muted)]">قرارداد</span>
                  <span className="text-xs text-[var(--arv-text-muted)] italic">در انتظار Deploy</span>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Progress Bar */}
          <GlowCard glowColor="gold">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <ArrowRight size={20} className="text-[var(--arv-gold)]" />
                پیشرفت آماده‌سازی Mainnet
              </h2>
              <div className="text-2xl font-bold gold-gradient">{progress}%</div>
            </div>
            <div className="w-full h-3 rounded-full bg-[var(--arv-blue)]/40 overflow-hidden mb-6">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--arv-gold)] to-[var(--arv-gold-light)] transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={m.status === 'done' ? 'text-[var(--arv-success)]' : 'text-[var(--arv-text-muted)]'}>
                    {m.icon}
                  </div>
                  <span className={m.status === 'done' ? 'text-white' : 'text-[var(--arv-text-muted)]'}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Contract Address Placeholder */}
          <GlowCard glowColor="blue">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <FileCheck size={20} className="text-blue-400" />
              اطلاعات قرارداد Mainnet
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[var(--arv-text-muted)] mb-1 block">آدرس قرارداد</label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20">
                  <code className="flex-1 font-mono text-xs text-[var(--arv-text-muted)]">
                    {mainnet.address || 'در انتظار Deploy...'}
                  </code>
                  <button
                    disabled={!mainnet.address}
                    className="text-xs px-3 py-1 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] disabled:opacity-30"
                  >
                    کپی
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--arv-text-muted)] mb-1 block">لینک BscScan</label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20">
                  <code className="flex-1 font-mono text-xs text-[var(--arv-text-muted)]">
                    {mainnet.address
                      ? `${mainnet.explorer}/token/${mainnet.address}`
                      : 'در انتظار Deploy...'}
                  </code>
                  <button
                    disabled={!mainnet.address}
                    className="text-xs px-3 py-1 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] disabled:opacity-30"
                  >
                    باز کردن
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--arv-text-muted)] mb-1 block">گزارش ممیزی امنیتی</label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20">
                  <code className="flex-1 font-mono text-xs text-[var(--arv-text-muted)]">
                    {mainnet.auditUrl || 'در انتظار ممیزی...'}
                  </code>
                  <button
                    disabled={!mainnet.auditUrl}
                    className="text-xs px-3 py-1 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] disabled:opacity-30"
                  >
                    مشاهده
                  </button>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Token Allocation */}
          <GlowCard glowColor="green">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Coins size={20} className="text-[var(--arv-success)]" />
              تخصیص توکن در Mainnet
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>کیف اصلی ({ARV_CONFIG.wallets.main.share}%)</span>
                  <span className="font-bold">
                    {formatNumber(Number(ARV_CONFIG.token.totalSupplyMainnet) * 0.6)} ARV
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--arv-blue)]/40 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--arv-gold)] to-[var(--arv-gold-light)]" style={{ width: '60%' }} />
                </div>
                <div className="mt-1 text-xs text-[var(--arv-text-muted)]">
                  {shortAddress(ARV_CONFIG.wallets.main.address, 8)}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>کیف پاداش ({ARV_CONFIG.wallets.reward.share}%)</span>
                  <span className="font-bold">
                    {formatNumber(Number(ARV_CONFIG.token.totalSupplyMainnet) * 0.4)} ARV
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--arv-blue)]/40 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500" style={{ width: '40%' }} />
                </div>
                <div className="mt-1 text-xs text-[var(--arv-text-muted)]">
                  {shortAddress(ARV_CONFIG.wallets.reward.address, 8)}
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Warning */}
          <GlowCard glowColor="gold" className="border-r-4 border-[var(--arv-warning)]">
            <div className="flex items-start gap-3">
              <AlertTriangle size={24} className="text-[var(--arv-warning)] flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-[var(--arv-warning)] mb-2">هشدار مهم</div>
                <p className="text-sm text-[var(--arv-text-muted)] leading-relaxed">
                  تا زمان انتشار رسمی روی Mainnet، فقط از شبکه Testnet استفاده کنید.
                  هیچ توکن ARV واقعی تا این لحظه عرضه نشده است.
                  هرگونه ادعای فروش یا معامله ARV قبل از انتشار رسمی، غیرمجاز است.
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Security */}
          <GlowCard glowColor="purple">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Shield size={20} className="text-purple-400" />
              تعهدات امنیتی
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-[var(--arv-success)]" />
                <span>قرارداد بدون تابع mint (عرضه ثابت)</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-[var(--arv-success)]" />
                <span>ممیزی امنیتی توسط شرکت معتبر</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-[var(--arv-success)]" />
                <span>توزیع ۶۰/۴۰ شفاف و قابل حسابرسی</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-[var(--arv-success)]" />
                <span>گزارش عمومی از طریق BscScan</span>
              </div>
            </div>
          </GlowCard>

        </div>
      </main>
    </div>
  );
}
