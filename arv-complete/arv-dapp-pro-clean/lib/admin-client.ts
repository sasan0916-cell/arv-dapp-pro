// توابع کلاینت برای ارتباط با API ورود مدیر
export interface AdminSessionInfo {
  admin: boolean;
  device: boolean;
  configured: boolean;
}

const EVENT = 'arv-admin-changed';
const EMPTY: AdminSessionInfo = { admin: false, device: false, configured: false };

let cache: { at: number; promise: Promise<AdminSessionInfo> } | null = null;

export function fetchAdminSession(): Promise<AdminSessionInfo> {
  if (cache && Date.now() - cache.at < 3000) return cache.promise;
  const promise = fetch('/api/admin/session', { credentials: 'same-origin', cache: 'no-store' })
    .then((r) => (r.ok ? (r.json() as Promise<AdminSessionInfo>) : EMPTY))
    .catch(() => EMPTY);
  cache = { at: Date.now(), promise };
  return promise;
}

export function notifyAdminChanged(): void {
  cache = null;
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT));
}

export function onAdminChanged(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

async function post(path: string, body?: unknown) {
  try {
    const r = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin',
      cache: 'no-store',
    });
    let data: any = {};
    try {
      data = await r.json();
    } catch {}
    return { ok: r.ok, status: r.status, data };
  } catch {
    return { ok: false, status: 0, data: {} as any };
  }
}

export async function loginAdmin(password: string) {
  const res = await post('/api/admin/login', { password });
  if (res.ok) notifyAdminChanged();
  return res;
}

export async function loginAdminWithDevice() {
  const res = await post('/api/admin/biometric-login');
  if (res.ok) notifyAdminChanged();
  return res;
}

export function registerAdminDevice() {
  return post('/api/admin/device');
}

export async function logoutAdmin(forget = false) {
  const res = await post('/api/admin/logout', { forget });
  notifyAdminChanged();
  return res;
}
