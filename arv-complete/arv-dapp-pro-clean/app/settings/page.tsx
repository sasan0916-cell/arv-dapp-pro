'use client';

import { useState, useEffect } from 'react';
import {
  Settings, Globe, Moon, Bell, Fingerprint, Shield, Download,
  Upload, RefreshCw, Info, AlertTriangle, Trash2, Check,
  ChevronLeft, Wallet, Lock, FileText, ExternalLink,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { ARV_CONFIG } from '@/lib/arv-config';
import { useLanguage } from '@/lib/i18n';

type Language = 'fa' | 'en';
type Theme = 'dark' | 'light' | 'system';

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState<Theme>('dark');
  const [notifications, setNotifications] = useState({
    transactions: true,
    news: true,
    price: true,
  });
  const [biometric, setBiometric] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = localStorage.getItem('arv_theme') as Theme;
    const savedBiometric = localStorage.getItem('arv_biometric_enabled') === 'true';

    if (savedTheme) setTheme(savedTheme);
    if (savedBiometric) setBiometric(savedBiometric);
  }, []);

  const handleLanguage = (lang: Language) => setLanguage(lang);

  const handleTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('arv_theme', t);
  };

  const handleClearData = () => {
    if (typeof window === 'undefined') return;
    // حذف تمام داده‌ها
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('arv_')) {
        localStorage.removeItem(key);
      }
    });
    setShowClearConfirm(false);
    alert('تمام داده‌ها پاک شد!');
    setTimeout(() => window.location.href = '/', 1000);
  };

  return (
    <div className="flex min-h-screen">
      
      <main className="flex-1 overflow-x-hidden">
        
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">

          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              <span className="gold-gradient">تنظیمات</span>
            </h1>
            <p className="text-xs text-[var(--arv-text-muted)]">
              پیکربندی DApp ARV
            </p>
          </div>

          {/* Language */}
          <GlowCard glowColor="blue">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-400/15 flex items-center justify-center">
                <Globe size={20} className="text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-sm">زبان</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  زبان رابط کاربری
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLanguage('fa')}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${
                  language === 'fa'
                    ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)]'
                    : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'
                }`}
              >
                🇮🇷 فارسی
              </button>
              <button
                onClick={() => handleLanguage('en')}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)]'
                    : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </GlowCard>

          {/* Theme */}
          <GlowCard glowColor="gold">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--arv-gold)]/15 flex items-center justify-center">
                <Moon size={20} className="text-[var(--arv-gold)]" />
              </div>
              <div>
                <div className="font-bold text-sm">تم</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  حالت نمایش
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTheme(t)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all ${
                    theme === t
                      ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)]'
                      : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'
                  }`}
                >
                  {t === 'dark' ? '🌙 تاریک' : t === 'light' ? '☀️ روشن' : '💻 سیستم'}
                </button>
              ))}
            </div>
          </GlowCard>

          {/* Notifications */}
          <GlowCard glowColor="purple">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-400/15 flex items-center justify-center">
                <Bell size={20} className="text-purple-400" />
              </div>
              <div>
                <div className="font-bold text-sm">اعلان‌ها</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  مدیریت اعلان‌ها
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'transactions', label: 'تراکنش‌ها', desc: 'اعلان تراکنش‌های جدید' },
                { key: 'news', label: 'اخبار', desc: 'اخبار اروند خبر' },
                { key: 'price', label: 'قیمت', desc: 'هشدار تغییر قیمت ARV' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--arv-blue)]/20"
                >
                  <div>
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">
                      {item.desc}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev],
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      notifications[item.key as keyof typeof notifications]
                        ? 'bg-[var(--arv-gold)]'
                        : 'bg-[var(--arv-blue)]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-all absolute top-0.5 ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'right-0.5'
                          : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Security */}
          <GlowCard glowColor="green">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--arv-success)]/15 flex items-center justify-center">
                <Shield size={20} className="text-[var(--arv-success)]" />
              </div>
              <div>
                <div className="font-bold text-sm">امنیت</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  تنظیمات امنیتی
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--arv-blue)]/20">
                <div className="flex items-center gap-2">
                  <Fingerprint size={18} className="text-[var(--arv-gold)]" />
                  <div>
                    <div className="text-sm font-bold">اثر انگشت</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">
                      ورود سریع با اثر انگشت
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setBiometric(!biometric);
                    localStorage.setItem('arv_biometric_enabled', String(!biometric));
                  }}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    biometric ? 'bg-[var(--arv-gold)]' : 'bg-[var(--arv-blue)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all absolute top-0.5 ${
                      biometric ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--arv-blue)]/20">
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-blue-400" />
                  <div>
                    <div className="text-sm font-bold">تأیید دو مرحله‌ای</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">
                      امنیت بیشتر برای تراکنش‌ها
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFA(!twoFA)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    twoFA ? 'bg-[var(--arv-gold)]' : 'bg-[var(--arv-blue)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all absolute top-0.5 ${
                      twoFA ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </GlowCard>

          {/* Backup */}
          <GlowCard glowColor="gold">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--arv-gold)]/15 flex items-center justify-center">
                <Download size={20} className="text-[var(--arv-gold)]" />
              </div>
              <div>
                <div className="font-bold text-sm">پشتیبان‌گیری</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  Export و Import کیف پول
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <GradientButton variant="gold" size="sm" fullWidth icon={<Download size={14} />}>
                Export Keystore
              </GradientButton>
              <GradientButton variant="outline" size="sm" fullWidth icon={<Upload size={14} />}>
                Import Keystore
              </GradientButton>
            </div>

            <div className="mt-3">
              <GradientButton variant="outline" size="sm" fullWidth icon={<FileText size={14} />}>
                Export Seed Phrase
              </GradientButton>
            </div>
          </GlowCard>

          {/* About */}
          <GlowCard glowColor="blue">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-400/15 flex items-center justify-center">
                <Info size={20} className="text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-sm">درباره</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  اطلاعات نسخه
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">نسخه</span>
                <span className="font-bold">۱.۰.۰</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">شبکه</span>
                <span className="font-bold">{ARV_CONFIG.network.nameShort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">استاندارد</span>
                <span className="font-bold">{ARV_CONFIG.token.standard}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">Chain ID</span>
                <span className="font-bold">{ARV_CONFIG.network.chainId}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <GradientButton variant="outline" size="sm" fullWidth icon={<RefreshCw size={14} />}>
                بررسی بروزرسانی
              </GradientButton>
              <GradientButton variant="outline" size="sm" fullWidth href="/install-guide.html" icon={<Download size={14} />}>راهنمای نصب</GradientButton>
              <GradientButton variant="outline" size="sm" fullWidth href="/about" icon={<ExternalLink size={14} />}>
                درباره پروژه
              </GradientButton>
            </div>
          </GlowCard>

          {/* Danger Zone */}
          <GlowCard glowColor="gold" className="border-r-4 border-[var(--arv-danger)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--arv-danger)]/15 flex items-center justify-center">
                <AlertTriangle size={20} className="text-[var(--arv-danger)]" />
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--arv-danger)]">
                  منطقه خطر
                </div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  عملیات غیرقابل بازگشت
                </div>
              </div>
            </div>

            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-3 rounded-xl bg-[var(--arv-danger)]/15 border border-[var(--arv-danger)]/30 text-[var(--arv-danger)] font-bold text-sm hover:bg-[var(--arv-danger)]/25 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                پاک کردن تمام داده‌ها
              </button>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-[var(--arv-danger)] text-center mb-2">
                  ⚠️ آیا مطمئن هستید؟ این عمل قابل بازگشت نیست!
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="py-2 rounded-xl bg-[var(--arv-blue)]/40 text-sm font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleClearData}
                    className="py-2 rounded-xl bg-[var(--arv-danger)] text-white text-sm font-bold"
                  >
                    بله، پاک کن
                  </button>
                </div>
              </div>
            )}
          </GlowCard>

          {/* Footer */}
          <div className="text-center py-4 text-xs text-[var(--arv-text-muted)]">
            ARV Super DApp • نسخه ۱.۰.۰ • {new Date().getFullYear()}
          </div>

        </div>
      </main>
    </div>
  );
}
