'use client';

import { useState, useEffect } from 'react';
import { loadWallet, saveWallet } from '@/lib/services/wallet-service';
import {
  Settings, Globe, Moon, Bell, Fingerprint, Shield, Download,
  Upload, RefreshCw, Info, AlertTriangle, Trash2, Check, Copy,
  ChevronLeft, Wallet, Lock, FileText, ExternalLink,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { ARV_CONFIG } from '@/lib/arv-config';
import { useLanguage } from '@/lib/i18n';
import { useAccount, useDisconnect } from 'wagmi';
import { Laptop, LogOut, ShieldAlert } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { generate2FASecret, get2FAUri, verify2FACode, save2FASecret, remove2FA } from '@/lib/services/twofa-service';
import { copyToClipboard } from '@/lib/utils';

type Language = 'fa' | 'en';
type Theme = 'dark' | 'light' | 'system';

export default function SettingsPage() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { language, setLanguage } = useLanguage();
  const en = language === 'en';
  const [theme, setTheme] = useState<Theme>('dark');
  const [notifications, setNotifications] = useState({
    transactions: true,
    news: true,
    price: true,
  });
  const [biometric, setBiometric] = useState(false);
  const [autoLockTimeout, setAutoLockTimeout] = useState<number>(5);
  const [twoFA, setTwoFA] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = localStorage.getItem('arv_theme') as Theme;
    const savedBiometric = localStorage.getItem('arv_biometric_enabled') === 'true';
    const savedAutoLock = localStorage.getItem('arv_auto_lock_timeout_minutes');
    if (savedAutoLock !== null) {
      const parsed = parseInt(savedAutoLock, 10);
      if ([1, 5, 15, 30, 0].includes(parsed)) {
        setAutoLockTimeout(parsed);
      }
    }

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
    
    // چک ۱: آیا کیف پول داخلی داره؟
    const hasInternalWallet = 
      localStorage.getItem('arv_wallet_main') ||
      localStorage.getItem('arv_wallet_reward') ||
      localStorage.getItem('arv_wallet_user');
    
    if (hasInternalWallet) {
      const warning = en
        ? '⚠️ You have internal wallets with private keys stored locally!\n\n' +
          'If you delete them without backing up the Seed Phrase, your funds will be LOST FOREVER.\n\n' +
          'Have you backed up all your Seed Phrases?'
        : '⚠️ شما کیف پول‌های داخلی با کلید خصوصی دارید!\n\n' +
          'اگر بدون یادداشت Seed Phrase حذف کنید، دارایی شما برای همیشه از بین می‌رود.\n\n' +
          'آیا Seed Phrase همه کیف‌ها را یادداشت کرده‌اید؟';
      
      if (!confirm(warning)) return;
      
      // تأیید مضاعف
      const typed = prompt(
        en 
          ? 'Type "DELETE" to confirm permanent deletion of all wallet data:'
          : 'برای تأیید نهایی، کلمه "DELETE" را تایپ کنید (به انگلیسی):'
      );
      
      if (typed !== 'DELETE') {
        alert(en ? 'Cancelled.' : 'لغو شد.');
        return;
      }
    } else {
      // بدون کیف داخلی → تأیید ساده
      if (!confirm(en ? 'Clear all app data?' : 'همه داده‌های برنامه پاک شود؟')) return;
    }
    
    // پاک کردن
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('arv_')) {
        localStorage.removeItem(key);
      }
    });
    
    setShowClearConfirm(false);
    alert(en ? 'All data cleared!' : 'تمام داده‌ها پاک شد!');
    setTimeout(() => window.location.href = '/', 1000);
  };

  // ===== Export Keystore =====
  const handleExportKeystore = async () => {
    try {
      // چک وجود کیف پول داخلی
      const hasWallet = ['main', 'reward', 'user'].some((w) =>
        localStorage.getItem(`arv_wallet_${w}`)
      );
      if (!hasWallet) {
        alert(en ? 'No internal wallet found' : 'کیف پول داخلی پیدا نشد');
        return;
      }
      
      const password = prompt(en ? 'Enter wallet password:' : 'رمز کیف پول را وارد کنید:');
      if (!password) return;
      
      // لیست کیف‌های موجود
      const wallets: Record<string, string> = {};
      for (const w of ['main', 'reward', 'user']) {
        const data = localStorage.getItem(`arv_wallet_${w}`);
        if (data) wallets[w] = data;
      }
      
      // چک رمز با تلاش برای باز کردن کیف user یا اولین کیف
      const firstWalletId = Object.keys(wallets)[0] as 'main' | 'reward' | 'user';
      const testWallet = await loadWallet(firstWalletId, password);
      if (!testWallet) {
        alert(en ? 'Wrong password' : 'رمز اشتباه است');
        return;
      }
      
      // دانلود فایل JSON
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        wallets,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arv-keystore-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(en ? '✅ Keystore exported successfully!' : '✅ Keystore با موفقیت ذخیره شد!');
    } catch (e: any) {
      alert((en ? 'Error: ' : 'خطا: ') + (e.message || 'Unknown'));
    }
  };

  // ===== Import Keystore =====
  const handleImportKeystore = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          
          // چک فرمت
          if (!data.wallets || typeof data.wallets !== 'object') {
            alert(en ? 'Invalid keystore file' : 'فایل نامعتبر است');
            return;
          }
          
          // چک کیف‌های موجود
          const existing = ['main', 'reward', 'user'].filter((w) =>
            localStorage.getItem(`arv_wallet_${w}`)
          );
          
          if (existing.length > 0) {
            const confirm_msg = en
              ? `Warning: ${existing.length} wallet(s) already exist. Overwrite them?`
              : `هشدار: ${existing.length} کیف پول موجود است. جایگزین شوند؟`;
            if (!confirm(confirm_msg)) return;
          }
          
          // ذخیره
          for (const [w, data_] of Object.entries(data.wallets)) {
            if (['main', 'reward', 'user'].includes(w)) {
              localStorage.setItem(`arv_wallet_${w}`, String(data_));
            }
          }
          
          alert(en ? '✅ Keystore imported successfully!' : '✅ Keystore با موفقیت بارگذاری شد!');
          setTimeout(() => window.location.reload(), 1000);
        } catch (e: any) {
          alert((en ? 'Error: ' : 'خطا: ') + (e.message || 'Invalid file'));
        }
      };
      input.click();
    } catch (e: any) {
      alert((en ? 'Error: ' : 'خطا: ') + (e.message || 'Unknown'));
    }
  };

  // ===== Export Seed Phrase =====
  const handleExportSeed = async () => {
    try {
      const hasWallet = ['main', 'reward', 'user'].some((w) =>
        localStorage.getItem(`arv_wallet_${w}`)
      );
      if (!hasWallet) {
        alert(en ? 'No internal wallet found' : 'کیف پول داخلی پیدا نشد');
        return;
      }
      
      const password = prompt(en ? 'Enter wallet password:' : 'رمز کیف پول را وارد کنید:');
      if (!password) return;
      
      // نمایش هشدار
      const warning = en
        ? '⚠️ WARNING: The Seed Phrase will be displayed.\n\n' +
          'Make sure:\n' +
          '• Nobody is watching your screen\n' +
          '• No screen recording is active\n' +
          '• You are in a safe place\n\n' +
          'Continue?'
        : '⚠️ هشدار: Seed Phrase نمایش داده می‌شود.\n\n' +
          'مطمئن شوید:\n' +
          '• کسی به صفحه شما نگاه نمی‌کند\n' +
          '• ضبط صفحه فعال نیست\n' +
          '• در جای امنی هستید\n\n' +
          'ادامه؟';
      
      if (!confirm(warning)) return;
      
      // پیدا کردن اولین کیف
      const walletId = ['main', 'reward', 'user'].find((w) =>
        localStorage.getItem(`arv_wallet_${w}`)
      ) as 'main' | 'reward' | 'user';
      
      const walletData = await loadWallet(walletId, password);
      if (!walletData) {
        alert(en ? 'Wrong password' : 'رمز اشتباه است');
        return;
      }
      
      if (walletData.mnemonic) {
        // نمایش Seed
        const seedWarning = en
          ? `Seed Phrase (${walletId}):\n\n${walletData.mnemonic}\n\n` +
            `⚠️ Write this down on paper and store it safely.\n` +
            `Never share it with anyone!`
          : `Seed Phrase (${walletId}):\n\n${walletData.mnemonic}\n\n` +
            `⚠️ این را روی کاغذ بنویسید و در جای امن نگه دارید.\n` +
            `هرگز با کسی به اشتراک نگذارید!`;
        alert(seedWarning);
      } else {
        alert(en ? 'This wallet has no Seed Phrase (imported with private key)' : 'این کیف Seed Phrase ندارد (با private key وارد شده)');
      }
    } catch (e: any) {
      alert((en ? 'Error: ' : 'خطا: ') + (e.message || 'Unknown'));
    }
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
                <div className="font-bold text-sm">{en ? 'Language' : 'زبان'}</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  {en ? 'Interface language' : 'زبان رابط کاربری'}
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
                <div className="font-bold text-sm">{en ? 'Notifications' : 'اعلان‌ها'}</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  {en ? 'Manage notifications' : 'مدیریت اعلان‌ها'}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'transactions', label: en ? 'Transactions' : 'تراکنش‌ها', desc: en ? 'New transaction alerts' : 'اعلان تراکنش‌های جدید' },
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
                <div className="font-bold text-sm">{en ? 'Security' : 'امنیت'}</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  {en ? 'Security settings' : 'تنظیمات امنیتی'}
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
                      {en ? 'Extra security for transactions' : 'امنیت بیشتر برای تراکنش‌ها'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                      if (twoFA) {
                        remove2FA('global');
                        setTwoFA(false);
                      } else {
                        const secret = generate2FASecret();
                        setTwoFASecret(secret);
                        setShow2FAModal(true);
                        setTwoFACode('');
                        setTwoFAError('');
                      }
                    }}
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

              {/* 🔒 Auto-Lock Timeout Selector */}
              <div className="p-3 rounded-xl bg-[var(--arv-blue)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⏱</span>
                  <div>
                    <div className="text-sm font-bold">قفل خودکار کیف پول</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">
                      {en ? 'Auto-lock after inactivity' : 'مدت زمان باز ماندن کیف پول'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { value: 1, label: en ? '1 min' : '۱ دقیقه' },
                    { value: 5, label: en ? '5 min' : '۵ دقیقه' },
                    { value: 15, label: en ? '15 min' : '۱۵ دقیقه' },
                    { value: 30, label: en ? '30 min' : '۳۰ دقیقه' },
                    { value: 0, label: en ? 'Never' : 'هرگز' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setAutoLockTimeout(opt.value);
                        localStorage.setItem('arv_auto_lock_timeout_minutes', String(opt.value));
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        autoLockTimeout === opt.value
                          ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)]'
                          : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)] hover:bg-[var(--arv-blue)]/60'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-[var(--arv-text-muted)] mt-2">
                  {en 
                    ? 'Wallet will auto-lock after this period of inactivity'
                    : 'کیف پول بعد از این مدت بی‌فعالیتی قفل می‌شود'}
                </div>
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
                  {en ? 'Export & Import Wallet' : 'Export و Import کیف پول'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <GradientButton variant="gold" size="sm" fullWidth icon={<Download size={14} />} onClick={handleExportKeystore}>
                Export Keystore
              </GradientButton>
              <GradientButton variant="outline" size="sm" fullWidth icon={<Upload size={14} />} onClick={handleImportKeystore}>
                Import Keystore
              </GradientButton>
            </div>

            <div className="mt-3">
              <GradientButton variant="outline" size="sm" fullWidth icon={<FileText size={14} />} onClick={handleExportSeed}>
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
                <div className="font-bold text-sm">{en ? 'About' : 'درباره'}</div>
                <div className="text-xs text-[var(--arv-text-muted)]">
                  {en ? 'Version information' : 'اطلاعات نسخه'}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">{en ? 'Version' : 'نسخه'}</span>
                <span className="font-bold">۱.۰.۰</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">{en ? 'Network' : 'شبکه'}</span>
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
                {en ? 'Check for updates' : 'بررسی بروزرسانی'}
              </GradientButton>
              <GradientButton variant="outline" size="sm" fullWidth href="/install-guide.html" icon={<Download size={14} />}>{en ? 'Installation Guide' : 'راهنمای نصب'}</GradientButton>
              <GradientButton variant="outline" size="sm" fullWidth href="/about" icon={<ExternalLink size={14} />}>
                {en ? 'About Project' : 'درباره پروژه'}
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
                {en ? 'Clear all data' : 'پاک کردن تمام داده‌ها'}
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
                    {en ? 'Yes, clear' : 'بله، پاک کن'}
                  </button>
                </div>
              </div>
            )}
          </GlowCard>

          {/* Footer */}
          <div className="text-center py-4 text-xs text-[var(--arv-text-muted)]">
            ARV Super DApp • {en ? 'v1.0.0' : 'نسخه ۱.۰.۰'} • {new Date().getFullYear()}
          </div>

        </div>
      </main>
    
      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <GlowCard glowColor="gold" className="w-full max-w-sm">
            <div className="text-center space-y-4">
              <h3 className="font-bold text-lg">{en ? 'Setup 2FA' : 'راه‌اندازی 2FA'}</h3>
              
              {/* 📱 راهنمای اپلیکیشن */}
              <div className="p-3 bg-[var(--arv-blue)]/30 rounded-xl border border-[var(--arv-gold)]/20 text-right space-y-2">
                <div className="text-xs font-bold text-[var(--arv-gold)]">
                  {en ? '1. Install an Authenticator App' : '۱. یک اپلیکیشن احراز هویت نصب کنید'}
                </div>
                <div className="text-[11px] text-[var(--arv-text-muted)] leading-5">
                  {en ? 'Download one of these apps from your app store:' : 'یکی از این اپلیکیشن‌ها را از استور گوشی خود دانلود کنید:'}
                  <br />
                  • Google Authenticator
                  <br />
                  • Microsoft Authenticator
                  <br />
                  • Authy
                </div>
                <div className="text-xs font-bold text-[var(--arv-gold)] pt-2">
                  {en ? '2. Scan or Enter Key' : '۲. اسکن کنید یا کلید را وارد کنید'}
                </div>
                <div className="text-[11px] text-[var(--arv-text-muted)] leading-5">
                  {en ? 'Scan the QR code below, OR copy the key and paste it into the app.' : 'بارکد زیر را اسکن کنید، یا کلید را کپی کرده و در اپ پیست کنید.'}
                </div>
                <div className="text-xs font-bold text-[var(--arv-gold)] pt-2">
                  {en ? '3. Enter 6-digit Code' : '۳. کد ۶ رقمی را وارد کنید'}
                </div>
                <div className="text-[11px] text-[var(--arv-text-muted)] leading-5">
                  {en ? 'Enter the 6-digit code generated in the app below.' : 'کد ۶ رقمی تولید شده در اپلیکیشن را در کادر زیر وارد کنید.'}
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-xl inline-block mx-auto">
                <QRCodeSVG value={get2FAUri(twoFASecret)} size={180} />
              </div>
              
              <div className="text-left space-y-2">
                <label className="text-xs text-[var(--arv-text-muted)]">
                  {en ? 'Or enter secret manually:' : 'یا کلید را دستی وارد کنید:'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2 bg-[var(--arv-blue)]/40 rounded-lg text-xs font-mono break-all text-center text-[var(--arv-gold)]">
                    {twoFASecret}
                  </div>
                  <button
                    onClick={async () => {
                      const ok = await copyToClipboard(twoFASecret);
                      if (ok) {
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }
                    }}
                    className="p-2 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/30 transition-all flex-shrink-0"
                    title={en ? "Copy Key" : "کپی کلید"}
                  >
                    {copiedKey ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={en ? "6-digit code" : "کد ۶ رقمی"}
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  className="w-full text-center tracking-widest arv-input"
                  maxLength={6}
                  dir="ltr"
                />
                {twoFAError && <p className="text-xs text-[var(--arv-danger)]">{twoFAError}</p>}
              </div>

              <div className="flex gap-2">
                <GradientButton variant="gold" fullWidth onClick={async () => {
                  if (await verify2FACode(twoFASecret, twoFACode)) {
                    save2FASecret('global', twoFASecret);
                    setTwoFA(true);
                    setShow2FAModal(false);
                  } else {
                    setTwoFAError(en ? 'Invalid code' : 'کد وارد شده نامعتبر است');
                  }
                }}>
                  {en ? 'Verify & Enable' : 'تایید و فعال‌سازی'}
                </GradientButton>
                <button onClick={() => {
                  setShow2FAModal(false);
                  setTwoFASecret(''); // پاک کردن کلید در صورت لغو
                  setTwoFACode('');
                  setTwoFAError('');
                }} className="px-4 rounded-xl border border-[var(--arv-gold)]/30 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/10 transition-all text-sm">
                  {en ? 'Cancel' : 'لغو'}
                </button>
              </div>
            </div>
          
            {/* 🔗 مدیریت نشست‌ها (Session Management) */}
            <GlowCard glowColor="blue">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <Laptop size={20} className="text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-sm">{en ? 'Session Management' : 'مدیریت نشست‌ها'}</div>
                  <div className="text-xs text-[var(--arv-text-muted)]">
                    {en ? 'Manage connected wallets and sessions' : 'مدیریت کیف پول‌ها و نشست‌های متصل'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--arv-blue)]/20 space-y-3">
                {isConnected ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-[var(--arv-success)] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></span>
                        {en ? 'Connected' : 'متصل'}
                      </div>
                      <div className="text-xs text-[var(--arv-text-muted)]">
                        {connector?.name || (en ? 'External Wallet' : 'کیف پول خارجی')}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/20 font-mono text-xs break-all text-center" dir="ltr">
                      {address}
                    </div>
                    <button
                      onClick={() => disconnect()}
                      className="w-full mt-2 py-2 rounded-lg bg-[var(--arv-danger)]/10 text-[var(--arv-danger)] border border-[var(--arv-danger)]/30 hover:bg-[var(--arv-danger)]/20 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                    >
                      <LogOut size={16} />
                      {en ? 'Disconnect Wallet' : 'قطع اتصال کیف پول'}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[var(--arv-text-muted)]">
                    <ShieldAlert size={16} />
                    {en ? 'No external wallet connected.' : 'هیچ کیف پول خارجی متصل نیست.'}
                  </div>
                )}
              </div>
              
              <div className="mt-3 text-[10px] text-[var(--arv-text-muted)] flex items-start gap-1">
                <span>ℹ️</span>
                {en 
                  ? 'Internal wallets are automatically locked after a period of inactivity based on your Auto-Lock setting.' 
                  : 'کیف پول‌های داخلی بر اساس تنظیمات «قفل خودکار»، پس از مدت زمان مشخصی قفل می‌شوند.'}
              </div>
            </GlowCard>

          </GlowCard>
        </div>
      )}
    </div>
  );
}
