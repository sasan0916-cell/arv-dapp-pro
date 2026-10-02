// WebAuthn - اثر انگشت / چهره
const CRED_KEY_PREFIX = 'arv_cred_';
const RP_NAME = 'ARV Super DApp';

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
): Promise<boolean> {
  if (!(await isBiometricAvailable())) return false;
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));

    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: RP_NAME, id: window.location.hostname },
        user: {
          id: userId,
          name: `arv_${walletId}`,
          displayName: userName,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
        attestation: 'none',
      },
    })) as PublicKeyCredential;

    if (!credential) return false;

    const credId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
    localStorage.setItem(
      `${CRED_KEY_PREFIX}${walletId}`,
      JSON.stringify({ id: credId, walletId, createdAt: Date.now() })
    );
    return true;
  } catch {
    return false;
  }
}

export async function verifyBiometric(walletId: string): Promise<boolean> {
  const stored = localStorage.getItem(`${CRED_KEY_PREFIX}${walletId}`);
  if (!stored) return false;

  try {
    const data = JSON.parse(stored);
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const credIdBuf = Uint8Array.from(atob(data.id), (c) => c.charCodeAt(0));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [
          { id: credIdBuf, type: 'public-key', transports: ['internal'] },
        ],
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

export async function enableBiometric(
  walletId: string,
  userName: string
): Promise<boolean> {
  return registerBiometric(walletId, userName);
}

export async function unlockWithBiometric(walletId: string): Promise<boolean> {
  return verifyBiometric(walletId);
}

export function disableBiometric(walletId: string): void {
  removeBiometric(walletId);
}


// ===== اثر انگشت مدیرکل =====
const ADMIN_CRED_KEY = 'arv_admin_biometric';

export function hasAdminBiometric(): boolean {
  try {
    return !!localStorage.getItem(ADMIN_CRED_KEY);
  } catch {
    return false;
  }
}

export function removeAdminBiometric(): void {
  try {
    localStorage.removeItem(ADMIN_CRED_KEY);
  } catch {}
}

// ثبت اثر انگشت مدیر (فقط بعد از ورود موفق با رمز صدا زده شود)
export async function registerAdminBiometric(): Promise<boolean> {
  if (!(await isBiometricAvailable())) return false;
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));

    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: RP_NAME, id: window.location.hostname },
        user: { id: userId, name: 'arv_admin', displayName: 'ARV Admin' },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
        attestation: 'none',
      },
    })) as PublicKeyCredential | null;

    if (!credential) return false;

    const credId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
    localStorage.setItem(
      ADMIN_CRED_KEY,
      JSON.stringify({ id: credId, createdAt: Date.now() })
    );
    return true;
  } catch {
    return false;
  }
}

export async function verifyAdminBiometric(): Promise<boolean> {
  try {
    const stored = localStorage.getItem(ADMIN_CRED_KEY);
    if (!stored) return false;
    const data = JSON.parse(stored);
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const credIdBuf = Uint8Array.from(atob(data.id), (c) => c.charCodeAt(0));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [
          { id: credIdBuf, type: 'public-key', transports: ['internal'] },
        ],
        userVerification: 'required',
        timeout: 60000,
      },
    });
    return !!assertion;
  } catch {
    return false;
  }
}
