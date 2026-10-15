'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { formatUnits } from 'viem';
import {
  Wallet, Coins, Gift, ExternalLink, FileText,
  ChevronLeft, Shield, BookOpen, RefreshCw,
  TrendingUp, TrendingDown, DollarSign,
  ArrowLeftRight, Droplets, BarChart3
} from 'lucide-react';
import { ARV_CONFIG } from '@/lib/arv-config';
import { getARVBalance, getTokenInfo } from '@/lib/services/token-service';
import { formatNumber, shortAddress } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import TokenLogo from '@/components/ui/TokenLogo';
import { fetchLivePrices, type PriceData } from '@/lib/services/price-service';

// داده‌های قیمت لحظه‌ای
const TICKER_SYMBOLS = [
  { symbol: 'ARV', name: 'Arvand Khabar' },
  { symbol: 'BNB', name: 'Binance Coin' },
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
];

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { language } = useLanguage();
  const [arvBalance, setArvBalance] = useState<bigint>(0n);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [livePrices, setLivePrices] = useState<Record<string, PriceData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadTokenInfo(); }, []);
  useEffect(() => {
    fetchLivePrices().then(setLivePrices);
    const interval = setInterval(() => {
      fetchLivePrices().then(setLivePrices);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => { if (address) loadBalance(address); }, [address]);

  async function loadTokenInfo() {
    try { setTokenInfo(await getTokenInfo()); } catch (e) { console.error(e); }
  }
  async function loadBalance(addr: string) {
    setLoading(true);
    try { setArvBalance(await getARVBalance(addr)); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const decimals = tokenInfo?.decimals ?? 18;
  const formattedBalance = formatUnits(arvBalance, decimals);
  const totalSupplyFormatted = tokenInfo ? formatUnits(tokenInfo.totalSupply, decimals) : '0';

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-x-hidden">
        <div className="p-4 md:p-6 space-y-6">

          {/* Hero Section */}
          <section className="arv-card">
            <div className="text-center mb-4">
              <span className="text-xs text-[var(--arv-gold)]">{ARV_CONFIG.token.tagline}</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-right">
                <h1 className="text-3xl md:text-5xl font-bold mb-3">
                  <span className="gold-gradient">{ARV_CONFIG.token.name}</span>
                </h1>
                <p className="text-xl text-[var(--arv-gold)] mb-3">{ARV_CONFIG.token.symbol} Token</p>
                <p className="text-sm text-[var(--arv-text-muted)] leading-relaxed mb-6">
                  {language === 'en'
                    ? `Official reference for ARV; Arvand Khabar ecosystem token with active infrastructure on ${ARV_CONFIG.network.nameShort}`
                    : `مرجع رسمی معرفی ARV؛ توکن اکوسیستم اروند خبر با زیرساخت فعال روی ${ARV_CONFIG.network.nameShort}`}
                </p>
                <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                  <a href="/wallets" className="arv-btn-gold flex items-center gap-2 text-sm">
                    <Wallet size={16} /> باز کردن کیف پول
                  </a>
                  <a href="/about" className="px-6 py-3 rounded-xl border border-[var(--arv-gold)]/40 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/10 text-sm flex items-center gap-2">
                    <ChevronLeft size={16} /> بیشتر بدانید
                  </a>
                </div>
              </div>
              <div className="w-40 h-40 md:w-56 md:h-56 relative rounded-full overflow-hidden shadow-2xl shadow-[var(--arv-gold)]/30 flex-shrink-0">
                <Image
                  src="/arv-logo.png"
                  alt="Arvand Khabar Token"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </section>

          {/* Live Prices Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <DollarSign size={20} className="text-[var(--arv-gold)]" />
                قیمت‌های لحظه‌ای
              </h2>
              <a href="/market" className="text-xs text-[var(--arv-gold)] hover:underline flex items-center gap-1">
                مشاهده همه <ChevronLeft size={12} />
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {TICKER_SYMBOLS.map((token) => {
                const live = livePrices[token.symbol];
                const price = live?.price ?? 0;
                const change = live?.change24h ?? 0;
                return (
                  <PriceCard
                    key={token.symbol}
                    token={{
                      symbol: token.symbol,
                      name: token.name,
                      price,
                      change24h: change,
                      sparkline: [],
                    }}
                  />
                );
              })}
            </div>
          </section>

          {/* Stat Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatBigCard title="کیف پول شخصی" subtitle="غیرامانی و مستقل" icon={<Wallet size={24} />} extra="ورود به کیف پول" href="/wallets" color="blue" />
            <StatBigCard title="عرضه فعلی تست" subtitle={`${ARV_CONFIG.token.symbol} ${formatNumber(Number(totalSupplyFormatted))}`} icon={<Coins size={24} />} extra="قرارداد Testnet" color="gold" />
            <StatBigCard title="قرارداد فعال" subtitle={shortAddress(ARV_CONFIG.token.address, 8)} icon={<FileText size={24} />} extra="مشاهده در BscScan" href={ARV_CONFIG.links.bscscanToken} color="green" />
          </section>

          {/* CTA Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatBigCard title={language === 'en' ? 'Swap' : 'سواپ'} subtitle={language === 'en' ? 'Fast Exchange' : 'تبادل سریع'} icon={<ArrowLeftRight size={24} />} extra={language === 'en' ? 'Trade Now' : 'همین حالا'} href="/swap" color="gold" />
            <StatBigCard title={language === 'en' ? 'Liquidity' : 'نقدینگی'} subtitle={language === 'en' ? 'ARV/BNB Pool' : 'استخر ARV/BNB'} icon={<Droplets size={24} />} extra={language === 'en' ? 'Add / Remove' : 'افزودن / حذف'} href="/liquidity" color="green" />
            <StatBigCard title={language === 'en' ? 'Market' : 'بازار'} subtitle={language === 'en' ? 'Prices & Charts' : 'قیمت‌ها و نمودار'} icon={<BarChart3 size={24} />} extra={language === 'en' ? 'View Market' : 'مشاهده بازار'} href="/market" color="blue" />
          </section>

          {/* Current Status */}
          <section className="arv-card border-r-4 border-[var(--arv-gold)]">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[var(--arv-gold)] flex-shrink-0" />
              <p className="text-sm text-[var(--arv-text-muted)]">
                <strong className="text-white">{language === 'en' ? 'Current Status:' : 'وضعیت فعلی:'}</strong>{' '}
                {language === 'en'
                  ? `Current contract and supply are on Testnet. Target supply on Mainnet will be ${formatNumber(Number(ARV_CONFIG.token.totalSupplyMainnet))} ARV.`
                  : `قرارداد و عرضه فعلی مربوط به Testnet است. عرضه هدف در Mainnet آینده ${formatNumber(Number(ARV_CONFIG.token.totalSupplyMainnet))} ARV خواهد بود.`}
              </p>
            </div>
          </section>

          {/* Important Notice */}
          <section className="arv-card border-r-4 border-[var(--arv-warning)]">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-[var(--arv-warning)] flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-[var(--arv-warning)] mb-2">اطلاعیه مهم</div>
                <p className="text-sm text-[var(--arv-text-muted)] leading-relaxed">
                  {language === 'en'
                  ? 'Note: ARV is currently a token in the development and testing phase and is not offered as an investment or financial instrument.'
                  : 'توجه: ARV در حال حاضر یک توکن در مرحله توسعه و آزمایش است و فعال به‌عنوان سرمایه‌گذاری یا ابزار مالی ارائه نمی‌شود.'}
                </p>
              </div>
            </div>
          </section>

          {/* Ecosystem */}
          <section className="arv-card">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-[var(--arv-gold)]" />
              {language === 'en' ? 'ARV; Arvand Khabar Ecosystem' : 'ARV؛ اکوسیستم در حال توسعه اروند خبر'}
            </h2>
            <p className="text-sm text-[var(--arv-text-muted)] leading-relaxed mb-6">
              {language === 'en'
              ? `ARV is designed to create a clear path between user activity on the Arvand Khabar news site and token utility. Current Testnet supply is ${formatNumber(Number(ARV_CONFIG.token.totalSupplyTestnet))} ARV, and the Mainnet supply plan is ${formatNumber(Number(ARV_CONFIG.token.totalSupplyMainnet))} ARV with ${ARV_CONFIG.wallets.main.share}% allocated to the main wallet and ${ARV_CONFIG.wallets.reward.share}% to the reward pool.`
              : `ARV برای ایجاد یک مسیر مشخص میان فعالیت کاربران در سایت خبری اروند خبر و کاربرد توکن طراحی شده است. عرضه فعلی Testnet ${formatNumber(Number(ARV_CONFIG.token.totalSupplyTestnet))} ARV است و برنامه عرضه در Mainnet، ${formatNumber(Number(ARV_CONFIG.token.totalSupplyMainnet))} ARV با تخصیص ${ARV_CONFIG.wallets.main.share}٪ برای کیف پول اصلی و ${ARV_CONFIG.wallets.reward.share}٪ برای استخر پاداش است.`}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatSmall value="100M" label={language === 'en' ? 'Mainnet Supply Target' : 'هدف عرضه Mainnet'} />
              <StatSmall value="10M" label={language === 'en' ? 'Current Testnet Supply' : 'عرضه فعلی Testnet'} />
              <StatSmall value="18" label={language === 'en' ? 'Decimals' : 'اعشار'} />
              <StatSmall value="40/60" label={language === 'en' ? 'Mainnet Allocation' : 'تخصیص Mainnet'} />
            </div>
          </section>

          {/* How to Start */}
          <section className="arv-card">
            <h2 className="text-lg font-bold mb-6 text-center">{language === 'en' ? 'How to get started with ARV?' : 'چطور با ARV شروع کنیم؟'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {ARV_CONFIG.steps.map((step) => (
                <div key={step.num} className="arv-card bg-[var(--arv-blue)]/20 text-center">
                  <div className="text-2xl font-bold gold-gradient mb-2">{String(step.num).padStart(2, '0')}</div>
                  <div className="font-bold mb-2 text-sm">{language === 'en' ? step.titleEn : step.title}</div>
                  <p className="text-xs text-[var(--arv-text-muted)]">{language === 'en' ? step.descEn : step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* User Wallet */}
          {isConnected && (
            <section className="arv-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--arv-gold)]/10 flex items-center justify-center">
                    <Wallet size={20} className="text-[var(--arv-gold)]" />
                  </div>
                  <div>
                    <div className="font-bold">{language === 'en' ? 'Your Wallet' : 'کیف پول شما'}</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">{shortAddress(address!)}</div>
                  </div>
                </div>
                <button onClick={() => address && loadBalance(address)} className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]" disabled={loading}>
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              <div className="text-4xl font-bold gold-gradient mb-2">{formattedBalance}</div>
              <div className="text-sm text-[var(--arv-text-muted)]">ARV Tokens</div>
            </section>
          )}

          {/* Token Info */}
          {tokenInfo && (
            <section className="arv-card">
              <h2 className="font-bold mb-4">اطلاعات توکن ARV</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <InfoRow label="نام" value={tokenInfo.name} />
                <InfoRow label="نماد" value={tokenInfo.symbol} />
                <InfoRow label="اعشار" value={tokenInfo.decimals.toString()} />
                <InfoRow label="شبکه" value={ARV_CONFIG.network.name} />
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}

// ============================================================
// کامپوننت‌های کمکی
// ============================================================

function PriceCard({ token }: { token: any }) {
  return (
    <a
      href="/market"
      className="arv-card hover:scale-[1.03] transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)' }}
      />
      <div className="flex items-center gap-2 mb-2">
        <TokenLogo symbol={token.symbol} size={28} />
        <div className="flex-1">
          <div className="font-bold text-xs">{token.symbol}</div>
          <div className="text-[9px] text-[var(--arv-text-muted)]">{token.name}</div>
        </div>
        {token.change24h >= 0 ? (
          <TrendingUp size={14} className="text-green-400" />
        ) : (
          <TrendingDown size={14} className="text-red-400" />
        )}
      </div>
      <div className="text-base font-bold mb-1" dir="ltr">
        ${token.price < 1 ? token.price.toFixed(6) : token.price.toLocaleString()}
      </div>
      <div className={'text-[10px] font-bold mb-2 ' + (token.change24h >= 0 ? 'text-green-400' : 'text-red-400')}>
        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
      </div>
      <svg viewBox="0 0 100 30" className="w-full h-6" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={token.change24h >= 0 ? '#10b981' : '#ef4444'}
          strokeWidth="2"
          points={token.sparkline.map((val: number, i: number) => {
            const min = Math.min(...token.sparkline);
            const max = Math.max(...token.sparkline);
            const range = max - min || 1;
            const x = (i / (token.sparkline.length - 1)) * 100;
            const y = 30 - ((val - min) / range) * 30;
            return x + ',' + y;
          }).join(' ')}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

function StatBigCard({ title, subtitle, icon, extra, href, color }: any) {
  const colorMap: any = { gold: 'text-[var(--arv-gold)]', blue: 'text-blue-400', green: 'text-[var(--arv-success)]' };
  const content = (
    <div className="arv-card hover:scale-[1.02] transition-transform cursor-pointer">
      <div className={`${colorMap[color]} mb-3`}>{icon}</div>
      <div className="font-bold mb-1">{title}</div>
      <div className="text-xl font-bold mb-3">{subtitle}</div>
      <div className="text-xs text-[var(--arv-text-muted)] flex items-center gap-1">
        {extra} <ExternalLink size={12} />
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

function StatSmall({ value, label }: any) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold gold-gradient">{value}</div>
      <div className="text-xs text-[var(--arv-text-muted)] mt-1">{label}</div>
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div>
      <div className="text-xs text-[var(--arv-text-muted)] mb-1">{label}</div>
      <div className="font-bold text-sm">{value}</div>
    </div>
  );
}
