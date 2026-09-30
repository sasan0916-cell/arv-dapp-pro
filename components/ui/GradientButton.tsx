'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'gold' | 'blue' | 'green' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function GradientButton({
  children,
  onClick,
  href,
  variant = 'gold',
  size = 'md',
  className = '',
  disabled = false,
  icon,
  fullWidth = false,
}: GradientButtonProps) {
  const variantMap = {
    gold: {
      background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
      color: '#0a1929',
      border: 'none',
      shadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
    },
    blue: {
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a7a 100%)',
      color: '#ffffff',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      shadow: '0 8px 24px rgba(30, 58, 95, 0.4)',
    },
    green: {
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      color: '#ffffff',
      border: 'none',
      shadow: '0 8px 24px rgba(72, 187, 120, 0.3)',
    },
    outline: {
      background: 'transparent',
      color: '#d4af37',
      border: '1px solid rgba(212, 175, 55, 0.4)',
      shadow: 'none',
    },
  };

  const sizeMap = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const styles = variantMap[variant];
  const sizeClass = sizeMap[size];
  const widthClass = fullWidth ? 'w-full' : '';

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </>
  );

  const button = (
    <motion.button
      whileHover={!disabled ? { y: -2, scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${sizeClass} ${widthClass} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        background: styles.background,
        color: styles.color,
        border: styles.border,
        boxShadow: styles.shadow,
        fontFamily: 'inherit',
      }}
    >
      {content}
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {button}
      </a>
    );
  }

  return button;
}
