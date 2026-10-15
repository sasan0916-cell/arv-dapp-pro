/**
 * سرویس Watchlist - لیست علاقه‌مندی توکن‌ها
 */

import { storageGet, storageSet } from './storage';

const WATCHLIST_KEY = 'arv_watchlist';

export async function loadWatchlist(): Promise<string[]> {
  try {
    const raw = await storageGet(WATCHLIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function saveWatchlist(symbols: string[]): Promise<void> {
  await storageSet(WATCHLIST_KEY, JSON.stringify(symbols));
}

export async function toggleWatchlist(symbol: string): Promise<string[]> {
  const list = await loadWatchlist();
  const upper = symbol.toUpperCase();
  const next = list.includes(upper)
    ? list.filter((s) => s !== upper)
    : [...list, upper];
  await saveWatchlist(next);
  return next;
}

export async function isInWatchlist(symbol: string): Promise<boolean> {
  const list = await loadWatchlist();
  return list.includes(symbol.toUpperCase());
}
