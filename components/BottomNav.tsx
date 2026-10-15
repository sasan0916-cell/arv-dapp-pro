'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Wallet, ArrowLeftRight, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'خانه', icon: Home },
  { href: '/market', label: 'بازار', icon: BarChart3 },
  { href: '/wallets', label: 'کیف پول', icon: Wallet },
  { href: '/swap', label: 'سواپ', icon: ArrowLeftRight },
  { href: '/settings', label: 'تنظیمات', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-4 left-3 right-3 z-40 rounded-2xl overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, rgba(30, 58, 95, 0.98) 0%, rgba(10, 25, 41, 1) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(212, 175, 55, 0.2)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 flex-1 transition-all"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)'
                    : 'transparent',
                  boxShadow: isActive
                    ? '0 4px 12px rgba(212, 175, 55, 0.4)'
                    : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={{
                    color: isActive ? '#0a1929' : '#94a3b8',
                  }}
                />
              </div>
              <span
                className="text-[10px] font-bold transition-all"
                style={{
                  color: isActive ? '#d4af37' : '#94a3b8',
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
