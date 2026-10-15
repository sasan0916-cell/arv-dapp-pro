'use client';

import { useState } from 'react';

interface TokenLogoProps {
  symbol: string;
  size?: number;
  className?: string;
}

const COLORS: Record<string, string> = {
  ARV: '#d4af37', BNB: '#f0b90b', WBNB: '#f0b90b', BTCB: '#f7931a', ETH: '#627eea',
  XRP: '#23292f', USDT: '#26a17b', USDC: '#2775ca', BUSD: '#f0b90b', DAI: '#f5ac37',
  ADA: '#0033ad', DOGE: '#c2a633', DOT: '#e6007a', SHIB: '#ffa409', TRX: '#eb0029',
  CAKE: '#1fc7d4', LINK: '#2a5ada', UNI: '#ff007a',
};

export default function TokenLogo({ symbol, size = 32, className = '' }: TokenLogoProps) {
  const [failed, setFailed] = useState(false);
  const upper = (symbol || '').toUpperCase();
  const src = upper === 'ARV' ? '/arv-logo.png' : `/tokens/${upper}.png`;
  const bgColor = COLORS[upper] || '#d4af37';

  if (!failed && upper) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={upper}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={'rounded-full object-cover ' + className}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, backgroundColor: bgColor + '30', color: bgColor, fontSize: size * 0.3 }}
      className={'rounded-full flex items-center justify-center font-bold ' + className}
    >
      {upper.slice(0, 3)}
    </div>
  );
}
