import { DEVICE_COOKIE, SESSION_COOKIE, clearCookie, json, sameOrigin } from '@/lib/server/admin-auth';

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403);
  let forget = false;
  try {
    forget = (await req.json())?.forget === true;
  } catch {}
  const headers = new Headers();
  headers.append('Set-Cookie', clearCookie(SESSION_COOKIE));
  if (forget) headers.append('Set-Cookie', clearCookie(DEVICE_COOKIE));
  return json({ ok: true }, 200, headers);
}
