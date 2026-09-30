/**
 * WebAuthn - اثر انگشت / چهره
 * پشتیبانی: Android 7+, iOS 14+, Chrome, Safari, Firefox
 */

const RP_NAME = 'ARV Super DApp';
const USER_PREFIX = 'arv_user_';
const CRED_KEY_PREFIX = 'arv_cred_';

export interface BiometricCredential {
  id: string;
  walletId: string;
  createdAt: number;
}

function bufToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlToBuf(b64url: string): ArrayBuffer {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

export async function isBiometricAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;

  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export async function registerBiometric(
  walletId: string,
  userName: string
): Promise<BiometricCredential> {
  if (!(await isBiometricAvailable())) {
    throw new Error('دستگاه شما از اثر انگشت پشتیبانی نمی‌کند');
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));

  const credential = (await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: RP_NAME, id: window.location.hostname },
      user: {
        id: userId,
        name: `${USER_PREFIX}${walletId}`,
        displayName: userName,
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },   // ES256
        { type: 'public-key', alg: -257 }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    },
  })) as PublicKeyCredential;

  if (!credential) throw new Error('ثبت اثر انگشت ناموفق بود');

  const credId = bufToBase64Url(credential.rawId);

  const data: BiometricCredential = {
    id: credId,
    walletId,
    createdAt: Date.now(),
  };

  localStorage.setItem(`${CRED_KEY_PREFIX}${walletId}`, JSON.stringify(data));

  return data;
}

export async function verifyBiometric(
  walletId: string
): Promise<boolean> {
  const stored = localStorage.getItem(`${CRED_KEY_PREFIX}${walletId}`);
  if (!stored) throw new Error('اثر انگشت ثبت نشده است');

  const data: BiometricCredential = JSON.parse(stored);
  const challenge = crypto.getRandomValues(new Uint8Array(32));

  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{
          id: base64UrlToBuf(data.id),
          type: 'public-key',
          transports: ['internal'],
        }],
        userVerification: 'required',
        timeout: 60000,
      },
    });

    return !!assertion;
  } catch {
    return false;
  }
}

export function hasBiometric(walletId: string): boolean {
  return !!localStorage.getItem(`${CRED_KEY_PREFIX}${walletId}`);
}

export function removeBiometric(walletId: string): void {
  localStorage.removeItem(`${CRED_KEY_PREFIX}${walletId}`);
}
