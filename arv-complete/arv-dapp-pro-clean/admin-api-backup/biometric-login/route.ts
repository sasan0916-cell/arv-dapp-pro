import {
  SESSION_COOKIE, SESSION_TTL, createToken, hasDevice, json, sameOrigin, setCookie,
} from '@/lib/server/admin-auth';

// اثر انگشت روی گوشی تأیید شده؛ سرور فقط وقتی نشست می‌دهد که این دستگاه قبلاً با رمز مطمئن شده باشد
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403);
  if (!hasDevice(req)) return json({ error: 'device_not_trusted' }, 401);
  const headers = new Headers();
  headers.append('Set-Cookie', setCookie(SESSION_COOKIE, createToken('session', SESSION_TTL), SESSION_TTL));
  return json({ ok: true }, 200, headers);
}
