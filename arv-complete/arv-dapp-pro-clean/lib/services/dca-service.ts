/**
 * سرویس DCA (خرید دوره‌ای)
 * کاربر بازه و مقدار رو تعیین می‌کند
 * DApp یادآوری می‌کند
 */

import { storageGet, storageSet } from './storage';

const DCA_KEY = 'arv_dca_schedules';

export interface DCASchedule {
  id: string;
  fromSymbol: string;
  toSymbol: string;
  amount: number;
  intervalDays: number;
  nextRun: number;
  lastRun?: number;
  totalRuns: number;
  active: boolean;
  createdAt: number;
}

export async function loadDCASchedules(): Promise<DCASchedule[]> {
  try {
    const raw = await storageGet(DCA_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DCASchedule[];
  } catch {
    return [];
  }
}

export async function saveDCASchedules(schedules: DCASchedule[]): Promise<void> {
  await storageSet(DCA_KEY, JSON.stringify(schedules));
}

export async function addDCASchedule(
  schedule: Omit<DCASchedule, 'id' | 'createdAt' | 'totalRuns' | 'active' | 'nextRun'>
): Promise<DCASchedule[]> {
  const list = await loadDCASchedules();
  const now = Date.now();
  const newSchedule: DCASchedule = {
    ...schedule,
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    totalRuns: 0,
    active: true,
    nextRun: now + schedule.intervalDays * 24 * 60 * 60 * 1000,
  };
  const next = [newSchedule, ...list];
  await saveDCASchedules(next);
  return next;
}

export async function removeDCASchedule(id: string): Promise<DCASchedule[]> {
  const list = await loadDCASchedules();
  const next = list.filter((s) => s.id !== id);
  await saveDCASchedules(next);
  return next;
}

export async function toggleDCASchedule(id: string): Promise<DCASchedule[]> {
  const list = await loadDCASchedules();
  const next = list.map((s) =>
    s.id === id ? { ...s, active: !s.active } : s
  );
  await saveDCASchedules(next);
  return next;
}

export async function markDCARun(id: string): Promise<DCASchedule[]> {
  const list = await loadDCASchedules();
  const next = list.map((s) => {
    if (s.id !== id) return s;
    const now = Date.now();
    return {
      ...s,
      lastRun: now,
      totalRuns: s.totalRuns + 1,
      nextRun: now + s.intervalDays * 24 * 60 * 60 * 1000,
    };
  });
  await saveDCASchedules(next);
  return next;
}

/**
 * چک کردن DCAهای سررسید شده
 */
export async function checkDueDCAs(): Promise<DCASchedule[]> {
  const list = await loadDCASchedules();
  const now = Date.now();
  return list.filter((s) => s.active && s.nextRun <= now);
}

/**
 * فرمت بازه
 */
export function formatInterval(days: number, en: boolean): string {
  if (days === 1) return en ? 'Daily' : 'روزانه';
  if (days === 7) return en ? 'Weekly' : 'هفتگی';
  if (days === 14) return en ? 'Bi-weekly' : 'دو هفته‌ای';
  if (days === 30) return en ? 'Monthly' : 'ماهانه';
  return en ? `Every ${days} days` : `هر ${days} روز`;
}
