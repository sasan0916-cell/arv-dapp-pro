'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { ConnectButton } from './ConnectButton';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--arv-blue-dark)]/95 backdrop-blur border-b border-[var(--arv-blue)]">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          className="lg:hidden p-2 text-[var(--arv-gold)]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link href="/" className="lg:hidden flex items-center gap-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden shadow-lg shadow-[var(--arv-gold)]/30">
            <Image
              src="/arv-logo.png"
              alt="ARV Logo"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="hidden lg:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--arv-text-muted)]"
            />
            <input
              type="text"
              placeholder="جستجو در DApp..."
              className="arv-input pr-10"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/30">
          <span className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></span>
          <span className="text-xs">BNB Testnet</span>
        </div>

        <Link href="/" className="hidden lg:flex items-center gap-2">
          <div className="w-9 h-9 relative rounded-full overflow-hidden">
            <Image
              src="/arv-logo.png"
              alt="ARV Logo"
              fill
              sizes="36px"
              className="object-contain"
              priority
            />
          </div>
          <div className="text-sm font-bold">ARV</div>
        </Link>

        <ConnectButton />
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-[var(--arv-blue)] bg-[var(--arv-blue-dark)]">
          <nav className="flex flex-col p-4 space-y-2">
            <Link href="/" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">داشبورد</Link>
            <Link href="/market" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">تحلیل بازار</Link>
            <Link href="/mainnet" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">وضعیت Mainnet</Link>
            <Link href="/send" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">ارسال</Link>
            <Link href="/receive" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">دریافت</Link>
            <Link href="/swap" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">سواپ</Link>
            <Link href="/history" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">تاریخچه</Link>
            <Link href="/wallets" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">کیف پول‌ها</Link>
            <Link href="/admin" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]">مدیریت</Link>
            <Link href="/settings" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">تنظیمات</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
