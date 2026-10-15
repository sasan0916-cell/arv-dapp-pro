'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAccount } from 'wagmi';
import { GlowCard } from '@/components/ui/GlowCard';
import TokenLogo from '@/components/ui/TokenLogo';
import { fetchLivePrices, type PriceData } from '@/lib/services/price-service';
import { getARVBalance, getBNBBalance } from '@/lib/services/token-service';
import { useLanguage } from '@/lib/i18n';
import { formatUnits } from 'viem';

interface AssetInfo {
  symbol: string;
  balance: string;
  price: number;
  valueUSD: number;
  change24h: number;
}

export function PortfolioCard() {
  const router = useRouter();
  const { address: externalAddress } = useAccount();
  const { language } = useLanguage();
  const en = language === 'en';

  const [address, setAddress] = useState('');
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [totalUSD, setTotalUSD] = useState(0);
  const [change24h, setChange24h] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userAddr = externalAddress || localStorage.getItem('arv_user_address') || '';
    setAddress(userAddr);
  }, [externalAddress]);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [arvRaw, bnbRaw, priceData] = await Promise.all([
          getARVBalance(address).catch(() => 0n),
          getBNBBalance(address).catch(() => 0n),
          fetchLivePrices(),
        ]);
        if (cancelled) return;

        setPrices(priceData);

        const list: AssetInfo[] = [];
        const arvBal = Number(formatUnits(arvRaw, 18));
        const bnbBal = Number(formatUnits(bnbRaw, 18));

        const arvPrice = priceData['ARV']?.price || 0.00245;
        const bnbPrice = priceData['BNB']?.price || 600;

        if (arvBal > 0) {
          list.push({
            symbol: 'ARV',
            balance: arvBal.toFixed(4),
            price: arvPrice,
            valueUSD: arvBal * arvPrice,
            change24h: priceData['ARV']?.change24h || 0,
          });
        }
        if (bnbBal > 0) {
          list.push({
            symbol: 'BNB',
            balance: bnbBal.toFixed(4),
            price: bnbPrice,
            valueUSD: bnbBal * bnbPrice,
            change24h: priceData['BNB']?.change24h || 0,
          });
        }

        list.sort((a, b) => b.valueUSD - a.valueUSD);
        const total = list.reduce((sum, a) => sum + a.valueUSD, 0);
        const weightedChange = total > 0
          ? list.reduce((sum, a) => sum + (a.change24h * a.valueUSD), 0) / total
          : 0;

        setAssets(list);
        setTotalUSD(total);
        setChange24h(weightedChange);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [address]);

  const formatUSD = (n: number) => {
    if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    if (n >= 1) return `$${n.toFixed(2)}`;
    if (n >= 0.01) return `$${n.toFixed(4)}`;
    return `$${n.toFixed(6)}`;
  };

  if (!address) {
    return (
      <GlowCard glowColor="gold">
        <div className="flex items-center gap-3">
          <Wallet size={28} className="text-[var(--arv-gold)]" />
          <div className="flex-1">
            <div className="font-bold text-sm">{en ? 'Wallet not connected' : 'کیف پول متصل نیست'}</div>
            <div className="text-xs text-[var(--arv-text-muted)] mt-0.5">
              {en ? 'Connect your wallet to view assets' : 'برای مشاهده دارایی‌ها کیف خود را وصل کنید'}
            </div>
          </div>
          <button onClick={() => router.push('/wallets')} className="p-2 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)]">
            <ArrowRight size={18} />
          </button>
        </div>
      </GlowCard>
    );
  }

  return (
    <GlowCard glowColor="gold">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-[var(--arv-gold)]" />
          <div className="font-bold text-sm">{en ? 'Your Total Assets' : 'دارایی کل شما'}</div>
        </div>
        <button onClick={() => setHidden(!hidden)} className="p-1.5 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]">
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-6 text-xs text-[var(--arv-text-muted)]">{en ? 'Loading...' : 'در حال بارگذاری...'}</div>
      ) : (
        <>
          <div className="mb-3">
            <div className="text-3xl font-bold gold-gradient" dir="ltr">
              {hidden ? '****' : formatUSD(totalUSD)}
            </div>
            <div className={`flex items-center gap-1 text-xs mt-1 ${change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% (24h)</span>
            </div>
          </div>

          {assets.length > 0 && (
            <div className="space-y-2 mb-3">
              {assets.slice(0, 4).map((asset) => (
                <div key={asset.symbol} className="flex items-center gap-2 py-1.5">
                  <TokenLogo symbol={asset.symbol} size={24} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs">{asset.symbol}</div>
                    <div className="text-[10px] text-[var(--arv-text-muted)]" dir="ltr">
                      {hidden ? '****' : asset.balance}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold" dir="ltr">{hidden ? '****' : formatUSD(asset.valueUSD)}</div>
                    <div className={`text-[10px] ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`} dir="ltr">
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {assets.length === 0 && (
            <div className="text-center py-4 text-xs text-[var(--arv-text-muted)] mb-3">
              {en ? 'No assets yet' : 'هنوز دارایی‌ای ندارید'}
            </div>
          )}

          <button
            onClick={() => router.push('/wallets')}
            className="w-full py-2 rounded-lg text-xs font-bold bg-[var(--arv-blue)]/40 text-[var(--arv-gold)] hover:bg-[var(--arv-blue)]/60 transition-all"
          >
            {en ? 'View Details' : 'مشاهده جزئیات'}
          </button>
        </>
      )}
    </GlowCard>
  );
}
