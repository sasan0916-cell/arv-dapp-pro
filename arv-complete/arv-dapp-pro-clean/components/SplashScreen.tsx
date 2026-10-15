'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // سرعت نوار پیشرفت: کندتر (هر 60ms یک قدم)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 60);

    // شروع محو شدن در ثانیه 5.5
    const fadeTimer = setTimeout(() => setFadeOut(true), 5500);
    // پایان کامل در ثانیه 6
    const finishTimer = setTimeout(() => onFinish(), 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #1e3a5f 0%, #0a1929 50%, #050912 100%)',
        opacity: fadeOut ? 0 : 1,
      }}
    >
      {/* Light Rays Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, transparent 60%)',
            filter: 'blur(70px)',
            animation: 'pulse-glow 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Floating Gold Particles - بیشتر و چشمگیرتر */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1.5 + 'px',
              height: Math.random() * 4 + 1.5 + 'px',
              background: 'radial-gradient(circle, #f4d03f 0%, #d4af37 100%)',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              boxShadow: '0 0 12px rgba(212, 175, 55, 1), 0 0 4px rgba(244, 208, 63, 0.8)',
              animation: `float-particle ${Math.random() * 6 + 6}s linear infinite`,
              animationDelay: Math.random() * 4 + 's',
            }}
          />
        ))}
      </div>

      {/* Coin ARV */}
      <div className="relative w-52 h-52 mb-10 flex items-center justify-center">
        {/* Outer Glow Rings */}
        <div
          className="absolute inset-0 rounded-full border-2 border-[var(--arv-gold)]/30"
          style={{ animation: 'coin-ring 3.5s ease-out infinite' }}
        />
        <div
          className="absolute inset-0 rounded-full border border-[var(--arv-gold)]/20"
          style={{ animation: 'coin-ring 3.5s ease-out infinite', animationDelay: '1.2s' }}
        />
        <div
          className="absolute inset-0 rounded-full border border-[var(--arv-gold)]/10"
          style={{ animation: 'coin-ring 3.5s ease-out infinite', animationDelay: '2.4s' }}
        />

        {/* Rotating Coin */}
        <div
          className="relative w-44 h-44"
          style={{ animation: 'coin-float 3.5s ease-in-out infinite' }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.5) 0%, transparent 70%)',
              filter: 'blur(25px)',
              transform: 'scale(1.6)',
            }}
          />
          <Image
            src="/arv-logo.png"
            alt="ARV Logo"
            fill
            sizes="176px"
            className="object-contain relative z-10"
            priority
          />
        </div>
      </div>

      {/* Title */}
      <h1
        className="text-4xl font-bold mb-3 gold-gradient"
        style={{ animation: 'slide-up 1s ease-out 0.5s both' }}
      >
        Arvand Khabar Token
      </h1>
      <p
        className="text-base text-[var(--arv-text-muted)] mb-12"
        style={{ animation: 'slide-up 1s ease-out 0.8s both' }}
      >
        ARV • Web3 DApp
      </p>

      {/* Progress Bar */}
      <div
        className="w-72 max-w-[80%]"
        style={{ animation: 'slide-up 1s ease-out 1.1s both' }}
      >
        <div className="h-1.5 bg-[var(--arv-blue)]/40 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-100 relative"
            style={{
              width: progress + '%',
              background: 'linear-gradient(90deg, #b8941f 0%, #d4af37 50%, #f4d03f 100%)',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.8)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                animation: 'shimmer-bar 1.5s linear infinite',
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-[var(--arv-text-muted)]">در حال بارگذاری...</p>
          <p className="text-sm text-[var(--arv-gold)] font-bold">{Math.round(progress)}%</p>
        </div>
      </div>

      {/* Bottom Network */}
      <div
        className="absolute bottom-10 text-xs text-[var(--arv-text-muted)] flex items-center gap-2"
        style={{ animation: 'slide-up 1s ease-out 1.4s both' }}
      >
        <span className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></span>
        BNB Smart Chain Testnet
      </div>

      <style jsx>{`
        @keyframes coin-float {
          0%, 100% { transform: translateY(0) scale(1) rotateY(0deg); }
          50% { transform: translateY(-15px) scale(1.08) rotateY(180deg); }
        }
        @keyframes coin-ring {
          0% { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes float-particle {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(30px); opacity: 0; }
        }
        @keyframes slide-up {
          from { transform: translateY(25px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
