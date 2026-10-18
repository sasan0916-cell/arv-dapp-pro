'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  AreaSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { fetchLivePrices, formatPrice, type PriceData } from '@/lib/services/price-service';

type Coin = { symbol: string; id: string | null; name: string };

const COINS: Coin[] = [
  { symbol: 'ARV', id: null, name: 'Arvand Khabar' },
  { symbol: 'BNB', id: 'binancecoin', name: 'BNB' },
  { symbol: 'BTC', id: 'bitcoin', name: 'Bitcoin' },
  { symbol: 'ETH', id: 'ethereum', name: 'Ethereum' },
  { symbol: 'SOL', id: 'solana', name: 'Solana' },
  { symbol: 'XRP', id: 'ripple', name: 'XRP' },
  { symbol: 'CAKE', id: 'pancakeswap-token', name: 'PancakeSwap' },
];

const TIMEFRAMES = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

type Candle = { time: number; open: number; high: number; low: number; close: number };
type LinePoint = { time: number; value: number };

const OHLC_CACHE_MS = 5 * 60 * 1000;
const ARV_HISTORY_KEY = 'arv_price_history_v1';
const ARV_MAX_POINTS = 1000;

async function fetchOhlc(id: string, days: number): Promise<Candle[]> {
  const cacheKey = `arv_ohlc_${id}_${days}`;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const c = JSON.parse(raw);
      if (Date.now() - c.t < OHLC_CACHE_MS && c.d?.length) return c.d;
    }
  } catch {}

  const url = `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${days}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const rows: number[][] = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) throw new Error('empty');

  const seen = new Set<number>();
  const candles: Candle[] = [];
  for (const r of rows) {
    const t = Math.floor(r[0] / 1000);
    if (seen.has(t)) continue;
    seen.add(t);
    candles.push({ time: t, open: r[1], high: r[2], low: r[3], close: r[4] });
  }
  candles.sort((a, b) => a.time - b.time);

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), d: candles }));
  } catch {}
  return candles;
}

function loadArvHistory(): LinePoint[] {
  try {
    const raw = localStorage.getItem(ARV_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveArvPoint(price: number): LinePoint[] {
  const hist = loadArvHistory();
  const now = Math.floor(Date.now() / 1000);
  const last = hist[hist.length - 1];
  if (!last || now - last.time >= 55) hist.push({ time: now, value: price });
  const trimmed = hist.slice(-ARV_MAX_POINTS);
  try {
    localStorage.setItem(ARV_HISTORY_KEY, JSON.stringify(trimmed));
  } catch {}
  return trimmed;
}

export default function MarketChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Area'> | null>(null);

  const [coin, setCoin] = useState<Coin>(COINS[1]);
  const [tf, setTf] = useState(TIMEFRAMES[2]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [line, setLine] = useState<LinePoint[]>([]);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [reloadKey, setReloadKey] = useState(0);

  const isArv = coin.symbol === 'ARV';

  // دریافت داده
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    (async () => {
      try {
        const p = await fetchLivePrices();
        if (cancelled) return;
        setPrices(p);

        if (isArv) {
          const arv = p['ARV'];
          if (!arv || !(arv.price > 0)) throw new Error('no-arv-price');
          setLine(saveArvPoint(arv.price));
          setCandles([]);
        } else {
          const data = await fetchOhlc(coin.id as string, tf.days);
          if (cancelled) return;
          setCandles(data);
          setLine([]);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            isArv
              ? 'قیمت ARV از استخر در دسترس نیست.'
              : 'دریافت داده ناموفق بود. اتصال یا فیلترشکن را بررسی کنید (ممکن است محدودیت نرخ API باشد).'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [coin, tf, reloadKey, isArv]);

  // به‌روزرسانی دوره‌ای ARV
  useEffect(() => {
    if (!isArv) return;
    const t = setInterval(() => setReloadKey((k) => k + 1), 60000);
    return () => clearInterval(t);
  }, [isArv]);

  // ساخت و رسم چارت
  useEffect(() => {
    const el = containerRef.current;
    if (!el || loading || error) return;
    if (isArv ? line.length === 0 : candles.length === 0) return;

    const style = getComputedStyle(document.documentElement);
    const textColor = style.getPropertyValue('--arv-text-muted').trim() || '#8b95a8';

    const chart = createChart(el, {
      width: el.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor,
      },
      grid: {
        vertLines: { color: 'rgba(212,175,55,0.06)' },
        horzLines: { color: 'rgba(212,175,55,0.06)' },
      },
      rightPriceScale: { borderColor: 'rgba(212,175,55,0.2)' },
      timeScale: { borderColor: 'rgba(212,175,55,0.2)', timeVisible: true },
      crosshair: { mode: 1 },
    });
    chartRef.current = chart;

    const minMove = isArv ? 0.0000001 : 0.01;
    const precision = isArv ? 8 : 2;

    if (isArv) {
      const s = chart.addSeries(AreaSeries, {
        lineColor: '#d4af37',
        topColor: 'rgba(212,175,55,0.3)',
        bottomColor: 'rgba(212,175,55,0)',
        priceFormat: { type: 'price', precision, minMove },
      });
      s.setData(line.map((p) => ({ time: p.time as UTCTimestamp, value: p.value })));
      seriesRef.current = s;
    } else {
      const s = chart.addSeries(CandlestickSeries, {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
      });
      s.setData(candles.map((c) => ({ ...c, time: c.time as UTCTimestamp })));
      seriesRef.current = s;
    }
    chart.timeScale().fitContent();

    const onResize = () => chart.applyOptions({ width: el.clientWidth });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [candles, line, loading, error, isArv]);

  // آمار هدر
  const live = prices[coin.symbol];
  let high = 0;
  let low = 0;
  if (!isArv && candles.length) {
    high = Math.max(...candles.map((c) => c.high));
    low = Math.min(...candles.map((c) => c.low));
  } else if (isArv && line.length) {
    high = Math.max(...line.map((p) => p.value));
    low = Math.min(...line.map((p) => p.value));
  }
  const change = live?.change24h ?? 0;
  const up = change >= 0;

  return (
    <div className="w-full mt-2">
      {/* انتخاب ارز */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {COINS.map((c) => (
          <button
            key={c.symbol}
            onClick={() => setCoin(c)}
            className={
              'px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border transition-all ' +
              (coin.symbol === c.symbol
                ? 'bg-[var(--arv-gold)] text-[#0a0e1a] font-bold border-[var(--arv-gold)]'
                : 'border-[var(--arv-gold)]/20 text-[var(--arv-text-muted)] hover:text-[var(--arv-gold)]')
            }
          >
            {c.symbol}
          </button>
        ))}
      </div>

      {/* هدر */}
      <div className="flex items-start justify-between mb-3 gap-3 flex-wrap">
        <div>
          <div className="text-[var(--arv-text-muted)] text-xs">{coin.name} / USD</div>
          <div className="text-[var(--arv-gold)] font-bold text-2xl" dir="ltr">
            {live ? '$' + formatPrice(live.price) : '—'}
          </div>
          {!isArv && live && (
            <div className={'flex items-center gap-1 text-xs ' + (up ? 'text-green-400' : 'text-red-400')} dir="ltr">
              {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(change).toFixed(2)}% (24h)
            </div>
          )}
          {high > 0 && (
            <div className="text-[10px] text-[var(--arv-text-muted)] mt-1" dir="ltr">
              H: {formatPrice(high)} · L: {formatPrice(low)}
            </div>
          )}
        </div>

        {!isArv && (
          <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
            {TIMEFRAMES.map((t) => (
              <button
                key={t.label}
                onClick={() => setTf(t)}
                className={
                  'px-2.5 py-1 text-[10px] rounded-md transition-all ' +
                  (tf.label === t.label
                    ? 'bg-[var(--arv-gold)] text-[#0a0e1a] font-bold'
                    : 'text-[var(--arv-text-muted)] hover:text-[var(--arv-gold)]')
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isArv && (
        <div className="mb-2 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] inline-block">
          تست‌نت: تاریخچه‌ی رسمی وجود ندارد؛ نمودار از لحظه‌ی باز کردن صفحه ساخته می‌شود.
        </div>
      )}

      {/* بدنه */}
      {loading ? (
        <div className="w-full h-[400px] flex items-center justify-center text-[var(--arv-gold)]">
          <RefreshCw size={24} className="animate-spin" />
        </div>
      ) : error ? (
        <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3 text-sm border border-red-500/30 rounded-xl bg-red-500/5 text-red-400 px-4 text-center">
          <div>{error}</div>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="px-4 py-1.5 rounded-lg border border-red-400/40 hover:bg-red-500/10 text-xs"
          >
            تلاش دوباره
          </button>
        </div>
      ) : (
        <div ref={containerRef} className="w-full h-[400px] rounded-xl overflow-hidden" dir="ltr" />
      )}
    </div>
  );
}
