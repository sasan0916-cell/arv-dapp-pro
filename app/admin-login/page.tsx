'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft, Eye, EyeOff, Lock, Shield, AlertTriangle,
  Fingerprint, Check, Loader2, AlertCircle,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { ARV_CONFIG } from '@/lib/arv-config';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasBiometric, setHasBiometric] = useState(false);

  useEffect(() => {
    // چک کن WebAuthn در دسترسه
    if (typeof window !== 'undefined' && window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => {
          setBiometricAvailable(available);
          // چک کن قبلاً اثر انگشت ثبت شده یا نه
          const stored = localStorage.getItem('arv_admin_biometric');
          setHasBiometric(!!stored);
        })
        .catch(() => {});
    }
  }, []);

  const handleLogin = async () => {
    if (!password) {
      setError('رمز عبور را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');

    // تأخیر کوچیک برای UX
    await new Promise((r) => setTimeout(r, 500));

    if (password === ARV_CONFIG.admin.password) {
      // رمز درسته → ذخیره در sessionStorage
      sessionStorage.setItem('arv_admin', 'true');
      sessionStorage.setItem('arv_admin_time', String(Date.now()));
      router.push('/admin');
    } else {
      setError('رمز عبور اشتباه است');
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    setLoading(true);
    setError('');

    try {
      const stored = localStorage.getItem('arv_admin_biometric');
      if (!stored) {
        throw new Error('اثر انگشت ثبت نشده');
      }

      const credData = JSON.parse(stored);
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const credIdBuf = Uint8Array.from(atob(credData.id), (c) => c.charCodeAt(0));

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [
            { id: credIdBuf, type: 'public-key', transports: ['internal'] },
          ],
          userVerification: 'required',
          timeout: 60000,
        },
      });

      if (assertion) {
        sessionStorage.setItem('arv_admin', 'true');
        sessionStorage.setItem('arv_admin_time', String(Date.now()));
        router.push('/admin');
      }
    } catch (e: any) {
      setError(e.message || 'خطا در تأیید اثر انگشت');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-[var(--arv-gold)] hover:text-[var(--arv-gold-light)] transition-all"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">بازگشت به اپ</span>
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Image
              src="/arv-logo.png"
              alt="ARV Logo"
              fill
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            <span className="gold-gradient">ورود مدیرکل</span>
          </h1>
          <p className="text-xs text-[var(--arv-text-muted)]">
            این بخش فقط برای مدیرکل پروژه قابل دسترسی است
          </p>
        </div>

        {/* Login Card */}
        <GlowCard glowColor="gold">
          {/* Password Input */}
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">
                رمز مدیرکل
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--arv-gold)]"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="arv-input pr-10 pl-10 font-mono"
                  placeholder="رمز عبور را وارد کنید"
                  dir="ltr"
                  autoComplete="off"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--arv-text-muted)] hover:text-[var(--arv-gold)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

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
              onClick={handleLogin}
              disabled={loading}
              icon={
                loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Shield size={18} />
                )
              }
            >
              {loading ? 'در حال ورود...' : 'ورود با رمز'}
            </GradientButton>
          </div>

          {/* Biometric Section */}
          {biometricAvailable && hasBiometric && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-[var(--arv-blue)]/40"></div>
                <span className="text-xs text-[var(--arv-text-muted)]">یا</span>
                <div className="flex-1 h-px bg-[var(--arv-blue)]/40"></div>
              </div>

              <GradientButton
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleBiometric}
                disabled={loading}
                icon={<Fingerprint size={18} />}
              >
                ورود با اثر انگشت
              </GradientButton>
            </>
          )}
        </GlowCard>

        {/* Warning */}
        <GlowCard glowColor="gold" className="border-r-4 border-[var(--arv-warning)]">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              className="text-[var(--arv-warning)] flex-shrink-0 mt-1"
            />
            <div className="text-xs text-[var(--arv-text-muted)]">
              این رمز محرمانه است. آن را با کسی به اشتراک نگذارید.
            </div>
          </div>
        </GlowCard>

      </div>
    </div>
  );
}
