'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X, Search } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--arv-blue-dark)]/95 backdrop-blur border-b border-[var(--arv-blue)]">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-[var(--arv-gold)]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo (Mobile) */}
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--arv-gold)] to-[var(--arv-gold-light)] flex items-center justify-center font-bold text-[var(--arv-blue-dark)] text-xs">
            ARV
          </div>
        </Link>

        {/* Search (Desktop) */}
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

        {/* Network Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/30">
          <span className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></span>
          <span className="text-xs">BNB Testnet</span>
        </div>

        {/* Connect Wallet */}
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
        />
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[var(--arv-blue)] bg-[var(--arv-blue-dark)]">
          <nav className="flex flex-col p-4 space-y-2">
            <Link href="/" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">
              داشبورد
            </Link>
            <Link href="/send" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">
              ارسال
            </Link>
            <Link href="/receive" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">
              دریافت
            </Link>
            <Link href="/swap" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">
              سواپ
            </Link>
            <Link href="/history" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">
              تاریخچه
            </Link>
            <Link href="/wallets" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">
              کیف پول‌ها
            </Link>
            <Link href="/admin" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]">
              داشبورد مدیریتی
            </Link>
            <Link href="/settings" className="px-4 py-3 rounded-xl hover:bg-[var(--arv-blue)]/40">
              تنظیمات
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
