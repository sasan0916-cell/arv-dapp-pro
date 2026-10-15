'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Wallet, RotateCcw, Shield, ChevronLeft, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1e3a5f 0%, #0a1929 50%, #050912 100%)',
      }}
    >
      {/* Background Light Rays */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 60%)',
            filter: 'blur(80px)',
            animation: 'pulse-glow 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              background: '#d4af37',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.4 + 0.2,
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
              animation: `float-particle ${Math.random() * 6 + 6}s linear infinite`,
              animationDelay: Math.random() * 4 + 's',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center">

        {/* Logo */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.5) 0%, transparent 70%)',
              filter: 'blur(25px)',
              transform: 'scale(1.5)',
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}
          />
          <Image
            src="/arv-logo.png"
            alt="ARV Logo"
            fill
            sizes="160px"
            className="object-contain relative z-10"
            priority
          />
        </div>

        {/* Welcome Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="gold-gradient">به ARV DApp خوش آمدید</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--arv-text-muted)] mb-2">
          کیف پول غیرمتمرکز و امن برای توکن ARV
        </p>
        <p className="text-xs text-[var(--arv-gold)] mb-8 flex items-center gap-1 justify-center">
          <Lock size={12} /> غیرامانی و امن
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-3 mb-6">

          {/* Create New Wallet */}
          <Link href="/wallets/create" className="block group">
            <div
              className="relative p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.15)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--arv-gold)] to-yellow-600 flex items-center justify-center shadow-lg shadow-[var(--arv-gold)]/30">
                  <Wallet size={22} className="text-[#050912]" />
                </div>
                <div className="flex-1 text-right">
                  <div className="font-bold text-sm">ساخت کیف پول جدید</div>
                  <div className="text-[10px] text-[var(--arv-text-muted)] mt-0.5">
                    ۱۲ کلمه بازیابی
                  </div>
                </div>
                <ArrowRight size={18} className="text-[var(--arv-gold)] group-hover:translate-x-[-4px] transition-transform" />
              </div>
            </div>
          </Link>

          {/* Restore Wallet */}
          <Link href="/wallets/restore" className="block group">
            <div
              className="relative p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <RotateCcw size={22} className="text-white" />
                </div>
                <div className="flex-1 text-right">
                  <div className="font-bold text-sm">بازیابی کیف پول</div>
                  <div className="text-[10px] text-[var(--arv-text-muted)] mt-0.5">
                    ۱۲ کلمه یا کلید خصوصی
                  </div>
                </div>
                <ArrowRight size={18} className="text-blue-400 group-hover:translate-x-[-4px] transition-transform" />
              </div>
            </div>
          </Link>

          {/* Connect External Wallet */}
          <Link href="/wallets" className="block group">
            <div
              className="relative p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                boxShadow: '0 4px 20px rgba(168, 85, 247, 0.15)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Sparkles size={22} className="text-white" />
                </div>
                <div className="flex-1 text-right">
                  <div className="font-bold text-sm">اتصال کیف خارجی</div>
                  <div className="text-[10px] text-[var(--arv-text-muted)] mt-0.5">
                    MetaMask، Trust Wallet و...
                  </div>
                </div>
                <ArrowRight size={18} className="text-purple-400 group-hover:translate-x-[-4px] transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Security Note */}
        <div
          className="p-3 rounded-xl w-full mb-4"
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
          }}
        >
          <div className="flex items-start gap-2">
            <Shield size={16} className="text-[var(--arv-success)] flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-[var(--arv-text-muted)] leading-relaxed text-right">
              کلید خصوصی شما فقط روی دستگاه شما ذخیره می‌شود و هرگز به سرور ارسال نمی‌گردد.
            </p>
          </div>
        </div>

        {/* Learn More */}
        <Link href="/about" className="text-xs text-[var(--arv-gold)] hover:underline flex items-center gap-1">
          بیشتر بدانید <ChevronLeft size={12} />
        </Link>

        {/* Network Badge */}
        <div className="absolute bottom-6 text-[10px] text-[var(--arv-text-muted)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--arv-success)] animate-pulse"></span>
          BNB Smart Chain Testnet
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes float-particle {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
