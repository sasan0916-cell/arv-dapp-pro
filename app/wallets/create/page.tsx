'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Eye, EyeOff, Check, AlertCircle, ArrowLeft, Fingerprint,
  Shield, Wallet, Loader2, Copy, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Sidebar } from '@/components/Sidebar';
import { createNewWallet, saveWallet } from '@/lib/services/wallet-service';
import { enableBiometric, isBiometricAvailable } from '@/lib/services/biometric';
import { copyToClipboard } from '@/lib/utils';

type Step = 'select' | 'show-mnemonic' | 'verify' | 'password' | 'biometric' | 'done';
type WalletId = 'main' | 'reward' | 'user';

export default function CreateWalletPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('select');
  const [walletId, setWalletId] = useState<WalletId>('user');
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [verifyWords, setVerifyWords] = useState<number[]>([]);
  const [verifyInputs, setVerifyInputs] = useState<string[]>(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then(setBiometricAvailable);
  }, []);

  // ===== Step 1: Select wallet type =====
  const handleSelect = (id: WalletId) => {
    setWalletId(id);
    generateWallet();
  };

  const generateWallet = async () => {
    setLoading(true);
    try {
      const wallet = await createNewWallet();
      const words = wallet.mnemonic?.split(' ') || [];
      setMnemonic(words);
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);

      // ۴ کلمه تصادفی برای تأیید
      const indices: number[] = [];
      while (indices.length < 4) {
        const idx = Math.floor(Math.random() * 12);
        if (!indices.includes(idx)) indices.push(idx);
      }
      const sortedIndices = [...indices].sort((a, b) => a - b);
      setVerifyWords(sortedIndices);
      setStep('show-mnemonic');
    } catch (e: any) {
      setError(e.message || 'خطا در ساخت کیف پول');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMnemonic = async () => {
    const ok = await copyToClipboard(mnemonic.join(' '));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ===== Step 2 → Step 3: Verify =====
  const handleShowNext = () => {
    setStep('verify');
    setShowMnemonic(true);
  };

  const handleVerifyNext = () => {
    // چک کلمات - با پیام خطای دقیق
    const errors: string[] = [];
    verifyWords.forEach((wordIdx, i) => {
      const input = (verifyInputs[i] || '').trim().toLowerCase();
      const expected = (mnemonic[wordIdx] || '').toLowerCase();
      if (input !== expected) {
        errors.push("کلمه شماره " + (wordIdx + 1) + ": شما " + input + " وارد کردید ولی " + expected + " درست است");
      }
    });

    if (errors.length > 0) {
      setError(errors.join(' | '));
      return;
    }

    setError('');
    setStep('password');
  };

  // ===== Step 4: Password =====
  const handleCreate = async () => {
    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد');
      return;
    }
    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const walletData = {
        address,
        privateKey,
        mnemonic: mnemonic.join(' '),
        importType: 'created' as const,
        createdAt: Date.now(),
      };

      await saveWallet(walletId, walletData, password);
      localStorage.setItem('arv_' + walletId + '_address', address);

      if (biometricAvailable && useBiometric) {
        setStep('biometric');
      } else {
        setStep('done');
      }
    } catch (e: any) {
      setError(e.message || 'خطا در ذخیره‌سازی کیف پول');
    } finally {
      setLoading(false);
    }
  };

  // ===== Step 5: Biometric =====
  const handleBiometric = async () => {
    setLoading(true);
    try {
      await enableBiometric(walletId, `ARV ${walletId}`);
      setStep('done');
    } catch {
      setStep('done');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    router.push('/wallets');
  };

  const getWalletLabel = (id: WalletId) => {
    if (id === 'main') return 'کیف اصلی';
    if (id === 'reward') return 'کیف پاداش';
    return 'کیف کاربر';
  };

  // ===== Step 1: Select =====
  if (step === 'select') {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/wallets')}
            className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              <span className="gold-gradient">ساخت کیف پول جدید</span>
            </h1>
            <p className="text-xs text-[var(--arv-text-muted)]">
              نوع کیف پول را انتخاب کنید
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => handleSelect('user')} className="text-right">
            <GlowCard glowColor="blue" hover>
              <div className="w-14 h-14 rounded-2xl bg-blue-400/15 flex items-center justify-center mb-3">
                <Wallet size={28} className="text-blue-400" />
              </div>
              <div className="font-bold mb-1">کیف کاربر</div>
              <p className="text-xs text-[var(--arv-text-muted)]">
                کیف پول شخصی برای هر کاربر
              </p>
            </GlowCard>
          </button>

          <button onClick={() => handleSelect('main')} className="text-right">
            <GlowCard glowColor="gold" hover>
              <div className="w-14 h-14 rounded-2xl bg-[var(--arv-gold)]/15 flex items-center justify-center mb-3">
                <Shield size={28} className="text-[var(--arv-gold)]" />
              </div>
              <div className="font-bold mb-1">کیف اصلی</div>
              <p className="text-xs text-[var(--arv-text-muted)]">
                ۶۰٪ عرضه کل (فقط مدیرکل)
              </p>
            </GlowCard>
          </button>

          <button onClick={() => handleSelect('reward')} className="text-right">
            <GlowCard glowColor="green" hover>
              <div className="w-14 h-14 rounded-2xl bg-[var(--arv-success)]/15 flex items-center justify-center mb-3">
                <Plus size={28} className="text-[var(--arv-success)]" />
              </div>
              <div className="font-bold mb-1">کیف پاداش</div>
              <p className="text-xs text-[var(--arv-text-muted)]">
                ۴۰٪ عرضه کل (فقط مدیرکل)
              </p>
            </GlowCard>
          </button>
        </div>

        <GlowCard glowColor="gold">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[var(--arv-warning)] flex-shrink-0 mt-1" />
            <div className="text-sm text-[var(--arv-text-muted)]">
              <div className="font-bold text-white mb-2">توجه</div>
              <p>
                ساخت کیف اصلی و پاداش فقط برای مدیرکل توصیه می‌شود.
                کاربران عادی باید از گزینه «کیف کاربر» استفاده کنند.
              </p>
            </div>
          </div>
        </GlowCard>
      </div>
    );
  }

  // ===== Step 2: Show Mnemonic =====
  if (step === 'show-mnemonic') {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep('select')}
            className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              <span className="gold-gradient">۱۲ کلمه بازیابی</span>
            </h1>
            <p className="text-xs text-[var(--arv-text-muted)]">
              {getWalletLabel(walletId)}
            </p>
          </div>
        </div>

        <GlowCard glowColor="gold" className="border-r-4 border-[var(--arv-warning)]">
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} className="text-[var(--arv-warning)] flex-shrink-0 mt-1" />
            <div>
              <div className="font-bold text-[var(--arv-warning)] mb-2">هشدار مهم</div>
              <p className="text-sm text-[var(--arv-text-muted)] leading-relaxed">
                این ۱۲ کلمه را در جای امن یادداشت کنید. هر کسی که این کلمات را داشته باشد،
                به تمام دارایی‌های شما دسترسی خواهد داشت. این کلمات را با کسی به اشتراک نگذارید
                و در گوشی یا ایمیل ذخیره نکنید.
              </p>
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="gold">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold">۱۲ کلمه بازیابی</div>
            <button
              onClick={handleCopyMnemonic}
              className="text-xs px-3 py-1 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] flex items-center gap-1"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'کپی شد' : 'کپی همه'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {mnemonic.map((word, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-3 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20"
              >
                <span className="text-xs text-[var(--arv-text-muted)] w-6">
                  {(i + 1).toLocaleString('fa-IR')}.
                </span>
                <span className="font-mono text-sm">{word}</span>
              </div>
            ))}
          </div>
        </GlowCard>

        <GradientButton
          variant="gold"
          size="lg"
          fullWidth
          onClick={handleShowNext}
          icon={<Check size={18} />}
        >
          یادداشت کردم، ادامه
        </GradientButton>
      </div>
    );
  }

  // ===== Step 3: Verify =====
  if (step === 'verify') {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            <span className="gold-gradient">تأیید کلمات</span>
          </h1>
          <p className="text-sm text-[var(--arv-text-muted)]">
            برای اطمینان، کلمات خواسته‌شده را وارد کنید
          </p>
        </div>

        <GlowCard glowColor="blue">
          <div className="space-y-4">
            {verifyWords.map((wordIdx, i) => (
              <div key={i}>
                <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">
                  کلمه شماره {(wordIdx + 1).toLocaleString('fa-IR')}
                </label>
                <input
                  type="text"
                  value={verifyInputs[i]}
                  onChange={(e) => {
                    const newInputs = [...verifyInputs];
                    newInputs[i] = e.target.value;
                    setVerifyInputs(newInputs);
                  }}
                  className="arv-input font-mono"
                  placeholder="کلمه را وارد کنید"
                  dir="ltr"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-[var(--arv-danger)] text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </GlowCard>

        <GradientButton
          variant="gold"
          size="lg"
          fullWidth
          onClick={handleVerifyNext}
          icon={<Check size={18} />}
        >
          تأیید و ادامه
        </GradientButton>
      </div>
    );
  }

  // ===== Step 4: Password =====
  if (step === 'password') {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            <span className="gold-gradient">تعیین رمز عبور</span>
          </h1>
          <p className="text-sm text-[var(--arv-text-muted)]">
            برای رمزنگاری کیف پول
          </p>
        </div>

        <GlowCard glowColor="gold">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">
                رمز عبور (حداقل ۸ کاراکتر)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="arv-input pl-10"
                  placeholder="رمز قوی وارد کنید"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--arv-text-muted)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">
                تکرار رمز عبور
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="arv-input"
                placeholder="رمز را دوباره وارد کنید"
              />
            </div>

            {biometricAvailable && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20">
                <div className="flex items-center gap-2">
                  <Fingerprint size={18} className="text-[var(--arv-gold)]" />
                  <span className="text-sm">فعال‌سازی اثر انگشت</span>
                </div>
                <button
                  onClick={() => setUseBiometric(!useBiometric)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    useBiometric ? 'bg-[var(--arv-gold)]' : 'bg-[var(--arv-blue)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all ${
                      useBiometric ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-[var(--arv-danger)] text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </GlowCard>

        <GradientButton
          variant="gold"
          size="lg"
          fullWidth
          onClick={handleCreate}
          disabled={loading}
          icon={loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
        >
          {loading ? 'در حال ساخت...' : 'ساخت کیف پول'}
        </GradientButton>
      </div>
    );
  }

  // ===== Step 5: Biometric =====
  if (step === 'biometric') {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            <span className="gold-gradient">فعال‌سازی اثر انگشت</span>
          </h1>
          <p className="text-sm text-[var(--arv-text-muted)]">
            برای ورود سریع و امن
          </p>
        </div>

        <GlowCard glowColor="green">
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-[var(--arv-gold)]/15 flex items-center justify-center mb-6 pulse-gold">
              <Fingerprint size={48} className="text-[var(--arv-gold)]" />
            </div>
            <p className="text-sm text-[var(--arv-text-muted)] mb-2">
              انگشت خود را روی سنسور قرار دهید
            </p>
          </div>
        </GlowCard>

        <GradientButton
          variant="gold"
          size="lg"
          fullWidth
          onClick={handleBiometric}
          disabled={loading}
          icon={loading ? <Loader2 size={18} className="animate-spin" /> : <Fingerprint size={18} />}
        >
          {loading ? 'در حال ثبت...' : 'فعال‌سازی اثر انگشت'}
        </GradientButton>

        <button
          onClick={() => setStep('done')}
          className="w-full text-sm text-[var(--arv-text-muted)] hover:text-white"
        >
          رد کردن
        </button>
      </div>
    );
  }

  // ===== Step 6: Done =====
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <GlowCard glowColor="green">
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--arv-success)]/15 flex items-center justify-center mb-6">
            <Check size={40} className="text-[var(--arv-success)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2 gold-gradient">
            کیف پول با موفقیت ساخته شد!
          </h2>
          <p className="text-sm text-[var(--arv-text-muted)] mb-6">
            {getWalletLabel(walletId)}
          </p>

          <div className="p-4 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20 mb-6">
            <div className="text-xs text-[var(--arv-text-muted)] mb-2">آدرس</div>
            <code className="font-mono text-sm break-all" dir="ltr">
              {address}
            </code>
          </div>

          <GradientButton variant="gold" size="lg" fullWidth onClick={handleFinish} icon={<Wallet size={18} />}>
            رفتن به کیف پول‌ها
          </GradientButton>
        </div>
      </GlowCard>
    </div>
  );
}
