'use client';

import Link from 'next/link';
import { Shield, LogOut } from 'lucide-react';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useEffect, useState } from 'react';
import { logoutAdmin } from '@/lib/admin-client';

export function AdminButton() {
  const { isAdmin } = useUserRole();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // جلوگیری از hydration mismatch
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-[var(--arv-blue)]/30 animate-pulse" />
    );
  }

  const handleLogout = async () => {
    await logoutAdmin();
    if (typeof window !== 'undefined') window.location.href = '/';
  };

  if (isAdmin) {
    return (
      <div className="flex items-center gap-1">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--arv-gold)]/15 text-[var(--arv-gold)] border border-[var(--arv-gold)]/40 hover:bg-[var(--arv-gold)]/25 transition-all text-xs font-bold"
          title="پنل مدیریت"
        >
          <Shield size={14} />
          <span className="hidden sm:inline">پنل مدیر</span>
        </Link>
        <button
          onClick={handleLogout}
          className="p-1.5 rounded-lg text-[var(--arv-danger)] hover:bg-[var(--arv-danger)]/15 transition-all"
          title="خروج از پنل مدیر"
        >
          <LogOut size={14} />
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/admin-login"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[var(--arv-text-muted)] hover:text-[var(--arv-gold)] hover:bg-[var(--arv-blue)]/40 border border-[var(--arv-blue)]/60 hover:border-[var(--arv-gold)]/40 transition-all text-xs"
      title="ورود مدیرکل"
    >
      <Shield size={14} />
      <span className="hidden sm:inline">ورود مدیر</span>
    </Link>
  );
}
