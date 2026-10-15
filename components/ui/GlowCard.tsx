'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'gold' | 'blue' | 'green' | 'purple';
  delay?: number;
  hover?: boolean;
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'gold',
  delay = 0,
  hover = true,
}: GlowCardProps) {
  const colorMap = {
    gold: {
      border: 'rgba(212, 175, 55, 0.3)',
      shadow: 'rgba(212, 175, 55, 0.15)',
    },
    blue: {
      border: 'rgba(45, 74, 122, 0.5)',
      shadow: 'rgba(45, 74, 122, 0.2)',
    },
    green: {
      border: 'rgba(72, 187, 120, 0.3)',
      shadow: 'rgba(72, 187, 120, 0.15)',
    },
    purple: {
      border: 'rgba(159, 122, 234, 0.3)',
      shadow: 'rgba(159, 122, 234, 0.15)',
    },
  };

  const colors = colorMap[glowColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={`relative rounded-2xl p-5 overflow-hidden ${className}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(30, 58, 95, 0.7) 0%, rgba(10, 25, 41, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colors.border}`,
        boxShadow: `0 8px 32px ${colors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${colors.border} 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
      {children}
    </motion.div>
  );
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className = '', delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: 'rgba(30, 58, 95, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {children}
    </motion.div>
  );
}
