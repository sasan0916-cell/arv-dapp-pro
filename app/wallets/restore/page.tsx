'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  KeyRound, Eye, EyeOff, Check, AlertCircle, ArrowLeft,
  Fingerprint, Shield, Wallet, Loader2,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Sidebar } from '@/components/Sidebar';
import { ARV_CONFIG } from '@/lib/arv-config';
import { detectInputType } from '@/lib/utils';
import { restoreFromInput, saveWallet } from '@/lib/services/wallet-service';
import { enableBiometric, isBiometricAvailable } from '@/lib/services/biometric';
import { shortAddress } from '@/lib/utils';

type Step = 'input' | 'password' | 'biometric' | 'done';
type WalletId = 'main' | 'reward' | 'user';

function RestoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const walletIdParam = (searchParams.get('wallet') || 'user') as WalletId;

  const [step, setStep] = useState<Step>('input');
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'mnemonic' | 'privateKey' | 'unknown'>('unknown');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [restoredAddress, setRestoredAddress] = useState('');
  const [restoredPrivateKey, setRestoredPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then(setBiometricAvailable);
  }, []);

  useEffect(() => {
    if (input.trim()) {
      const type = detectInputType(input);
      setInputType(type);
      setError('');
    } else {
      setInputType('unknown');
    }
  }, [input]);

  const handleNext = () => {
    if (inputType === 'unknown') {
      setError('لطفاً ۱۲ کلمه بازیابی یا کلید خصوصی ۶۴ کاراکتری وارد کنید');
      return;
    }
    setStep('password');
    setError('');
  };

  const handleRestore = async () => {
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
      const wallet = restoreFromInput(input.trim());
      setRestoredAddress(wallet.address);
      setRestoredPrivateKey(wallet.privateKey);

      await saveWallet(walletIdParam, wallet, password);

      if (biometricAvailable && useBiometric) {
        setStep('biometric');
      } else {
        setStep('done');
      }
    } catch (e: any) {
      setError(e.message || 'خطا در بازیابی کیف پول');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    setLoading(true);
    try {
      await enableBiometric(walletIdParam, `ARV ${walletIdParam}`);
      setStep('done');
    } catch (e) {
      // اگه اثر انگشت خطا داد، مستقیم برو به done
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

  // ===== Step 1: Input =====
  if (step === 'input') {
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
              <span className="gold-gradient">بازیابی کیف پول</span>
            </h1>
            <p className="text-xs text-[var(--arv-text-muted)]">
              {getWalletLabel(walletIdParam)}
            </p>
          </div>
        </div>

        <GlowCard glowColor="blue">
          <div className="flex items-start gap-3 mb-4">
            <KeyRound size={24} className="text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <div className="font-bold mb-1">ورودی هوشمند</div>
              <p className="text-xs text-[var(--arv-text-muted)]">
                می‌توانید از <strong>۱۲ کلمه بازیابی</strong> یا <strong>کلید خصوصی ۶۴ کاراکتری</strong> استفاده کنید.
              </p>
            </div>
          </div>

          <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">
            ۱۲ کلمه یا کلید خصوصی
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder="مثال: apple banana cherry ... یا 0x1234abcd..."
            className="arv-input font-mono text-sm resize-none"
            dir="ltr"
            style={{ fontFamily: 'monospace' }}
          />

          {/* Detection Result */}
          {input.trim() && (
            <div className="mt-3 flex items-center gap-2">
              {inputType === 'mnemonic' && (
                <>
                  <Check size={16} className="text-[var(--arv-success)]" />
                  <span className="text-sm text-[var(--arv-success)]">
                    ✅ Seed Phrase (۱۲ کلمه) شناسایی شد
                  </span>
                </>
              )}
              {inputType === 'privateKey' && (
                <>
                  <Check size={16} className="text-[var(--arv-success)]" />
                  <span className="text-sm text-[var(--arv-success)]">
                    ✅ Private Key (۶۴ کاراکتر) شناسایی شد
                  </span>
                </>
              )}
              {inputType === 'unknown' && (
                <>
                  <AlertCircle size={16} className="text-[var(--arv-warning)]" />
                  <span className="text-sm text-[var(--arv-warning)]">
                    فرمت نامعتبر — باید ۱۲ کلمه یا ۶۴ کاراکتر hex باشد
                  </span>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 text-[var(--arv-danger)] text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </GlowCard>

        {/* Info */}
        <GlowCard glowColor="gold">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-[var(--arv-gold)] flex-shrink-0 mt-1" />
            <div className="text-sm text-[var(--arv-text-muted)] space-y-1">
              <div className="font-bold text-white mb-2">توجه امنیتی</div>
              <p>• کیف پول فقط روی دستگاه شما ذخیره می‌شود</p>
              <p>• داده‌ها با AES-256 رمزنگاری می‌شوند</p>
              <p>• کلید خصوصی به هیچ سروری ارسال نمی‌شود</p>
            </div>
          </div>
        </GlowCard>

        <GradientButton
          variant="gold"
          size="lg"
          fullWidth
          onClick={handleNext}
          disabled={inputType === 'unknown'}
          icon={<ArrowLeft size={18} />}
        >
          ادامه
        </GradientButton>
      </div>
    );
  }

  // ===== Step 2: Password =====
  if (step === 'password') {
    return (
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
              <span className="gold-gradient">تعیین رمز عبور</span>
            </h1>
            <p className="text-xs text-[var(--arv-text-muted)]">
              برای رمزنگاری کیف پول
            </p>
          </div>
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
                placeholder="رمز عبور را دوباره وارد کنید"
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
          onClick={handleRestore}
          disabled={loading}
          icon={loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
        >
          {loading ? 'در حال بازیابی...' : 'بازیابی کیف پول'}
        </GradientButton>
      </div>
    );
  }

  // ===== Step 3: Biometric =====
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
              انگشت خود را روی سنسور اثر انگشت قرار دهید
            </p>
            <p className="text-xs text-[var(--arv-text-muted)]">
              یا از چهره خود استفاده کنید
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
          رد کردن این مرحله
        </button>
      </div>
    );
  }

  // ===== Step 4: Done =====
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <GlowCard glowColor="green">
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--arv-success)]/15 flex items-center justify-center mb-6">
            <Check size={40} className="text-[var(--arv-success)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2 gold-gradient">
            کیف پول با موفقیت بازیابی شد!
          </h2>
          <p className="text-sm text-[var(--arv-text-muted)] mb-6">
            {getWalletLabel(walletIdParam)}
          </p>

          <div className="p-4 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20 mb-6">
            <div className="text-xs text-[var(--arv-text-muted)] mb-2">آدرس</div>
            <code className="font-mono text-sm break-all" dir="ltr">
              {restoredAddress}
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

export default function RestorePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        
        <Suspense
          fallback={
            <div className="p-6 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-[var(--arv-gold)]" />
            </div>
          }
        >
          <RestoreContent />
        </Suspense>
      </main>
    </div>
  );
}
