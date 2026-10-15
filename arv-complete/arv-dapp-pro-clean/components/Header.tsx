'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, Search, TrendingUp, TrendingDown, Languages, Gift } from 'lucide-react';
import { ConnectButton } from './ConnectButton';
import { useLanguage } from '@/lib/i18n';
import { fetchLivePrices, formatPrice, type PriceData } from '@/lib/services/price-service';

interface HeaderProps {
  onMenuClick?: () => void;
}

const TICKER_SYMBOLS = ['ARV', 'BNB', 'BTC', 'ETH', 'SOL', 'XRP'];

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = (lang: 'fa' | 'en') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/20 hover:border-[var(--arv-gold)]/50 transition-all"
        aria-label="تغییر زبان"
      >
        <Languages size={16} className="text-[var(--arv-gold)]" />
        <span className="text-xs font-bold text-[var(--arv-gold)]">
          {language === 'fa' ? 'FA' : 'EN'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute left-0 top-full mt-2 z-50 rounded-xl overflow-hidden min-w-[120px]"
            style={{
              background: 'linear-gradient(180deg, rgba(20, 40, 70, 0.98) 0%, rgba(5, 12, 25, 0.99) 100%)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 24px rgba(212, 175, 55, 0.15)',
            }}
          >
            <button
              onClick={() => toggleLanguage('fa')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold transition-all ${
                language === 'fa'
                  ? 'bg-[var(--arv-gold)]/20 text-[var(--arv-gold)]'
                  : 'text-[var(--arv-text-secondary)] hover:bg-[var(--arv-blue)]/40'
              }`}
            >
              <span>🇮🇷</span>
              <span>فارسی</span>
              {language === 'fa' && <span className="mr-auto text-[var(--arv-gold)]">✓</span>}
            </button>
            <button
              onClick={() => toggleLanguage('en')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-[var(--arv-gold)]/20 text-[var(--arv-gold)]'
                  : 'text-[var(--arv-text-secondary)] hover:bg-[var(--arv-blue)]/40'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
              {language === 'en' && <span className="mr-auto text-[var(--arv-gold)]">✓</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Header({ onMenuClick }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [tickerOffset, setTickerOffset] = useState(0);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTickerOffset((prev) => (prev + 0.5) % 100);
    }, 50);

    // بارگذاری قیمت‌ها
    const loadPrices = async () => {
      const data = await fetchLivePrices();
      setPrices(data);
    };
    loadPrices();

    // هر ۶۰ ثانیه آپدیت کن
    const priceInterval = setInterval(loadPrices, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(priceInterval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className="relative"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 25, 41, 0.95) 0%, rgba(5, 12, 25, 0.98) 100%)',
                              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(212, 175, 55, 0.1)',
        }}
      >
        <div className="flex items-center justify-between px-3 md:px-4 py-3 max-w-7xl mx-auto gap-2">

          <button
            className="lg:hidden p-2 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/10 rounded-lg transition-all"
            onClick={onMenuClick}
            aria-label="باز کردن منو"
          >
            <Menu size={24} />
          </button>

          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                  transform: 'scale(1.4)',
                }}
              />
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--arv-gold)]/40 shadow-lg shadow-[var(--arv-gold)]/30">
                <Image
                  src="/arv-logo.png"
                  alt="ARV Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--arv-text-muted)] group-focus-within:text-[var(--arv-gold)] transition-colors"
              />
              <input
                type="text"
                placeholder="جستجو در DApp..."
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/20 focus:border-[var(--arv-gold)] outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/30">
            <span className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></span>
            <span className="text-xs font-bold">BNB Testnet</span>
          </div>

          <Link href="/" className="hidden lg:flex items-center gap-2 mx-4">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                  transform: 'scale(1.3)',
                }}
              />
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--arv-gold)]/40">
                <Image
                  src="/arv-logo.png"
                  alt="ARV Logo"
                  fill
                  sizes="36px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="text-sm font-bold gold-gradient">ARV</div>
          </Link>

          <div className="flex items-center gap-2">
            <a
              href="https://arvandkhabar.ir/?page_id=1649"
              target="_blank"
              rel="noopener noreferrer"
              title="کسب پاداش ARV"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--arv-gold)]/10 border border-[var(--arv-gold)]/40 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/20 hover:border-[var(--arv-gold)]/60 transition-all"
            >
              <Gift size={18} />
            </a>
            <LanguageToggle />
            <ConnectButton />
          </div>
        </div>

        <div className="relative overflow-hidden border-t border-[var(--arv-gold)]/10 bg-[var(--arv-blue)]/30">
          <div
            className="flex gap-6 py-1.5 whitespace-nowrap"
            style={{
              transform: `translateX(${-tickerOffset * 10}px)`,
              transition: 'transform 0.05s linear',
            }}
          >
            {[...TICKER_SYMBOLS, ...TICKER_SYMBOLS, ...TICKER_SYMBOLS].map((symbol, i) => {
                const token = prices[symbol];
                const price = token?.price ?? 0;
                const change = token?.change24h ?? 0;
                return (
                  <div key={i} className="flex items-center gap-2 text-[10px] px-2">
                    <span className="font-bold text-[var(--arv-text-secondary)]">{symbol}</span>
                    <span className="text-[var(--arv-text-muted)]" dir="ltr">
                      ${price > 0 ? formatPrice(price) : '—'}
                    </span>
                    {token && (
                      <>
                        <span className={change >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                        </span>
                        {change >= 0 ? (
                          <TrendingUp size={10} className="text-green-400" />
                        ) : (
                          <TrendingDown size={10} className="text-red-400" />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </header>
  );
}
