import {
  DEVICE_COOKIE, DEVICE_TTL, createToken, isAdminRequest, json, sameOrigin, setCookie,
} from '@/lib/server/admin-auth';

// بعد از ورود با رمز، این دستگاه را برای ورود با اثر انگشت «مطمئن» می‌کند
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403);
  if (!isAdminRequest(req)) return json({ error: 'unauthorized' }, 401);
  const headers = new Headers();
  headers.append('Set-Cookie', setCookie(DEVICE_COOKIE, createToken('device', DEVICE_TTL), DEVICE_TTL));
  return json({ ok: true }, 200, headers);
}
