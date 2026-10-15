'use client';

import { GlowCard } from './GlowCard';

/**
 * Skeleton Loading برای صفحات
 * جلوگیری از پرش صفحه در حین لود
 */
export default function PageSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4 animate-pulse">
      {/* هدر */}
      <div className="space-y-2">
        <div className="h-8 bg-[var(--arv-blue)]/40 rounded-lg w-1/3"></div>
        <div className="h-4 bg-[var(--arv-blue)]/30 rounded-lg w-2/3"></div>
      </div>

      {/* کارت ۱ */}
      <GlowCard glowColor="gold">
        <div className="space-y-3">
          <div className="h-6 bg-[var(--arv-blue)]/40 rounded w-1/2"></div>
          <div className="h-12 bg-[var(--arv-blue)]/30 rounded"></div>
          <div className="h-12 bg-[var(--arv-blue)]/30 rounded"></div>
        </div>
      </GlowCard>

      {/* کارت ۲ */}
      <GlowCard glowColor="blue">
        <div className="space-y-3">
          <div className="h-6 bg-[var(--arv-blue)]/40 rounded w-1/3"></div>
          <div className="h-20 bg-[var(--arv-blue)]/30 rounded"></div>
        </div>
      </GlowCard>

      {/* کارت ۳ */}
      <GlowCard glowColor="gold">
        <div className="space-y-3">
          <div className="h-6 bg-[var(--arv-blue)]/40 rounded w-2/3"></div>
          <div className="h-16 bg-[var(--arv-blue)]/30 rounded"></div>
        </div>
      </GlowCard>
    </div>
  );
}
