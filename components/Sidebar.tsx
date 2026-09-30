'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  Download,
  ArrowLeftRight,
  History,
  Wallet,
  Settings,
  Info,
  Coins,
  Shield,
  Users,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const mainNav: NavItem[] = [
  { href: '/', label: 'داشبورد', icon: <LayoutDashboard size={20} /> },
  { href: '/send', label: 'ارسال ARV', icon: <Send size={20} /> },
  { href: '/receive', label: 'دریافت', icon: <Download size={20} /> },
  { href: '/swap', label: 'سواپ ARV ↔ BNB', icon: <ArrowLeftRight size={20} /> },
  { href: '/history', label: 'تاریخچه', icon: <History size={20} /> },
  { href: '/wallets', label: 'کیف پول‌ها', icon: <Wallet size={20} /> },
];

const adminNav: NavItem[] = [
  { href: '/admin', label: 'داشبورد مدیریتی', icon: <Shield size={20} />, adminOnly: true },
  { href: '/admin/main-wallet', label: 'کیف اصلی (۶۰٪)', icon: <Coins size={20} />, adminOnly: true },
  { href: '/admin/reward-wallet', label: 'کیف پاداش (۴۰٪)', icon: <Gift size={20} />, adminOnly: true },
  { href: '/admin/users', label: 'کاربران', icon: <Users size={20} />, adminOnly: true },
];

const infoNav: NavItem[] = [
  { href: '/tokenomics', label: 'توکنومیک', icon: <Coins size={20} /> },
  { href: '/about', label: 'درباره پروژه', icon: <Info size={20} /> },
  { href: '/settings', label: 'تنظیمات', icon: <Settings size={20} /> },
];

export function Sidebar() {
  const pathname = usePathname();

  const renderNav = (items: NavItem[]) =>
    items.map((item) => {
      const active = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all',
            active
              ? 'bg-[var(--arv-gold)]/10 text-[var(--arv-gold)] border-r-2 border-[var(--arv-gold)]'
              : 'text-[var(--arv-text-muted)] hover:bg-[var(--arv-blue)]/40 hover:text-white'
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[var(--arv-blue-dark)] border-l border-[var(--arv-blue)] min-h-screen p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-4 py-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--arv-gold)] to-[var(--arv-gold-light)] flex items-center justify-center font-bold text-[var(--arv-blue-dark)]">
          ARV
        </div>
        <div>
          <div className="font-bold text-sm">Arvand Khabar</div>
          <div className="text-xs text-[var(--arv-text-muted)]">Token DApp</div>
        </div>
      </Link>

      {/* Main Nav */}
      <div className="mb-6">
        <div className="text-xs text-[var(--arv-text-muted)] px-4 mb-2 font-bold">
          عملیات اصلی
        </div>
        <nav className="space-y-1">{renderNav(mainNav)}</nav>
      </div>

      {/* Admin Nav */}
      <div className="mb-6">
        <div className="text-xs text-[var(--arv-text-muted)] px-4 mb-2 font-bold">
          مدیریت
        </div>
        <nav className="space-y-1">{renderNav(adminNav)}</nav>
      </div>

      {/* Info Nav */}
      <div className="mt-auto">
        <div className="text-xs text-[var(--arv-text-muted)] px-4 mb-2 font-bold">
          اطلاعات
        </div>
        <nav className="space-y-1">{renderNav(infoNav)}</nav>
      </div>

      {/* Footer */}
      <div className="mt-4 px-4 py-3 border-t border-[var(--arv-blue)] text-xs text-[var(--arv-text-muted)]">
        <div>نسخه ۱.۰.۰</div>
        <div className="mt-1">BNB Chain Testnet</div>
      </div>
    </aside>
  );
}
