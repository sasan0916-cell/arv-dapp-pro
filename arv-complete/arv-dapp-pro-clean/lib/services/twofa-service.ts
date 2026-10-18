/**
 * lib/services/twofa-service.ts
 * 
 * 🔐 سرویس احراز هویت دو مرحله‌ای (2FA / TOTP)
 * سازگار با otplib نسخه ۱۳ به بالا
 */

import { generateSecret, verify, generateURI } from 'otplib';

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
 * (با تحمل خطای ۳۰ ثانیه برای اختلاف ساعت دستگاه‌ها)
 */
export async function verify2FACode(secret: string, token: string): Promise<boolean> {
  try {
    const result = await verify({
      token: token.trim(),
      secret: secret.trim(),
      epochTolerance: 30 // ✅ جایگزین window در نسخه ۱۳
    } as any); // استفاده از any برای جلوگیری از خطای تایپ در صورت تفاوت در نسخه‌ها
    return result.valid;
  } catch (err) {
    console.error('2FA verify error:', err);
    return false;
  }
}

/**
 * ذخیره کلید مخفی
 */
export function save2FASecret(walletId: string, secret: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_PREFIX}${walletId}`, secret);
  }
}

/**
 * خواندن کلید مخفی
 */
export function get2FASecret(walletId: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`${STORAGE_PREFIX}${walletId}`);
}

/**
 * حذف 2FA
 */
export function remove2FA(walletId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${STORAGE_PREFIX}${walletId}`);
  }
}

/**
 * بررسی فعال بودن 2FA
 */
export function is2FAEnabled(walletId: string): boolean {
  return !!get2FASecret(walletId);
}
