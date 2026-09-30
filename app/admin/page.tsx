'use client';

import { useState, useEffect } from 'react';
import {
  Shield, Gift, Users, Coins, TrendingUp, Send, Plus,
  ExternalLink, RefreshCw, AlertTriangle, Info, Copy, Check,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { ARV_CONFIG } from '@/lib/arv-config';
import { shortAddress, copyToClipboard, formatNumber } from '@/lib/utils';

interface UserRow {
  address: string;
  balance: string;
  joined: string;
}

export default function AdminPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rewardAddress, setRewardAddress] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [showRewardForm, setShowRewardForm] = useState(false);

  // داده‌های نمایشی
  const stats = {
    totalSupply: 10000000,
    mainBalance: 5999989,
    rewardBalance: 4000000,
    totalUsers: 1245,
    totalTx: 12,
  };

  const users: UserRow[] = [
    { address: '0xf559de50AdceE062188cc5e267626aE767516121', balance: '1,245', joined: '۲ روز پیش' },
    { address: '0xabc123def456789012345678901234567890abcd', balance: '500', joined: '۵ روز پیش' },
    { address: '0x1234567890abcdef1234567890abcdef12345678', balance: '250', joined: '۱ هفته پیش' },
  ];

  const handleCopy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSendReward = async () => {
    if (!rewardAddress || !rewardAmount) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowRewardForm(false);
      setRewardAddress('');
      setRewardAmount('');
      alert('پاداش با موفقیت ارسال شد!');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen">
      
      <main className="flex-1 overflow-x-hidden">
        
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                <span className="gold-gradient">داشبورد مدیریتی</span>
              </h1>
              <p className="text-xs text-[var(--arv-text-muted)]">
                فقط برای مدیرکل — {ARV_CONFIG.team.owner.name}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--arv-gold)]/15 flex items-center justify-center">
              <Shield size={20} className="text-[var(--arv-gold)]" />
            </div>
          </div>

          {/* Warning */}
          <GlowCard glowColor="gold" className="border-r-4 border-[var(--arv-warning)]">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-[var(--arv-warning)] flex-shrink-0 mt-1" />
              <div className="text-xs text-[var(--arv-text-muted)]">
                <div className="font-bold text-[var(--arv-warning)] mb-1">دسترسی محدود</div>
                این صفحه فقط برای مدیرکل پروژه است. تمام عملیات اینجا ثبت می‌شود.
              </div>
            </div>
          </GlowCard>

          {/* Main Wallets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Wallet */}
            <GlowCard glowColor="gold">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--arv-gold)]/15 flex items-center justify-center">
                    <Shield size={24} className="text-[var(--arv-gold)]" />
                  </div>
                  <div>
                    <div className="font-bold">کیف اصلی</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">۶۰٪ عرضه کل</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]">
                  ۶۰٪
                </span>
              </div>

              <div className="mb-3">
                <div className="text-xs text-[var(--arv-text-muted)] mb-1">موجودی</div>
                <div className="text-2xl font-bold gold-gradient">
                  <AnimatedNumber value={stats.mainBalance} decimals={0} /> ARV
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-[var(--arv-text-muted)] mb-1">آدرس</div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--arv-blue)]/30">
                  <code className="flex-1 font-mono text-xs truncate" dir="ltr">
                    {shortAddress(ARV_CONFIG.wallets.main.address, 8)}
                  </code>
                  <button
                    onClick={() => handleCopy(ARV_CONFIG.wallets.main.address, 'main')}
                    className="text-[var(--arv-gold)]"
                  >
                    {copiedId === 'main' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <GradientButton variant="gold" size="sm" href="/send" icon={<Send size={14} />}>
                  ارسال
                </GradientButton>
                <a
                  href={`${ARV_CONFIG.network.explorer}/address/${ARV_CONFIG.wallets.main.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs border border-[var(--arv-gold)]/40 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/10 flex items-center gap-1"
                >
                  BscScan <ExternalLink size={10} />
                </a>
              </div>
            </GlowCard>

            {/* Reward Wallet */}
            <GlowCard glowColor="green">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--arv-success)]/15 flex items-center justify-center">
                    <Gift size={24} className="text-[var(--arv-success)]" />
                  </div>
                  <div>
                    <div className="font-bold">کیف پاداش</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">۴۰٪ عرضه کل</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--arv-success)]/15 text-[var(--arv-success)]">
                  ۴۰٪
                </span>
              </div>

              <div className="mb-3">
                <div className="text-xs text-[var(--arv-text-muted)] mb-1">موجودی</div>
                <div className="text-2xl font-bold text-[var(--arv-success)]">
                  <AnimatedNumber value={stats.rewardBalance} decimals={0} /> ARV
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-[var(--arv-text-muted)] mb-1">آدرس</div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--arv-blue)]/30">
                  <code className="flex-1 font-mono text-xs truncate" dir="ltr">
                    {shortAddress(ARV_CONFIG.wallets.reward.address, 8)}
                  </code>
                  <button
                    onClick={() => handleCopy(ARV_CONFIG.wallets.reward.address, 'reward')}
                    className="text-[var(--arv-gold)]"
                  >
                    {copiedId === 'reward' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <GradientButton
                  variant="green"
                  size="sm"
                  onClick={() => setShowRewardForm(!showRewardForm)}
                  icon={<Plus size={14} />}
                >
                  ارسال پاداش
                </GradientButton>
                <a
                  href={`${ARV_CONFIG.network.explorer}/address/${ARV_CONFIG.wallets.reward.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs border border-[var(--arv-success)]/40 text-[var(--arv-success)] hover:bg-[var(--arv-success)]/10 flex items-center gap-1"
                >
                  BscScan <ExternalLink size={10} />
                </a>
              </div>
            </GlowCard>
          </div>

          {/* Reward Form */}
          {showRewardForm && (
            <GlowCard glowColor="green">
              <div className="mb-4">
                <div className="font-bold text-sm mb-1">ارسال پاداش به کاربر</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  از موجودی کیف پاداش کسر می‌شود
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[var(--arv-text-muted)] mb-1 block">
                    آدرس کاربر
                  </label>
                  <input
                    type="text"
                    value={rewardAddress}
                    onChange={(e) => setRewardAddress(e.target.value)}
                    placeholder="0x..."
                    className="arv-input font-mono text-xs"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--arv-text-muted)] mb-1 block">
                    مقدار (ARV)
                  </label>
                  <input
                    type="number"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    placeholder="100"
                    className="arv-input"
                    dir="ltr"
                  />
                </div>
                <GradientButton
                  variant="green"
                  size="md"
                  fullWidth
                  onClick={handleSendReward}
                  disabled={loading || !rewardAddress || !rewardAmount}
                  icon={<Send size={16} />}
                >
                  {loading ? 'در حال ارسال...' : 'ارسال پاداش'}
                </GradientButton>
              </div>
            </GlowCard>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlowCard glowColor="gold" delay={0.05}>
              <div className="text-center">
                <Coins size={24} className="text-[var(--arv-gold)] mx-auto mb-2" />
                <div className="text-2xl font-bold gold-gradient">
                  <AnimatedNumber value={stats.totalSupply} decimals={0} />
                </div>
                <div className="text-xs text-[var(--arv-text-muted)] mt-1">عرضه کل ARV</div>
              </div>
            </GlowCard>

            <GlowCard glowColor="blue" delay={0.1}>
              <div className="text-center">
                <Users size={24} className="text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">
                  <AnimatedNumber value={stats.totalUsers} decimals={0} />
                </div>
                <div className="text-xs text-[var(--arv-text-muted)] mt-1">کاربران</div>
              </div>
            </GlowCard>

            <GlowCard glowColor="purple" delay={0.15}>
              <div className="text-center">
                <TrendingUp size={24} className="text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">
                  <AnimatedNumber value={stats.totalTx} decimals={0} />
                </div>
                <div className="text-xs text-[var(--arv-text-muted)] mt-1">تراکنش‌ها</div>
              </div>
            </GlowCard>

            <GlowCard glowColor="green" delay={0.2}>
              <div className="text-center">
                <Gift size={24} className="text-[var(--arv-success)] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[var(--arv-success)]">
                  <AnimatedNumber value={4000000} decimals={0} />
                </div>
                <div className="text-xs text-[var(--arv-text-muted)] mt-1">پاداش موجود</div>
              </div>
            </GlowCard>
          </div>

          {/* Users List */}
          <GlowCard glowColor="gold">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold flex items-center gap-2">
                <Users size={18} className="text-[var(--arv-gold)]" />
                کاربران اخیر
              </div>
              <button className="text-xs text-[var(--arv-gold)] hover:underline">
                مشاهده همه
              </button>
            </div>

            <div className="space-y-2">
              {users.map((user, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--arv-blue)]/20"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs truncate" dir="ltr">
                      {shortAddress(user.address, 8)}
                    </div>
                    <div className="text-xs text-[var(--arv-text-muted)] mt-1">
                      {user.joined}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm gold-gradient">
                      {user.balance} ARV
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(user.address, user.address)}
                    className="ml-2 text-[var(--arv-gold)]"
                  >
                    {copiedId === user.address ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Info */}
          <GlowCard glowColor="blue">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-400 flex-shrink-0 mt-1" />
              <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
                <div className="font-bold text-white mb-2">درباره داشبورد مدیریتی</div>
                <div>• فقط برای مدیرکل پروژه قابل دسترسی است</div>
                <div>• ارسال پاداش از کیف پاداش کسر می‌شود</div>
                <div>• تمام عملیات در BscScan ثبت می‌شود</div>
                <div>• مالک پروژه: {ARV_CONFIG.team.owner.name}</div>
              </div>
            </div>
          </GlowCard>

        </div>
      </main>
    </div>
  );
}
