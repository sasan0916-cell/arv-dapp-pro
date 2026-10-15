'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'chart';
}

export default function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  const baseClass = 'relative overflow-hidden bg-gradient-to-r from-[rgba(20,42,74,0.4)] via-[rgba(30,64,175,0.2)] to-[rgba(20,42,74,0.4)] animate-pulse';
  const variants = {
    text: 'h-4 rounded-md',
    card: 'h-32 rounded-2xl',
    circle: 'rounded-full',
    chart: 'h-64 rounded-2xl',
  };
  return (
    <div className={`${baseClass} ${variants[variant]} ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.08)] to-transparent" />
    </div>
  );
}
