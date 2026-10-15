'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft, Eye, EyeOff, Lock, Shield, AlertTriangle,
  Fingerprint, Loader2, AlertCircle,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import {
  isBiometricAvailable,
  hasAdminBiometric,
  registerAdminBiometric,
  removeAdminBiometric,
  verifyAdminBiometric,
} from '@/lib/services/biometric';
import {
  fetchAdminSession,
  loginAdmin,
  loginAdminWithDevice,
  registerAdminDevice,
} from '@/lib/admin-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasBiometric, setHasBiometric] = useState(false);
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then((available) => {
      setBiometricAvailable(available);
      setHasBiometric(hasAdminBiometric());
    });
    // اگر قبلاً وارد شده، مستقیم برو به پنل
    fetchAdminSession().then((s) => {
      if (s.admin) router.replace('/admin');
    });
  }, [router]);

  const goToPanel = () => router.push('/admin');

  const handleLogin = async () => {
    if (!password) {
      setError('رمز عبور را وارد کنید');
      return;
    }
    setLoading(true);
    setError('');

    const res = await loginAdmin(password);
    if (res.ok) {
      // پیشنهاد فعال‌سازی اثر انگشت اگر پشتیبانی می‌شود و هنوز ثبت نشده
      if (biometricAvailable && !hasBiometric) {
        setLoading(false);
        setShowEnroll(true);
      } else {
        goToPanel();
      }
      return;
    }

    if (res.status === 503) setError('ورود مدیر روی سرور تنظیم نشده است (متغیرهای محیطی را بررسی کنید)');
    else if (res.status === 429) setError('تلاش‌های ناموفق زیاد بود. چند دقیقه بعد دوباره امتحان کنید');
    else if (res.status === 0) setError('ارتباط با سرور برقرار نشد');
    else setError('رمز عبور اشتباه است');
    setLoading(false);
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    setError('');
    const ok = await registerAdminBiometric();
    if (ok) {
      // سرور این دستگاه را برای ورود با اثر انگشت مطمئن می‌کند
      const dev = await registerAdminDevice();
      if (dev.ok) {
        setHasBiometric(true);
        goToPanel();
        return;
      }
      removeAdminBiometric();
    }
    setEnrolling(false);
    setError('ثبت اثر انگشت انجام نشد. می‌توانید بعداً دوباره تلاش کنید.');
  };

  const handleBiometric = async () => {
    setLoading(true);
    setError('');
    const ok = await verifyAdminBiometric();
    if (!ok) {
      setError('تأیید اثر انگشت ناموفق بود');
      setLoading(false);
      return;
    }
    const res = await loginAdminWithDevice();
    if (res.ok) {
      goToPanel();
    } else {
      // اعتبار دستگاه تمام شده؛ باید یک بار با رمز وارد شد
      removeAdminBiometric();
      setHasBiometric(false);
      setError('اعتبار این دستگاه تمام شده است؛ یک بار با رمز وارد شوید');
      setLoading(false);
    }
  };

  const errorBox = error && (
    <div className="flex items-center gap-2 text-[var(--arv-danger)] text-sm p-3 rounded-xl bg-[var(--arv-danger)]/10">
      <AlertCircle size={16} />
      {error}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-[var(--arv-gold)] hover:text-[var(--arv-gold-light)] transition-all"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">بازگشت به اپ</span>
        </button>

        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Image src="/arv-logo.png" alt="ARV Logo" fill sizes="80px" className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            <span className="gold-gradient">ورود مدیرکل</span>
          </h1>
          <p className="text-xs text-[var(--arv-text-muted)]">
            این بخش فقط برای مدیرکل پروژه قابل دسترسی است
          </p>
        </div>

        {showEnroll ? (
          <GlowCard glowColor="gold">
            <div className="space-y-4 text-center">
              <Fingerprint size={40} className="mx-auto text-[var(--arv-gold)]" />
              <p className="text-sm">دفعهٔ بعد با اثر انگشت وارد شوید؟</p>
              {errorBox}
              <GradientButton
                variant="gold"
                size="lg"
                fullWidth
                onClick={handleEnroll}
                disabled={enrolling}
                icon={enrolling ? <Loader2 size={18} className="animate-spin" /> : <Fingerprint size={18} />}
              >
                {enrolling ? 'در انتظار تأیید...' : 'فعال‌سازی اثر انگشت'}
              </GradientButton>
              <GradientButton variant="outline" size="lg" fullWidth onClick={goToPanel}>
                بعداً
              </GradientButton>
            </div>
          </GlowCard>
        ) : (
          <GlowCard glowColor="gold">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">رمز مدیرکل</label>
                <div className="relative">
                  <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--arv-gold)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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

              {errorBox}

              <GradientButton
                variant="gold"
                size="lg"
                fullWidth
                onClick={handleLogin}
                disabled={loading}
                icon={loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
              >
                {loading ? 'در حال ورود...' : 'ورود با رمز'}
              </GradientButton>
            </div>

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
        )}

        <GlowCard glowColor="gold" className="border-r-4 border-[var(--arv-warning)]">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[var(--arv-warning)] flex-shrink-0 mt-1" />
            <div className="text-xs text-[var(--arv-text-muted)]">
              این رمز محرمانه است. آن را با کسی به اشتراک نگذارید.
            </div>
          </div>
        </GlowCard>

      </div>
    </div>
  );
}
