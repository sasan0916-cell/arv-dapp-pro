import {
  SESSION_COOKIE, SESSION_TTL, authConfigured, checkPassword, clearFailures,
  clientIp, createToken, hasDevice, isLimited, json, recordFailure, sameOrigin, setCookie,
} from '@/lib/server/admin-auth';

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403);
  if (!authConfigured()) return json({ error: 'not_configured' }, 503);

  const ip = clientIp(req);
  if (isLimited(ip)) return json({ error: 'rate_limited' }, 429);

  let password = '';
  try {
    const body = await req.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {}

  if (!checkPassword(password)) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 600));
    return json({ error: 'invalid' }, 401);
  }

  clearFailures(ip);
  const headers = new Headers();
  headers.append('Set-Cookie', setCookie(SESSION_COOKIE, createToken('session', SESSION_TTL), SESSION_TTL));
  return json({ ok: true, device: hasDevice(req) }, 200, headers);
}
