'use client';

import { useCallback, useEffect, useState } from 'react';
import { Activity, BarChart3, DollarSign, Droplets, ExternalLink, LineChart, RefreshCw, Users } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { ARV_CONFIG } from '@/lib/arv-config';
import { getPairAddress, getQuote, PANCAKE_V2 } from '@/lib/services/dex-service';
import { ethers } from 'ethers';

const USDT = '0x55d398326f99059fF775485246999027B3197955';

interface MarketState {
  arvBnb: string | null;
  arvUsdt: string | null;
  bnbUsdt: string | null;
  liquidityArvBnb: string | null;
  pairArvBnb: string | null;
  loading: boolean;
  error: string;
}

const EMPTY: MarketState = {
  arvBnb: null,
  arvUsdt: null,
  bnbUsdt: null,
  liquidityArvBnb: null,
  pairArvBnb: null,
  loading: true,
  error: '',
};

export default function MarketPage() {
  const [market, setMarket] = useState<MarketState>(EMPTY);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setMarket((s) => ({ ...s, loading: true, error: '' }));
    const chainId = ARV_CONFIG.network.chainId as 56 | 97;
    const arv = ARV_CONFIG.token.address;

    if (!arv) {
      setMarket({ ...EMPTY, loading: false, error: 'قرارداد ARV روی شبکه فعال هنوز تنظیم نشده است.' });
      return;
    }

    try {
      const oneArv = ethers.parseUnits('1', ARV_CONFIG.token.decimals);
      const oneBnb = ethers.parseEther('1');
      const arvBnbPair = await getPairAddress(chainId, arv, PANCAKE_V2[chainId].wrappedNative);
      const pairExists = arvBnbPair && arvBnbPair !== ethers.ZeroAddress;

      let arvBnb: string | null = null;
      let arvUsdt: string | null = null;
      let bnbUsdt: string | null = null;

      if (pairExists) {
        const q = await getQuote({ chainId, fromAddress: arv, toAddress: 'native', amountIn: oneArv });
        arvBnb = ethers.formatEther(q.amountOut);
      }

      if (chainId === 56) {
        try {
          const q = await getQuote({ chainId, fromAddress: arv, toAddress: USDT, amountIn: oneArv });
          arvUsdt = ethers.formatUnits(q.amountOut, 18);
        } catch {}
        try {
          const q = await getQuote({ chainId, fromAddress: 'native', toAddress: USDT, amountIn: oneBnb });
          bnbUsdt = ethers.formatUnits(q.amountOut, 18);
        } catch {}
      }

      let liquidityArvBnb: string | null = null;
      if (pairExists) {
        // LP token balance is not a TVL oracle; show the pair address and live quote instead of inventing TVL.
        liquidityArvBnb = 'Pair detected';
      }

      setMarket({
        arvBnb,
        arvUsdt,
        bnbUsdt,
        liquidityArvBnb,
        pairArvBnb: pairExists ? arvBnbPair : null,
        loading: false,
        error: pairExists ? '' : 'برای ARV روی شبکه فعال هنوز استخر ARV/BNB قابل Quote پیدا نشد.',
      });
      setLastUpdated(new Date());
    } catch (e) {
      setMarket({ ...EMPTY, loading: false, error: e instanceof Error ? e.message : 'داده زنده بازار دریافت نشد' });
    }
  }, []);

  useEffect(() => {
    load();
    const id = window.setInterval(load, 30000);
    return () => window.clearInterval(id);
  }, [load]);

  const bnbUsd = market.bnbUsdt ? Number(market.bnbUsdt) : null;
  const arvUsd = market.arvUsdt ? Number(market.arvUsdt) : market.arvBnb && bnbUsd ? Number(market.arvBnb) * bnbUsd : null;
  const explorer = ARV_CONFIG.network.explorer;

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-x-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1"><span className="gold-gradient">تحلیل بازار</span></h1>
              <p className="text-sm text-[var(--arv-text-muted)]">داده‌های زنده فقط از قراردادهای روی زنجیره</p>
              {lastUpdated && <p className="text-[10px] text-[var(--arv-text-muted)] mt-1">آخرین به‌روزرسانی: {lastUpdated.toLocaleTimeString('fa-IR')}</p>}
            </div>
            <button onClick={load} disabled={market.loading} className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)] disabled:opacity-50">
              <RefreshCw size={18} className={market.loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlowCard glowColor="gold"><DollarSign className="text-[var(--arv-gold)] mb-2" size={20}/><div className="text-xs text-[var(--arv-text-muted)]">قیمت زنده ARV</div><div className="text-xl font-bold mt-2">{arvUsd == null ? '—' : `$${arvUsd.toFixed(arvUsd < 0.01 ? 8 : 4)}`}</div></GlowCard>
            <GlowCard glowColor="blue"><Activity className="text-blue-400 mb-2" size={20}/><div className="text-xs text-[var(--arv-text-muted)]">قیمت زنده BNB/USDT</div><div className="text-xl font-bold mt-2">{bnbUsd == null ? '—' : `$${bnbUsd.toFixed(2)}`}</div></GlowCard>
            <GlowCard glowColor="green"><Droplets className="text-[var(--arv-success)] mb-2" size={20}/><div className="text-xs text-[var(--arv-text-muted)]">استخر ARV/BNB</div><div className="text-xl font-bold mt-2">{market.liquidityArvBnb || '—'}</div></GlowCard>
            <GlowCard glowColor="purple"><BarChart3 className="text-purple-400 mb-2" size={20}/><div className="text-xs text-[var(--arv-text-muted)]">شبکه فعال</div><div className="text-xl font-bold mt-2">{ARV_CONFIG.network.nameShort}</div></GlowCard>
          </div>

          <GlowCard glowColor="gold">
            <h2 className="font-bold flex items-center gap-2 mb-4"><LineChart size={20} className="text-[var(--arv-gold)]"/> قیمت‌های قابل معامله</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="arv-card"><div className="text-xs text-[var(--arv-text-muted)]">1 ARV → BNB</div><div className="font-bold mt-1">{market.arvBnb ? `${market.arvBnb} BNB` : 'بدون Quote'}</div></div>
              <div className="arv-card"><div className="text-xs text-[var(--arv-text-muted)]">1 ARV → USDT</div><div className="font-bold mt-1">{market.arvUsdt ? `${market.arvUsdt} USDT` : 'بدون Quote'}</div></div>
              <div className="arv-card"><div className="text-xs text-[var(--arv-text-muted)]">1 BNB → USDT</div><div className="font-bold mt-1">{market.bnbUsdt ? `${market.bnbUsdt} USDT` : 'بدون Quote'}</div></div>
            </div>
            <p className="text-xs text-[var(--arv-text-muted)] mt-4">این صفحه عمداً قیمت، حجم، APY یا تعداد هولدر ساختگی نمایش نمی‌دهد. داده‌های تاریخی و آمار تجمیعی فقط پس از اتصال یک indexer یا API بازار اضافه می‌شوند.</p>
          </GlowCard>

          <GlowCard glowColor="blue">
            <h2 className="font-bold flex items-center gap-2 mb-4"><Users size={20} className="text-blue-400"/> اطلاعات زنجیره</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4"><span className="text-[var(--arv-text-muted)]">قرارداد ARV</span><span className="font-mono truncate" dir="ltr">{ARV_CONFIG.token.address || 'در انتظار Deploy'}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[var(--arv-text-muted)]">Pair ARV/BNB</span><span className="font-mono truncate" dir="ltr">{market.pairArvBnb || 'وجود ندارد / پیدا نشد'}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[var(--arv-text-muted)]">Explorer</span><a href={ARV_CONFIG.token.address ? `${explorer}/token/${ARV_CONFIG.token.address}` : explorer} target="_blank" rel="noreferrer" className="text-[var(--arv-gold)] flex items-center gap-1">BscScan <ExternalLink size={12}/></a></div>
            </div>
          </GlowCard>

          {market.error && <div className="p-4 rounded-xl bg-[var(--arv-warning)]/10 border border-[var(--arv-warning)]/30 text-sm text-[var(--arv-warning)]">{market.error}</div>}
        </div>
      </main>
    </div>
  );
}
