// احراز هویت مدیر — فقط سمت سرور اجرا می‌شود (هرگز در باندل کلاینت قرار نمی‌گیرد)
import { createHash, createHmac, timingSafeEqual } from 'crypto';

export const SESSION_COOKIE = 'arv_admin_session';
export const DEVICE_COOKIE = 'arv_admin_device';
export const SESSION_TTL = 60 * 60 * 12; // ۱۲ ساعت
export const DEVICE_TTL = 60 * 60 * 24 * 30; // ۳۰ روز

type TokenKind = 'session' | 'device';

function secret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

export function authConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD && !!secret();
}

function sign(data: string, key: string): string {
  return createHmac('sha256', key).update(data).digest('base64url');
}

export function createToken(kind: TokenKind, ttlSec: number): string {
  const key = secret();
  if (!key) throw new Error('ADMIN_SESSION_SECRET is not configured');
  const payload = Buffer.from(
    JSON.stringify({ k: kind, exp: Date.now() + ttlSec * 1000 })
  ).toString('base64url');
  return `${payload}.${sign(`${kind}.${payload}`, key)}`;
}

export function verifyToken(kind: TokenKind, token: string): boolean {
  const key = secret();
  if (!key) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = sign(`${kind}.${payload}`, key);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.k === kind && typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? '';
  if (!expected) return false;
  const a = createHash('sha256').update(input).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

// ===== کوکی‌ها =====
export function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get('cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) {
      try {
        return decodeURIComponent(part.slice(i + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function isAdminRequest(req: Request): boolean {
  const t = readCookie(req, SESSION_COOKIE);
  return !!t && verifyToken('session', t);
}

export function hasDevice(req: Request): boolean {
  const t = readCookie(req, DEVICE_COOKIE);
  return !!t && verifyToken('device', t);
}

export function setCookie(name: string, value: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export function clearCookie(name: string): string {
  return setCookie(name, '', 0);
}

// ===== کمکی‌های پاسخ و امنیت =====
export function json(data: unknown, status = 200, extra?: Headers): Response {
  const headers = new Headers(extra);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { status, headers });
}

// دفاع در برابر CSRF: اگر Origin وجود دارد باید هم‌میزبان باشد
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

// محدودیت تلاش ناموفق (در حافظهٔ هر نمونهٔ سرور؛ لایهٔ کمکی است)
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export function isLimited(ip: string): boolean {
  const rec = attempts.get(ip);
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return rec.count >= MAX_ATTEMPTS;
}

export function recordFailure(ip: string): void {
  const rec = attempts.get(ip);
  if (!rec || Date.now() - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: Date.now() });
  } else {
    rec.count += 1;
  }
}

export function clearFailures(ip: string): void {
  attempts.delete(ip);
}
