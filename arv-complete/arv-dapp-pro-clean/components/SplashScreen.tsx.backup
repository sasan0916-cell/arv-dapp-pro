'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // پیشرفت انیمیشن
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    // بعد از ۲.۵ ثانیه برو به اپ
    const timer = setTimeout(() => {
      onFinish();
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center" style={{
      background: 'linear-gradient(135deg, #0a1929 0%, #1e3a5f 50%, #0a1929 100%)',
    }}>
      {/* سکه ARV چرخشی */}
      <div className="splash-coin relative w-40 h-40 mb-8">
        <Image
          src="/arv-logo.png"
          alt="ARV Logo"
          fill
          sizes="160px"
          className="object-contain"
          priority
        />
      </div>

      {/* متن */}
      <h1 className="splash-text text-3xl font-bold mb-3 gold-gradient">
        Arvand Khabar Token
      </h1>
      <p className="splash-subtext text-sm text-[var(--arv-text-muted)] mb-8">
        ARV • Web3 DApp
      </p>

      {/* نوار پیشرفت */}
      <div className="splash-progress w-64 max-w-[80%]">
        <div className="h-1 bg-[var(--arv-blue)]/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--arv-gold)] to-[var(--arv-gold-light)] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[var(--arv-text-muted)] text-center mt-3">
          در حال بارگذاری...
        </p>
      </div>

      {/* BNB Chain */}
      <div className="absolute bottom-8 text-xs text-[var(--arv-text-muted)]">
        BNB Smart Chain Testnet
      </div>
    </div>
  );
}
