'use client';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { isInWatchlist, toggleWatchlist } from '@/lib/services/watchlist-service';

interface StarButtonProps {
  symbol: string;
  size?: number;
  className?: string;
  onChange?: (symbol: string, isFavorite: boolean) => void;
}

export function StarButton({ symbol, size = 16, className = '', onChange }: StarButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    isInWatchlist(symbol).then(setIsFav);
  }, [symbol]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next = await toggleWatchlist(symbol);
    const nowFav = next.includes(symbol.toUpperCase());
    setIsFav(nowFav);
    if (onChange) onChange(symbol, nowFav);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleClick}
      className={`p-1 rounded-lg transition-all hover:bg-[var(--arv-gold)]/10 ${className}`}
      aria-label={isFav ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Star
        size={size}
        className={isFav ? 'text-[var(--arv-gold)]' : 'text-[var(--arv-text-muted)]'}
        fill={isFav ? 'currentColor' : 'none'}
      />
    </button>
  );
}
