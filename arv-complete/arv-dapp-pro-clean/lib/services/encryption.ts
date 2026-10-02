const ALGO = 'AES-GCM';
const KEY_LEN = 256;
const LEGACY_ITERATIONS = 100000; // فرمت قدیمی (۳ بخشی)
const ITERATIONS = 600000; // توصیهٔ OWASP برای PBKDF2-HMAC-SHA256
const FORMAT_V2 = 'v2';
const MIN_ITERATIONS = 100000;
const MAX_ITERATIONS = 5000000;

function bufToBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuf(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const params: Pbkdf2Params = {
    name: 'PBKDF2',
    salt: salt.buffer as ArrayBuffer,
    iterations,
    hash: 'SHA-256',
  };

  return crypto.subtle.deriveKey(
    params,
    passwordKey,
    { name: ALGO, length: KEY_LEN },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(
  plaintext: string,
  password: string
): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt, ITERATIONS);

  const encParams: AesGcmParams = {
    name: ALGO,
    iv: iv.buffer as ArrayBuffer,
  };

  const ciphertext = await crypto.subtle.encrypt(
    encParams,
    key,
    encoder.encode(plaintext)
  );

  return [
    FORMAT_V2,
    String(ITERATIONS),
    bufToBase64(salt.buffer),
    bufToBase64(iv.buffer),
    bufToBase64(ciphertext),
  ].join('.');
}

export async function decrypt(
  encrypted: string,
  password: string
): Promise<string> {
  const parts = encrypted.split('.');
  let iterations = LEGACY_ITERATIONS;
  let saltB64: string | undefined;
  let ivB64: string | undefined;
  let ctB64: string | undefined;

  if (parts[0] === FORMAT_V2 && parts.length === 5) {
    iterations = Number(parts[1]);
    [, , saltB64, ivB64, ctB64] = parts;
  } else if (parts.length === 3) {
    [saltB64, ivB64, ctB64] = parts;
  }

  if (
    !saltB64 || !ivB64 || !ctB64 ||
    !Number.isInteger(iterations) ||
    iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS
  ) {
    throw new Error('فرمت داده رمزنگاری‌شده نامعتبر است');
  }

  const salt = new Uint8Array(base64ToBuf(saltB64));
  const iv = new Uint8Array(base64ToBuf(ivB64));
  const ciphertext = base64ToBuf(ctB64);

  const key = await deriveKey(password, salt, iterations);

  const decParams: AesGcmParams = {
    name: ALGO,
    iv: iv.buffer as ArrayBuffer,
  };

  try {
    const plaintext = await crypto.subtle.decrypt(
      decParams,
      key,
      ciphertext
    );
    return new TextDecoder().decode(plaintext);
  } catch {
    throw new Error('رمز عبور اشتباه است یا داده خراب شده');
  }
}

// داده‌ای که با فرمت قدیمی (۱۰۰ هزار تکرار) ذخیره شده و باید ارتقا یابد
export function isLegacyFormat(encrypted: string): boolean {
  return !encrypted.startsWith(FORMAT_V2 + '.');
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(password));
  return bufToBase64(hash);
}

export function bufferToBase64(buffer: ArrayBuffer): string {
  return bufToBase64(buffer);
}

export function base64ToBuffer(base64: string): ArrayBuffer {
  return base64ToBuf(base64);
}
