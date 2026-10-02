'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { X, LayoutDashboard, BarChart3, Globe, Send, Download, ArrowLeftRight, History, Wallet, Shield, Coins, Gift, Users, Info, Settings, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/lib/hooks/useUserRole';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNav = [
  { href: '/', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/market', label: 'تحلیل بازار', icon: BarChart3 },
  { href: '/mainnet', label: 'وضعیت Mainnet', icon: Globe },
  { href: '/send', label: 'ارسال ARV', icon: Send },
  { href: '/receive', label: 'دریافت', icon: Download },
  { href: '/swap', label: 'سواپ ارزها', icon: ArrowLeftRight },
  { href: '/liquidity', label: 'نقدینگی', icon: Droplets },
  { href: '/history', label: 'تاریخچه', icon: History },
  { href: '/wallets', label: 'کیف پول‌ها', icon: Wallet },
];

const adminNav = [
  { href: '/admin', label: 'داشبورد مدیریتی', icon: Shield },
  { href: '/admin/main-wallet', label: 'کیف اصلی (۶۰٪)', icon: Coins },
  { href: '/admin/reward-wallet', label: 'کیف پاداش (۴۰٪)', icon: Gift },
  { href: '/admin/users', label: 'کاربران', icon: Users },
];

const infoNav = [
  { href: '/tokenomics', label: 'توکنومیک', icon: Coins },
  { href: '/about', label: 'درباره پروژه', icon: Info },
  { href: '/settings', label: 'تنظیمات', icon: Settings },
];

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { isAdmin } = useUserRole();

  useEffect(() => {
    onClose();
  }, [pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const renderNav = (items: typeof mainNav) =>
    items.map((item) => {
      const Icon = item.icon;
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
          <Icon size={20} />
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-72 bg-[var(--arv-blue-dark)] z-[101] lg:hidden transition-transform duration-300 overflow-y-auto',
          'border-l border-[var(--arv-gold)]/20',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--arv-blue)]">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-10 h-10 relative rounded-full overflow-hidden">
              <Image src="/arv-logo.png" alt="ARV Logo" fill sizes="40px" className="object-contain" />
            </div>
            <div>
              <div className="font-bold text-sm">Arvand Khabar</div>
              <div className="text-xs text-[var(--arv-text-muted)]">Token DApp</div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <div className="text-xs text-[var(--arv-text-muted)] px-4 mb-2 font-bold">عملیات اصلی</div>
            <nav className="space-y-1">{renderNav(mainNav)}</nav>
          </div>

          {isAdmin && (
            <div>
              <div className="text-xs text-[var(--arv-gold)] px-4 mb-2 font-bold flex items-center gap-1">
                <Shield size={12} />
                مدیریت
              </div>
              <nav className="space-y-1">{renderNav(adminNav)}</nav>
            </div>
          )}

          <div>
            <div className="text-xs text-[var(--arv-text-muted)] px-4 mb-2 font-bold">اطلاعات</div>
            <nav className="space-y-1">{renderNav(infoNav)}</nav>
          </div>
        </div>

        <div className="p-4 border-t border-[var(--arv-blue)] text-xs text-[var(--arv-text-muted)]">
          <div>نسخه ۱.۰.۰</div>
          <div className="mt-1">BNB Chain Testnet</div>
        </div>
      </aside>
    </>
  );
}
