/**
 * سرویس Storage
 * نکته: از localStorage استفاده می‌کنیم حتی روی APK
 * چون Capacitor Preferences روی WebView اندروید کند/گیر می‌کنه
 */

export async function storageSet(key: string, value: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error('storageSet failed:', e);
  }
}

export async function storageGet(key: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function storageRemove(key: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

export async function storageHas(key: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}
