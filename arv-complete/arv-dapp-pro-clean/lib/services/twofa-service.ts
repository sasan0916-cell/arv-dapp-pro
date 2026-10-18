/**
 * lib/services/twofa-service.ts
 * 
 * 🔐 سرویس احراز هویت دو مرحله‌ای (2FA / TOTP)
 * این سرویس با استاندارد TOTP کار می‌کنه (سازگار با Google Authenticator و Authy)
 * بر اساس API جدید کتابخانه otplib (نسخه ۱۳)
 */

import { generateSecret, generate, verify, generateURI } from 'otplib';

const STORAGE_PREFIX = 'arv_2fa_';

/**
 * تولید یک کلید مخفی جدید (Secret) برای کاربر
 */
export function generate2FASecret(): string {
  return generateSecret();
}

/**
 * تولید لینک otpauth برای ساخت QR Code
 */
export function get2FAUri(secret: string, emailOrName: string = 'ARV User'): string {
  return generateURI({
    issuer: 'ARV Super DApp',
    label: emailOrName,
    secret,
  });
}

/**
 * بررسی صحت کد ۶ رقمی وارد شده
 * (بازگشتی Promise<boolean>)
 */
export async function verify2FACode(secret: string, token: string): Promise<boolean> {
  try {
    const result = await verify({ secret, token });
    return result.valid;
  } catch {
    return false;
  }
}

/**
 * ذخیره کلید مخفی برای یک کیف پول خاص
 */
export function save2FASecret(walletId: string, secret: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_PREFIX}${walletId}`, secret);
  }
}

/**
 * خواندن کلید مخفی ذخیره شده
 */
export function get2FASecret(walletId: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`${STORAGE_PREFIX}${walletId}`);
}

/**
 * حذف 2FA برای یک کیف پول
 */
export function remove2FA(walletId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${STORAGE_PREFIX}${walletId}`);
  }
}

/**
 * بررسی فعال بودن 2FA برای یک کیف پول
 */
export function is2FAEnabled(walletId: string): boolean {
  return !!get2FASecret(walletId);
}
