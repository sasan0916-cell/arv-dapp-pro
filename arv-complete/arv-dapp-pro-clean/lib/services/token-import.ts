import { ethers } from 'ethers';

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
];

export interface ImportedToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  importedAt: number;
}

const STORAGE_KEY = 'arv_imported_tokens';

const RPC_URLS: Record<number, string> = {
  56: 'https://bsc-dataseed.binance.org/',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
};

/**
 * خواندن اطلاعات توکن از قرارداد BEP-20
 */
export async function fetchTokenInfo(
  contractAddress: string,
  chainId: number = 56
): Promise<{ symbol: string; name: string; decimals: number } | null> {
  try {
    if (!ethers.isAddress(contractAddress)) {
      throw new Error('آدرس قرارداد معتبر نیست');
    }
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId], chainId);
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

    const [symbol, name, decimals] = await Promise.all([
      contract.symbol(),
      contract.name(),
      contract.decimals(),
    ]);

    return { symbol, name, decimals: Number(decimals) };
  } catch (e) {
    console.error('fetchTokenInfo error:', e);
    return null;
  }
}

/**
 * ذخیره توکن‌های import شده
 */
export function saveImportedTokens(tokens: ImportedToken[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

/**
 * خواندن توکن‌های import شده
 */
export function loadImportedTokens(): ImportedToken[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ImportedToken[];
  } catch {
    return [];
  }
}

/**
 * افزودن توکن جدید
 */
export function addImportedToken(token: ImportedToken): ImportedToken[] {
  const existing = loadImportedTokens();
  // جلوگیری از تکرار
  if (existing.some((t) => t.address.toLowerCase() === token.address.toLowerCase())) {
    return existing;
  }
  const next = [...existing, token];
  saveImportedTokens(next);
  return next;
}

/**
 * حذف توکن
 */
export function removeImportedToken(address: string): ImportedToken[] {
  const existing = loadImportedTokens();
  const next = existing.filter((t) => t.address.toLowerCase() !== address.toLowerCase());
  saveImportedTokens(next);
  return next;
}
