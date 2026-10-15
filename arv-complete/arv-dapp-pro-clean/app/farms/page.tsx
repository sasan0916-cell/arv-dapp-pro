'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ArrowRight, Sprout, Coins, TrendingUp, Lock, Info, ExternalLink, Clock, Loader2, Gift, LogOut, Wallet } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import TokenLogo from '@/components/ui/TokenLogo';
import { useLanguage } from '@/lib/i18n';
import { getRewardsStats, getUserStakeInfo, getLpBalance, getLpAllowance, approveLp, stakeLp, withdrawLp, claimRewards } from '@/lib/services/rewards-service';
import { loadWallet } from '@/lib/services/wallet-service';
import { ARV_CONFIG } from '@/lib/arv-config';

type RewardsStats = {
  totalSupply: string;
  rewardRate: string;
  periodFinish: number;
  rewardPerTokenStored: string;
  rewardsDuration: number;
  contractBalance: string;
  rewardsRemaining: string;
  apy: number;
};

type UserInfo = {
  staked: string;
  earned: string;
  lpBalance: string;
  lpAllowance: string;
  needsApproval: boolean;
};

export default function FarmsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { address: externalAddress } = useAccount();
  const en = language === 'en';

  const [stats, setStats] = useState<RewardsStats | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // مقدار ورودی استیک
  const [stakeAmount, setStakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // آدرس کیف پول کاربر (اولویت: کیف کاربر DApp، بعد external)
  const [userWalletAddress, setUserWalletAddress] = useState('');
  const [walletPassword, setWalletPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingAction, setPendingAction] = useState<'stake' | 'withdraw' | 'claim' | 'approve' | null>(null);

  // ============ Load Stats ============
  const loadStats = useCallback(async () => {
    try {
      const s = await getRewardsStats();
      setStats(s);
    } catch (e: any) {
      console.error('Stats error:', e);
    }
  }, []);

  // ============ Load User Info ============
  const loadUserInfo = useCallback(async () => {
    if (!userWalletAddress) {
      setUserInfo(null);
      return;
    }
    try {
      const [info, lpBal, lpAllow] = await Promise.all([
        getUserStakeInfo(userWalletAddress),
        getLpBalance(userWalletAddress),
        getLpAllowance(userWalletAddress),
      ]);
      setUserInfo({
        ...info,
        lpBalance: lpBal,
        lpAllowance: lpAllow,
        needsApproval: parseFloat(lpAllow) < parseFloat(info.staked) || parseFloat(lpAllow) === 0,
      });
    } catch (e: any) {
      console.error('User info error:', e);
    }
  }, [userWalletAddress]);

  // Initial load
  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadStats();
      setLoading(false);
    })();
    const id = setInterval(loadStats, 60000);
    return () => clearInterval(id);
  }, [loadStats]);

  // When wallet changes, load user info
  useEffect(() => {
    loadUserInfo();
    const id = setInterval(loadUserInfo, 30000);
    return () => clearInterval(id);
  }, [loadUserInfo]);

  // Try loading user wallet on mount
  useEffect(() => {
    (async () => {
      if (externalAddress) {
        setUserWalletAddress(externalAddress);
        return;
      }
      // Try DApp internal user wallet
      try {
        const stored = localStorage.getItem('arv_user_address');
        if (stored) setUserWalletAddress(stored);
      } catch {}
    })();
  }, [externalAddress]);

  // ============ Format helpers ============
  const fmt = (v: string, dec = 4) => {
    try {
      const n = parseFloat(v);
      if (n === 0) return '0';
      if (n < 0.0001) return '<0.0001';
      return n.toLocaleString('en-US', { maximumFractionDigits: dec });
    } catch { return '0'; }
  };

  const timeLeft = stats ? Math.max(0, stats.periodFinish - Math.floor(Date.now() / 1000)) : 0;
  const daysLeft = Math.floor(timeLeft / 86400);
  const hoursLeft = Math.floor((timeLeft % 86400) / 3600);

  // ============ Actions ============
  const handleAction = async (action: 'approve' | 'stake' | 'withdraw' | 'claim') => {
    setError('');
    setSuccess('');

    if (!walletPassword) {
      setShowPassword(true);
      setPendingAction(action);
      return;
    }

    setActionLoading(true);
    try {
      const walletData = await loadWallet('user', walletPassword);
      if (!walletData) throw new Error(en ? 'Wrong password' : 'رمز عبور اشتباه است');

      let result: { hash: string };

      if (action === 'approve') {
        result = await approveLp(walletData.privateKey);
      } else if (action === 'stake') {
        if (!stakeAmount || parseFloat(stakeAmount) <= 0) throw new Error(en ? 'Invalid amount' : 'مقدار نامعتبر');
        result = await stakeLp(walletData.privateKey, stakeAmount);
        setStakeAmount('');
      } else if (action === 'withdraw') {
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) throw new Error(en ? 'Invalid amount' : 'مقدار نامعتبر');
        result = await withdrawLp(walletData.privateKey, withdrawAmount);
        setWithdrawAmount('');
      } else {
        result = await claimRewards(walletData.privateKey);
      }

      setSuccess(en ? `Transaction sent: ${result.hash.slice(0, 10)}...` : `تراکنش ارسال شد: ${result.hash.slice(0, 10)}...`);
      setWalletPassword('');
      setPendingAction(null);
      setShowPassword(false);

      // Reload after 3s
      setTimeout(() => { loadStats(); loadUserInfo(); }, 3000);
    } catch (e: any) {
      setError(e.message || (en ? 'Transaction failed' : 'تراکنش شکست خورد'));
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Render ============
  return (
    <div className="min-h-screen bg-[var(--arv-blue-dark)]">
      <div className="p-4 md:p-6 max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]">
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold gold-gradient">{en ? 'LP Farms' : 'فارم‌ها'}</h1>
            <p className="text-xs text-[var(--arv-text-muted)] mt-1">
              {en ? 'Stake LP tokens and earn ARV' : 'LP توکن استیک کنید و ARV جایزه بگیرید'}
            </p>
          </div>
        </div>

        {/* Stats card */}
        {loading ? (
          <GlowCard glowColor="gold">
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="text-[var(--arv-gold)] animate-spin" />
            </div>
          </GlowCard>
        ) : stats ? (
          <GlowCard glowColor="gold">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <TokenLogo symbol="ARV" size={36} />
                  <TokenLogo symbol="BNB" size={36} className="-ml-3" />
                </div>
                <div>
                  <div className="font-bold text-sm">ARV-BNB LP</div>
                  <div className="text-[10px] text-[var(--arv-text-muted)] flex items-center gap-1">
                    <Coins size={10} className="text-[var(--arv-gold)]" />
                    {en ? 'Reward: ARV' : 'پاداش: ARV'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[var(--arv-text-muted)]">APY</div>
                <div className="text-lg font-bold text-[var(--arv-success)]" dir="ltr">
                  {stats.apy > 0 ? `${stats.apy.toFixed(0)}%` : '—'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div className="p-2 rounded-lg bg-[var(--arv-blue)]/30">
                <div className="text-[10px] text-[var(--arv-text-muted)] mb-0.5">{en ? 'Total Staked' : 'کل استیک'}</div>
                <div className="font-bold text-white" dir="ltr">{fmt(stats.totalSupply)} LP</div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--arv-blue)]/30">
                <div className="text-[10px] text-[var(--arv-text-muted)] mb-0.5">{en ? 'Rewards Left' : 'پاداش باقیمانده'}</div>
                <div className="font-bold text-[var(--arv-gold)]" dir="ltr">{fmt(stats.rewardsRemaining, 0)} ARV</div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--arv-blue)]/30">
                <div className="text-[10px] text-[var(--arv-text-muted)] mb-0.5">{en ? 'Daily Rate' : 'نرخ روزانه'}</div>
                <div className="font-bold text-white" dir="ltr">{fmt((parseFloat(stats.rewardRate) * 86400 / 1e18).toString(), 0)} ARV</div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--arv-blue)]/30">
                <div className="text-[10px] text-[var(--arv-text-muted)] mb-0.5">{en ? 'Ends In' : 'پایان در'}</div>
                <div className="font-bold text-white">
                  {daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h` : `${hoursLeft}h`}
                </div>
              </div>
            </div>

            {userInfo && (
              <div className="pt-3 border-t border-[var(--arv-gold)]/10">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-[10px] text-[var(--arv-text-muted)] mb-0.5">{en ? 'Your Stake' : 'استیک شما'}</div>
                    <div className="font-bold text-white" dir="ltr">{fmt(userInfo.staked)} LP</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--arv-text-muted)] mb-0.5">{en ? 'Claimable' : 'قابل دریافت'}</div>
                    <div className="font-bold text-[var(--arv-success)]" dir="ltr">{fmt(userInfo.earned)} ARV</div>
                  </div>
                </div>
              </div>
            )}
          </GlowCard>
        ) : (
          <GlowCard glowColor="gold">
            <div className="text-center py-4 text-xs text-[var(--arv-text-muted)]">
              {en ? 'Failed to load stats' : 'خطا در بارگذاری اطلاعات'}
            </div>
          </GlowCard>
        )}

        {/* Action buttons */}
        {stats && timeLeft > 0 ? (
          <GlowCard glowColor="green">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gift size={16} className="text-[var(--arv-success)]" />
                <div className="font-bold text-sm">{en ? 'Stake / Withdraw' : 'استیک / برداشت'}</div>
              </div>

              {/* Stake */}
              <div>
                <label className="text-xs text-[var(--arv-text-muted)] mb-1 block">{en ? 'Stake LP' : 'استیک LP'}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.0001"
                    className="arv-input flex-1"
                    dir="ltr"
                  />
                  <button
                    onClick={() => handleAction('stake')}
                    disabled={actionLoading || !stakeAmount}
                    className="px-4 py-2 rounded-lg bg-[var(--arv-success)]/20 text-[var(--arv-success)] text-xs font-bold disabled:opacity-40"
                  >
                    {actionLoading && pendingAction === 'stake' ? <Loader2 size={14} className="animate-spin" /> : (en ? 'Stake' : 'استیک')}
                  </button>
                </div>
                {userInfo && (
                  <div className="text-[10px] text-[var(--arv-text-muted)] mt-1" dir="ltr">
                    LP: {fmt(userInfo.lpBalance, 6)} | Allow: {userInfo.needsApproval ? '❌' : '✅'}
                  </div>
                )}
              </div>

              {/* Approve (if needed) */}
              {userInfo?.needsApproval && parseFloat(userInfo.lpBalance) > 0 && (
                <button
                  onClick={() => handleAction('approve')}
                  disabled={actionLoading}
                  className="w-full py-2 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] text-xs font-bold disabled:opacity-40"
                >
                  {en ? '1. Approve LP' : '۱. تأیید LP'}
                </button>
              )}

              {/* Withdraw */}
              {userInfo && parseFloat(userInfo.staked) > 0 && (
                <div>
                  <label className="text-xs text-[var(--arv-text-muted)] mb-1 block">{en ? 'Withdraw LP' : 'برداشت LP'}</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.0"
                      step="0.0001"
                      className="arv-input flex-1"
                      dir="ltr"
                    />
                    <button
                      onClick={() => setWithdrawAmount(userInfo.staked)}
                      className="px-3 py-2 rounded-lg bg-[var(--arv-blue)]/40 text-xs"
                    >
                      MAX
                    </button>
                    <button
                      onClick={() => handleAction('withdraw')}
                      disabled={actionLoading || !withdrawAmount}
                      className="px-4 py-2 rounded-lg bg-[var(--arv-danger)]/20 text-[var(--arv-danger)] text-xs font-bold disabled:opacity-40"
                    >
                      {actionLoading && pendingAction === 'withdraw' ? <Loader2 size={14} className="animate-spin" /> : (en ? 'Out' : 'برداشت')}
                    </button>
                  </div>
                </div>
              )}

              {/* Claim */}
              {userInfo && parseFloat(userInfo.earned) > 0 && (
                <button
                  onClick={() => handleAction('claim')}
                  disabled={actionLoading}
                  className="w-full py-2 rounded-lg bg-[var(--arv-gold)] text-[var(--arv-blue-dark)] text-xs font-bold disabled:opacity-40"
                >
                  <Gift size={12} className="inline mr-1" />
                  {en ? `Claim ${fmt(userInfo.earned, 2)} ARV` : `دریافت ${fmt(userInfo.earned, 2)} ARV`}
                </button>
              )}
            </div>
          </GlowCard>
        ) : stats && timeLeft === 0 ? (
          <GlowCard glowColor="blue">
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-[var(--arv-gold)] shrink-0 mt-1" />
              <div>
                <div className="font-bold text-sm text-[var(--arv-gold)] mb-1">
                  {en ? 'Rewards period ended' : 'دوره پاداش به پایان رسید'}
                </div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  {en ? 'Owner will add new rewards soon' : 'به‌زودی مالک پاداش جدید اضافه می‌کند'}
                </div>
              </div>
            </div>
          </GlowCard>
        ) : null}

        {/* Error / Success */}
        {error && (
          <div className="p-3 rounded-xl bg-[var(--arv-danger)]/10 border border-[var(--arv-danger)]/30 text-xs text-[var(--arv-danger)]">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-xl bg-[var(--arv-success)]/10 border border-[var(--arv-success)]/30 text-xs text-[var(--arv-success)]">
            {success}
          </div>
        )}

        {/* Password prompt */}
        {showPassword && (
          <GlowCard glowColor="gold">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Lock size={14} className="text-[var(--arv-gold)]" />
                <span className="font-bold">{en ? 'Wallet password' : 'رمز کیف پول'}</span>
              </div>
              <input
                type="password"
                value={walletPassword}
                onChange={(e) => setWalletPassword(e.target.value)}
                className="arv-input w-full"
                placeholder={en ? 'Enter password' : 'رمز عبور'}
                autoFocus
              />
              <div className="flex gap-2">
                <GradientButton
                  variant="gold"
                  size="sm"
                  fullWidth
                  onClick={() => pendingAction && handleAction(pendingAction)}
                  disabled={!walletPassword || actionLoading}
                >
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : (en ? 'Confirm' : 'تأیید')}
                </GradientButton>
                <button
                  onClick={() => { setShowPassword(false); setWalletPassword(''); setPendingAction(null); }}
                  className="px-4 py-2 rounded-lg bg-[var(--arv-blue)]/40 text-xs"
                >
                  {en ? 'Cancel' : 'لغو'}
                </button>
              </div>
            </div>
          </GlowCard>
        )}

        {/* Info */}
        <GlowCard glowColor="blue">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-[var(--arv-gold)] shrink-0 mt-1" />
            <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
              <div className="font-bold text-white mb-1">{en ? 'How it works' : 'نحوه کار'}</div>
              <div>• {en ? 'Add ARV + BNB liquidity on our /liquidity page' : 'در صفحه /liquidity نقدینگی ARV + BNB اضافه کنید'}</div>
              <div>• {en ? 'You receive ARV-LP tokens' : 'ARV-LP توکن دریافت می‌کنید'}</div>
              <div>• {en ? 'Stake them here to earn ARV' : 'اینجا استیک کنید و ARV جایزه بگیرید'}</div>
              <div>• {en ? 'Rewards accrue every second' : 'پاداش هر ثانیه محاسبه می‌شود'}</div>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
