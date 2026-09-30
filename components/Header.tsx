'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search } from 'lucide-react';
import { ConnectButton } from './ConnectButton';
import { AdminButton } from './admin/AdminButton';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[var(--arv-blue-dark)]/95 backdrop-blur border-b border-[var(--arv-blue)]">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-[var(--arv-gold)]"
          onClick={onMenuClick}
          aria-label="باز کردن منو"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Logo */}
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

        {/* Desktop Search */}
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

        {/* Desktop Logo */}
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

        <AdminButton />
        <ConnectButton />
      </div>
    </header>
  );
}
