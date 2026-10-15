'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Send, Download, ArrowLeftRight, History, Wallet,
  Settings, Info, Coins, Shield, Users, Gift, BarChart3, Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/lib/hooks/useUserRole';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const mainNav: NavItem[] = [
  { href: '/', label: 'داشبورد', icon: <LayoutDashboard size={20} /> },
  { href: '/market', label: 'تحلیل بازار', icon: <BarChart3 size={20} /> },
  { href: '/mainnet', label: 'وضعیت Mainnet', icon: <Globe size={20} /> },
  { href: '/send', label: 'ارسال ARV', icon: <Send size={20} /> },
  { href: '/receive', label: 'دریافت', icon: <Download size={20} /> },
  { href: '/swap', label: 'سواپ ارزها', icon: <ArrowLeftRight size={20} /> },
  { href: '/history', label: 'تاریخچه', icon: <History size={20} /> },
  { href: '/wallets', label: 'کیف پول‌ها', icon: <Wallet size={20} /> },
];

const adminNav: NavItem[] = [
  { href: '/admin', label: 'داشبورد مدیریتی', icon: <Shield size={20} /> },
  { href: '/admin/main-wallet', label: 'کیف اصلی (۶۰٪)', icon: <Coins size={20} /> },
  { href: '/admin/reward-wallet', label: 'کیف پاداش (۴۰٪)', icon: <Gift size={20} /> },
  { href: '/admin/users', label: 'کاربران', icon: <Users size={20} /> },
];

const infoNav: NavItem[] = [
  { href: '/tokenomics', label: 'توکنومیک', icon: <Coins size={20} /> },
  { href: '/about', label: 'درباره پروژه', icon: <Info size={20} /> },
  { href: '/settings', label: 'تنظیمات', icon: <Settings size={20} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useUserRole();

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
      <Link href="/" className="flex items-center gap-3 px-4 py-4 mb-4">
        <div className="w-12 h-12 relative rounded-full overflow-hidden shadow-lg shadow-[var(--arv-gold)]/20">
          <Image
            src="/arv-logo.png"
            alt="ARV Logo"
            fill
            sizes="48px"
            className="object-contain"
            priority
          />
        </div>
        <div>
          <div className="font-bold text-sm">Arvand Khabar</div>
          <div className="text-xs text-[var(--arv-text-muted)]">Token DApp</div>
        </div>
      </Link>

      <div className="mb-6">
        <div className="text-xs text-[var(--arv-text-muted)] px-4 mb-2 font-bold">عملیات اصلی</div>
        <nav className="space-y-1">{renderNav(mainNav)}</nav>
      </div>

      {isAdmin && (
        <div className="mb-6">
          <div className="text-xs text-[var(--arv-gold)] px-4 mb-2 font-bold flex items-center gap-1">
            <Shield size={12} />
            مدیریت
          </div>
          <nav className="space-y-1">{renderNav(adminNav)}</nav>
        </div>
      )}

      <div className="mt-auto">
        <div className="text-xs text-[var(--arv-text-muted)] px-4 mb-2 font-bold">اطلاعات</div>
        <nav className="space-y-1">{renderNav(infoNav)}</nav>

        {!isAdmin && (
          <Link
            href="/admin-login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mt-2 text-[var(--arv-text-muted)] hover:bg-[var(--arv-blue)]/40 hover:text-[var(--arv-gold)] border border-dashed border-[var(--arv-blue)]/60"
          >
            <Shield size={16} />
            <span className="text-xs">ورود مدیرکل</span>
          </Link>
        )}
      </div>

      <div className="mt-4 px-4 py-3 border-t border-[var(--arv-blue)] text-xs text-[var(--arv-text-muted)]">
        <div>نسخه ۱.۰.۰</div>
        <div className="mt-1">BNB Chain Testnet</div>
      </div>
    </aside>
  );
}
