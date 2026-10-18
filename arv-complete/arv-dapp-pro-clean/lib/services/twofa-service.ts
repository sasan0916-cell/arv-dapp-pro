import { generateSecret, verify, generateURI } from 'otplib';

const STORAGE_PREFIX = 'arv_2fa_';

export function generate2FASecret(): string {
  return generateSecret();
}

export function get2FAUri(secret: string, emailOrName: string = 'ARV User'): string {
  return generateURI({
    issuer: 'ARV Super DApp',
    label: emailOrName,
    secret,
  });
}

export async function verify2FACode(secret: string, token: string): Promise<boolean> {
  try {
    const result = await verify({ 
      secret, 
      token, 
      epochTolerance: 30 // ±30 ثانیه
    } as any);
    return result.valid === true; // ✅ تضمین معتبر بودن
  } catch {
    return false;
  }
}

export function save2FASecret(walletId: string, secret: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_PREFIX}${walletId}`, secret);
  }
}

export function get2FASecret(walletId: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`${STORAGE_PREFIX}${walletId}`);
}

export function remove2FA(walletId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${STORAGE_PREFIX}${walletId}`);
  }
}

export function is2FAEnabled(walletId: string): boolean {
  return !!get2FASecret(walletId);
}
