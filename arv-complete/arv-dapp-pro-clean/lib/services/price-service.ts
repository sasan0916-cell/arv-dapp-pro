/**
 * سرویس قیمت لحظه‌ای از CoinGecko API + Pool خودمون
 * رایگان، بدون کلید
 */
import { getQuote, getDexProvider, PANCAKE_V2 } from './dex-service';
import { ARV_CONFIG } from '../arv-config';

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  lastUpdate: number;
}

// CoinGecko IDs برای هر توکن
const COINGECKO_IDS: Record<string, string> = {
  'BNB': 'binancecoin',
  'BTC': 'bitcoin',
  'BTCB': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'XRP': 'ripple',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'BUSD': 'binance-usd',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'MATIC': 'matic-network',
  'DOT': 'polkadot',
  'SHIB': 'shiba-inu',
  'TRX': 'tron',
  'CAKE': 'pancakeswap-token',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'LTC': 'litecoin',
  'BCH': 'bitcoin-cash',
  'EOS': 'eos',
  'ALPHA': 'alpha-finance',
};

const CACHE_KEY = 'arv_prices_cache';
const CACHE_DURATION = 60 * 1000; // ۶۰ ثانیه

interface CacheData {
  prices: Record<string, PriceData>;
  fetchedAt: number;
}

function loadCache(): CacheData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveCache(data: CacheData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

/**
 * گرفتن قیمت ARV از Pool PancakeSwap Testnet
 * (1 ARV -> مقدار tBNB -> ضرب در قیمت BNB/USD)
 */
async function fetchARVPriceFromPool(): Promise<{ price: number; change24h: number } | null> {
  try {
    const chainId = ARV_CONFIG.network.chainId as 56 | 97;
    const arvAddress = ARV_CONFIG.token.address;
    if (!arvAddress) return null;

    // 1 ARV به tBNB
    const oneArv = BigInt('1000000000000000000'); // 1 * 10^18
    const quote = await getQuote({
      chainId,
      fromAddress: arvAddress,
      toAddress: 'native',
      amountIn: oneArv,
    });

    if (!quote || quote.amountOut === 0n) return null;

    // قیمت ARV به tBNB (به صورت عدد اعشاری)
    const arvToBnb = Number(quote.amountOut) / 1e18;
    if (arvToBnb <= 0) return null;

    // قیمت BNB به USD از CoinGecko
    let bnbUsd = 0;
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd', { cache: 'no-store' });
      const d = await r.json();
      bnbUsd = d?.binancecoin?.usd || 0;
    } catch {}
    if (bnbUsd <= 0) bnbUsd = 750; // fallback

    const arvUsd = arvToBnb * bnbUsd;
    return { price: arvUsd, change24h: 0 };
  } catch (e) {
    console.warn('fetchARVPriceFromPool error:', e);
    return null;
  }
}

/**
 * گرفتن قیمت‌های زنده از CoinGecko
 */
export async function fetchLivePrices(): Promise<Record<string, PriceData>> {
  // چک کش
  const cached = loadCache();
  if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION) {
    return cached.prices;
  }

  try {
    const ids = Object.values(COINGECKO_IDS).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('CoinGecko API error');

    const data = await response.json();

    const prices: Record<string, PriceData> = {};
    const now = Date.now();

    // ARV از Pool خودمون (نه CoinGecko)
    let arvFromPool: { price: number; change24h: number } | null = null;
    try {
      arvFromPool = await fetchARVPriceFromPool();
    } catch {}

    if (arvFromPool && arvFromPool.price > 0) {
      prices['ARV'] = {
        symbol: 'ARV',
        price: arvFromPool.price,
        change24h: arvFromPool.change24h,
        lastUpdate: now,
      };
    } else {
      // fallback اگه Pool خطا داد
      prices['ARV'] = {
        symbol: 'ARV',
        price: 0.00037,
        change24h: 0,
        lastUpdate: now,
      };
    }

    for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
      const item = data[id];
      if (item && item.usd !== undefined) {
        prices[symbol] = {
          symbol,
          price: item.usd,
          change24h: item.usd_24h_change || 0,
          lastUpdate: now,
        };
      }
    }

    saveCache({ prices, fetchedAt: now });
    return prices;
  } catch (e) {
    console.error('fetchLivePrices error:', e);
    // در صورت خطا، کش قدیمی رو برگردون
    return cached?.prices || {};
  }
}

/**
 * فرمت قیمت برای نمایش
 */
export function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(4);
  return price.toFixed(6);
}
