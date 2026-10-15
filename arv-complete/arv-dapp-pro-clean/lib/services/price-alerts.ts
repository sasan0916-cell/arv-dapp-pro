/**
 * سرویس هشدار قیمت
 * کاربر می‌تواند برای هر توکن، قیمت هدف تنظیم کند
 */

import { storageGet, storageSet } from './storage';

const ALERTS_KEY = 'arv_price_alerts';

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  action?: 'notify' | 'stoploss' | 'takeprofit' | 'limit';
  sellAmount?: number;
  sellSymbol?: string;
  createdAt: number;
  triggered: boolean;
  triggeredAt?: number;
}

/**
 * بارگذاری همه هشدارها
 */
export async function loadAlerts(): Promise<PriceAlert[]> {
  try {
    const raw = await storageGet(ALERTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PriceAlert[];
  } catch {
    return [];
  }
}

/**
 * ذخیره همه هشدارها
 */
export async function saveAlerts(alerts: PriceAlert[]): Promise<void> {
  await storageSet(ALERTS_KEY, JSON.stringify(alerts));
}

/**
 * افزودن هشدار جدید
 */
export async function addAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>): Promise<PriceAlert[]> {
  const alerts = await loadAlerts();
  const newAlert: PriceAlert = {
    ...alert,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    triggered: false,
  };
  const next = [newAlert, ...alerts];
  await saveAlerts(next);
  return next;
}

/**
 * حذف هشدار
 */
export async function removeAlert(id: string): Promise<PriceAlert[]> {
  const alerts = await loadAlerts();
  const next = alerts.filter((a) => a.id !== id);
  await saveAlerts(next);
  return next;
}

/**
 * علامت‌گذاری هشدار به عنوان فعال‌شده
 */
export async function markAlertTriggered(id: string): Promise<PriceAlert[]> {
  const alerts = await loadAlerts();
  const next = alerts.map((a) =>
    a.id === id ? { ...a, triggered: true, triggeredAt: Date.now() } : a
  );
  await saveAlerts(next);
  return next;
}

/**
 * چک کردن همه هشدارها با قیمت‌های فعلی
 * برمی‌گرداند لیست هشدارهایی که باید trigger بشن
 */
export async function checkAlerts(prices: Record<string, { price: number }>): Promise<PriceAlert[]> {
  const alerts = await loadAlerts();
  const toTrigger: PriceAlert[] = [];

  for (const alert of alerts) {
    if (alert.triggered) continue;
    const priceData = prices[alert.symbol];
    if (!priceData) continue;

    const current = priceData.price;
    const shouldTrigger =
      (alert.condition === 'above' && current >= alert.targetPrice) ||
      (alert.condition === 'below' && current <= alert.targetPrice);

    if (shouldTrigger) {
      toTrigger.push(alert);
    }
  }

  return toTrigger;
}

/**
 * پاک کردن همه هشدارها
 */
export async function clearAllAlerts(): Promise<void> {
  await storageSet(ALERTS_KEY, JSON.stringify([]));
}
