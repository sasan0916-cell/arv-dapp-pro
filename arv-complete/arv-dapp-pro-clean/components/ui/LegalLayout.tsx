'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Shield, AlertTriangle } from 'lucide-react';
import { GlowCard } from './GlowCard';

interface LegalLayoutProps {
  title: string;
  icon: 'terms' | 'privacy' | 'disclaimer';
  lastUpdated: string;
  children: React.ReactNode;
}

const ICONS = {
  terms: <FileText size={28} className="text-[var(--arv-gold)]" />,
  privacy: <Shield size={28} className="text-[var(--arv-success)]" />,
  disclaimer: <AlertTriangle size={28} className="text-[var(--arv-warning)]" />,
};

export function LegalLayout({ title, icon, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-lg bg-[var(--arv-blue)]/40 hover:bg-[var(--arv-blue)]/60 text-[var(--arv-gold)] transition-all"
        >
          <ArrowRight size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold gold-gradient">{title}</h1>
          <p className="text-xs text-[var(--arv-text-muted)] mt-1">
            آخرین بروزرسانی: {lastUpdated}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[var(--arv-blue)]/40 flex items-center justify-center">
          {ICONS[icon]}
        </div>
      </div>

      {/* Content */}
      <GlowCard glowColor="gold">
        <article className="prose prose-invert prose-sm max-w-none space-y-4 text-sm leading-7 text-[var(--arv-text)]">
          {children}
        </article>
      </GlowCard>

      
    </div>
  );
}
