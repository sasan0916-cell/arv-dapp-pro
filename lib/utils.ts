import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// فرمت اعداد
export function formatNumber(num: number | bigint, decimals = 2): string {
  const n = typeof num === 'bigint' ? Number(num) : num;
  return new Intl.NumberFormat('fa-IR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(n);
}

// فرمت توکن
export function formatToken(
  value: bigint,
  decimals = 18,
  maxFrac = 4
): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;

  if (fractionalPart === 0n) return integerPart.toString();

  const fractionalStr = fractionalPart
    .toString()
    .padStart(decimals, '0')
    .slice(0, maxFrac);

  return `${integerPart}.${fractionalStr}`.replace(/\.?0+$/, '');
}

// کوتاه کردن آدرس
export function shortAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// اعتبارسنجی آدرس
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// تشخیص Seed Phrase
export function isMnemonic(input: string): boolean {
  const words = input.trim().split(/\s+/);
  return words.length === 12 || words.length === 24;
}

// تشخیص Private Key
export function isPrivateKey(input: string): boolean {
  const hex = input.trim().startsWith('0x') ? input.trim().slice(2) : input.trim();
  return /^[0-9a-fA-F]{64}$/.test(hex);
}

// نوع ورودی
export type InputType = 'mnemonic' | 'privateKey' | 'unknown';

export function detectInputType(input: string): InputType {
  if (!input.trim()) return 'unknown';
  if (isMnemonic(input)) return 'mnemonic';
  if (isPrivateKey(input)) return 'privateKey';
  return 'unknown';
}

// کپی به clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// فرمت تاریخ
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp * 1000));
}
