'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import {
  Send, Wallet, Shield, Gift, User, QrCode, ArrowLeft, Check,
  AlertCircle, Loader2, ExternalLink, Copy, Info,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Sidebar } from '@/components/Sidebar';
import { ARV_CONFIG } from '@/lib/arv-config';
import { shortAddress, isValidAddress, copyToClipboard, formatToken } from '@/lib/utils';
import { sendARV, getARVBalance, getBNBBalance, estimateGas } from '@/lib/services/token-service';
import { loadWallet } from '@/lib/services/wallet-service';

type WalletId = 'main' | 'reward' | 'user';
type Step = 'select-wallet' | 'input' | 'confirm' | 'sending' | 'done';

interface WalletOption {
  id: WalletId;
  label: string;
  address: string;
  balance: string;
  color: 'gold' | 'green' | 'blue';
  icon: React.ReactNode;
  isAdmin: boolean;
  hasWallet?: boolean;
}

export default function SendPage() {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();

  const [step, setStep] = useState<Step>('select-wallet');
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletId | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [bnbBalance, setBnbBalance] = useState('0');
  const [arvBalance, setArvBalance] = useState('0');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const wallets: WalletOption[] = [
      {
        id: 'main',
        label: 'کیف اصلی',
        address: ARV_CONFIG.wallets.main.address,
        balance: ARV_CONFIG.wallets.main.amount,
        color: 'gold',
        icon: <Shield size={20} />,
        isAdmin: true,
      },
      {
        id: 'reward',
        label: 'کیف پاداش',
        address: ARV_CONFIG.wallets.reward.address,
        balance: ARV_CONFIG.wallets.reward.amount,
        color: 'green',
        icon: <Gift size={20} />,
        isAdmin: true,
      },
      {
        id: 'user',
        label: 'کیف کاربر',
        address:
          (typeof window !== 'undefined'
            ? localStorage.getItem('arv_user_address') || ''
            : '') || connectedAddress || '',
        balance: '0',
        color: 'blue',
        icon: <User size={20} />,
        isAdmin: false,
      },
    ];

    const filtered = wallets.map((w) => ({
      ...w,
      hasWallet: !!localStorage.getItem(`arv_wallet_${w.id}`),
    }));

    setWalletOptions(filtered);
  }, [connectedAddress]);

  useEffect(() => {
    if (selectedWallet && typeof window !== 'undefined') {
      loadBalances();
    }
  }, [selectedWallet]);

  async function loadBalances() {
    if (!selectedWallet) return;
    try {
      const wallet = walletOptions.find((w) => w.id === selectedWallet);
      if (!wallet?.address) return;

      const [arv, bnb] = await Promise.all([
        getARVBalance(wallet.address),
        getBNBBalance(wallet.address),
      ]);
      setArvBalance(formatToken(arv, 18, 4));
      setBnbBalance(formatToken(bnb, 18, 6));
    } catch (e) {
      console.error(e);
    }
  }

  const handleWalletSelect = (walletId: WalletId) => {
    const wallet = walletOptions.find((w) => w.id === walletId);
    if (!wallet?.address) {
      setError('این کیف پول ساخته نشده است');
      return;
    }
    setSelectedWallet(walletId);
    setStep('input');
    setError('');
  };

  const handleInputNext = () => {
    if (!isValidAddress(recipient)) {
      setError('آدرس گیرنده نامعتبر است');
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError('مقدار باید بزرگتر از صفر باشد');
      return;
    }
    setError('');
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!selectedWallet) return;
    if (!password) {
      setError('رمز عبور را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');
    setStep('sending');

    try {
      const walletData = await loadWallet(selectedWallet, password);
      if (!walletData) {
        throw new Error('رمز عبور اشتباه است یا کیف پول یافت نشد');
      }

      const result = await sendARV(walletData.privateKey, recipient, amount);

      setTxHash(result.hash);
      await result.wait();
      setStep('done');
    } catch (e: any) {
      setError(e.message || 'خطا در ارسال تراکنش');
      setStep('confirm');
    } finally {
      setLoading(false);
    }
  };

  const handleMax = () => {
    setAmount(arvBalance.replace(/,/g, ''));
  };

  const handleCopyTx = async () => {
    const ok = await copyToClipboard(txHash);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFinish = () => {
    router.push('/wallets');
  };

  // ===== Step 1: Select Wallet =====
  if (step === 'select-wallet') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          
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
                  <span className="gold-gradient">ارسال ARV</span>
                </h1>
                <p className="text-xs text-[var(--arv-text-muted)]">
                  کیف پول مبدأ را انتخاب کنید
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {walletOptions.map((wallet) => (
                <GlowCard key={wallet.id} glowColor={wallet.color} hover={!!wallet.address}>
                  <button
                    onClick={() => handleWalletSelect(wallet.id)}
                    disabled={!wallet.address}
                    className="w-full text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          wallet.color === 'gold'
                            ? 'bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]'
                            : wallet.color === 'green'
                            ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                            : 'bg-blue-400/15 text-blue-400'
                        }`}
                      >
                        {wallet.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold flex items-center gap-2">
                          {wallet.label}
                          {wallet.isAdmin && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]">
                              مدیرکل
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-[var(--arv-text-muted)]" dir="ltr">
                          {wallet.address ? shortAddress(wallet.address, 6) : 'ساخته نشده'}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold gold-gradient">
                          {Number(wallet.balance).toLocaleString('fa-IR')}
                        </div>
                        <div className="text-xs text-[var(--arv-text-muted)]">ARV</div>
                      </div>
                    </div>
                  </button>
                </GlowCard>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[var(--arv-danger)] text-sm p-3 rounded-xl bg-[var(--arv-danger)]/10">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ===== Step 2: Input =====
  if (step === 'input' && selectedWallet) {
    const wallet = walletOptions.find((w) => w.id === selectedWallet);
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          
          <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('select-wallet')}
                className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="gold-gradient">ارسال ARV</span>
                </h1>
                <p className="text-xs text-[var(--arv-text-muted)]">
                  از {wallet?.label}
                </p>
              </div>
            </div>

            <GlowCard glowColor="blue">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">
                    آدرس گیرنده
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="arv-input pl-10 font-mono text-xs"
                      placeholder="0x..."
                      dir="ltr"
                    />
                    <QrCode
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--arv-gold)]"
                    />
                  </div>
                  {recipient && !isValidAddress(recipient) && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[var(--arv-danger)]">
                      <AlertCircle size={12} />
                      آدرس نامعتبر
                    </div>
                  )}
                  {recipient && isValidAddress(recipient) && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[var(--arv-success)]">
                      <Check size={12} />
                      آدرس معتبر
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">
                    مقدار (ARV)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="arv-input pl-20"
                      placeholder="0.0"
                      step="0.0001"
                      dir="ltr"
                    />
                    <button
                      onClick={handleMax}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xs px-3 py-1 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] font-bold"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-[var(--arv-text-muted)]">
                    موجودی: {arvBalance} ARV
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">
                    رمز عبور کیف پول
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="arv-input"
                    placeholder="رمز عبور"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 text-[var(--arv-danger)] text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </GlowCard>

            <GlowCard glowColor="gold">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-[var(--arv-gold)] flex-shrink-0 mt-1" />
                <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
                  <div>• کارمزد شبکه: ~0.0002 tBNB</div>
                  <div>• موجودی tBNB: {bnbBalance}</div>
                  <div>• تراکنش غیرقابل بازگشت است</div>
                </div>
              </div>
            </GlowCard>

            <GradientButton
              variant="gold"
              size="lg"
              fullWidth
              onClick={handleInputNext}
              disabled={!isValidAddress(recipient) || !amount || parseFloat(amount) <= 0}
              icon={<ArrowLeft size={18} className="rotate-180" />}
            >
              ادامه
            </GradientButton>
          </div>
        </main>
      </div>
    );
  }

  // ===== Step 3: Confirm =====
  if (step === 'confirm' && selectedWallet) {
    const wallet = walletOptions.find((w) => w.id === selectedWallet);
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          
          <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('input')}
                className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="gold-gradient">تأیید ارسال</span>
                </h1>
                <p className="text-xs text-[var(--arv-text-muted)]">
                  لطفاً اطلاعات را بررسی کنید
                </p>
              </div>
            </div>

            <GlowCard glowColor="gold">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--arv-text-muted)]">از</span>
                  <span className="font-mono text-xs" dir="ltr">
                    {shortAddress(wallet?.address || '', 8)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--arv-text-muted)]">به</span>
                  <span className="font-mono text-xs" dir="ltr">
                    {shortAddress(recipient, 8)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--arv-text-muted)]">مقدار</span>
                  <span className="font-bold gold-gradient">
                    {parseFloat(amount).toLocaleString('fa-IR')} ARV
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--arv-text-muted)]">شبکه</span>
                  <span>{ARV_CONFIG.network.nameShort}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--arv-text-muted)]">کارمزد تقریبی</span>
                  <span className="text-xs">~0.0002 tBNB</span>
                </div>
              </div>
            </GlowCard>

            <GlowCard glowColor="gold" className="border-r-4 border-[var(--arv-warning)]">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-[var(--arv-warning)] flex-shrink-0 mt-1" />
                <div className="text-xs text-[var(--arv-text-muted)]">
                  تراکنش پس از تأیید، غیرقابل بازگشت است. مطمئن شوید آدرس مقصد صحیح است.
                </div>
              </div>
            </GlowCard>

            {error && (
              <div className="flex items-center gap-2 text-[var(--arv-danger)] text-sm p-3 rounded-xl bg-[var(--arv-danger)]/10">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <GradientButton
              variant="gold"
              size="lg"
              fullWidth
              onClick={handleConfirm}
              disabled={loading}
              icon={loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            >
              {loading ? 'در حال ارسال...' : 'تأیید و ارسال'}
            </GradientButton>
          </div>
        </main>
      </div>
    );
  }

  // ===== Step 4: Sending =====
  if (step === 'sending') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          
          <div className="p-4 md:p-6 max-w-2xl mx-auto">
            <GlowCard glowColor="gold">
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto rounded-full bg-[var(--arv-gold)]/15 flex items-center justify-center mb-6 pulse-gold">
                  <Loader2 size={48} className="animate-spin text-[var(--arv-gold)]" />
                </div>
                <h2 className="text-xl font-bold mb-2">در حال ارسال تراکنش...</h2>
                <p className="text-sm text-[var(--arv-text-muted)]">لطفاً صبر کنید</p>
              </div>
            </GlowCard>
          </div>
        </main>
      </div>
    );
  }

  // ===== Step 5: Done =====
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
          <GlowCard glowColor="green">
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-[var(--arv-success)]/15 flex items-center justify-center mb-6">
                <Check size={40} className="text-[var(--arv-success)]" />
              </div>
              <h2 className="text-2xl font-bold mb-2 gold-gradient">
                تراکنش با موفقیت ارسال شد!
              </h2>
              <p className="text-sm text-[var(--arv-text-muted)] mb-6">
                {parseFloat(amount).toLocaleString('fa-IR')} ARV
              </p>

              <div className="p-4 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20 mb-6">
                <div className="text-xs text-[var(--arv-text-muted)] mb-2">هش تراکنش</div>
                <code className="font-mono text-xs break-all block mb-3" dir="ltr">
                  {txHash}
                </code>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleCopyTx}
                    className="text-xs px-3 py-1 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] flex items-center gap-1"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'کپی شد' : 'کپی'}
                  </button>
                  <a
                    href={`${ARV_CONFIG.network.explorer}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    BscScan
                  </a>
                </div>
              </div>

              <GradientButton variant="gold" size="lg" fullWidth onClick={handleFinish} icon={<Wallet size={18} />}>
                رفتن به کیف پول‌ها
              </GradientButton>
            </div>
          </GlowCard>
        </div>
      </main>
    </div>
  );
}
