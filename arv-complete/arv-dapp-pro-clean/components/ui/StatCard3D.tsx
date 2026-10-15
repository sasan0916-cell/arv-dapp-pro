'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { GlowCard } from './GlowCard';

interface StatCard3DProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  color?: 'gold' | 'blue' | 'green' | 'purple';
  delay?: number;
  href?: string;
}

export function StatCard3D({
  icon,
  label,
  value,
  change,
  changeLabel,
  color = 'gold',
  delay = 0,
  href,
}: StatCard3DProps) {
  const colorMap = {
    gold: { icon: 'text-[var(--arv-gold)]', bg: 'bg-[var(--arv-gold)]/10' },
    blue: { icon: 'text-blue-400', bg: 'bg-blue-400/10' },
    green: { icon: 'text-[var(--arv-success)]', bg: 'bg-[var(--arv-success)]/10' },
    purple: { icon: 'text-purple-400', bg: 'bg-purple-400/10' },
  };

  const isPositive = (change ?? 0) >= 0;

  const card = (
    <GlowCard glowColor={color} delay={delay} className="h-full">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color].bg} ${colorMap[color].icon}`}
        >
          {icon}
        </div>
        {change !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3 }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
              isPositive
                ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                : 'bg-[var(--arv-danger)]/15 text-[var(--arv-danger)]'
            }`}
          >
            <span>{isPositive ? '▲' : '▼'}</span>
            <span>{Math.abs(change).toFixed(2)}%</span>
          </motion.div>
        )}
      </div>

      <div className="text-xs text-[var(--arv-text-muted)] mb-2">{label}</div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2 }}
        className="text-2xl md:text-3xl font-bold mb-1"
      >
        {value}
      </motion.div>

      {changeLabel && (
        <div className="text-xs text-[var(--arv-text-muted)]">{changeLabel}</div>
      )}
    </GlowCard>
  );

  if (href) {
    return <a href={href}>{card}</a>;
  }

  return card;
}
