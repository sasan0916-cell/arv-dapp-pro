/**
 * سرویس BscScan برای دریافت تاریخچه تراکنش‌ها
 * API Key از .env.local خونده می‌شود
 */

const BSCSCAN_API_KEY = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || 'NKMB2ZQ5S5F4GKN1JTQHHP1H7HT2QUEUIH';
const BSCSCAN_API = 'https://api.bscscan.com/api';

export interface BscTransaction {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  confirmations: string;
}

export interface BscTokenTransfer {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  confirmations: string;
}

export interface NormalizedTx {
  hash: string;
  type: 'send' | 'receive' | 'swap' | 'approve' | 'contract' | 'unknown';
  status: 'success' | 'failed' | 'pending';
  from: string;
  to: string;
  value: string;
  valueUSD?: number;
  symbol: string;
  tokenSymbol?: string;
  tokenName?: string;
  tokenDecimal?: number;
  timestamp: number;
  blockNumber: number;
  gasUsed?: string;
  gasPrice?: string;
  isError: boolean;
}

/**
 * دریافت تراکنش‌های BNB
 */
export async function fetchBNBTransactions(
  address: string,
  limit: number = 50
): Promise<NormalizedTx[]> {
  try {
    const url = `${BSCSCAN_API}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${BSCSCAN_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== '1' || !Array.isArray(data.result)) {
      return [];
    }

    return (data.result as BscTransaction[]).map((tx) => normalizeTx(tx, address));
  } catch (e) {
    console.error('fetchBNBTransactions error:', e);
    return [];
  }
}

/**
 * دریافت انتقال توکن‌های ERC-20
 */
export async function fetchTokenTransfers(
  address: string,
  limit: number = 50
): Promise<NormalizedTx[]> {
  try {
    const url = `${BSCSCAN_API}?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${BSCSCAN_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== '1' || !Array.isArray(data.result)) {
      return [];
    }

    return (data.result as BscTokenTransfer[]).map((tx) => normalizeTokenTx(tx, address));
  } catch (e) {
    console.error('fetchTokenTransfers error:', e);
    return [];
  }
}

/**
 * نرمال‌سازی تراکنش BNB
 */
function normalizeTx(tx: BscTransaction, userAddress: string): NormalizedTx {
  const user = userAddress.toLowerCase();
  const from = tx.from.toLowerCase();
  const to = tx.to?.toLowerCase() || '';
  const isError = tx.isError === '1';
  const status: 'success' | 'failed' = isError ? 'failed' : 'success';

  // تعیین نوع
  let type: NormalizedTx['type'] = 'unknown';
  if (!tx.input || tx.input === '0x') {
    if (from === user) type = 'send';
    else if (to === user) type = 'receive';
  } else if (tx.input.startsWith('0x095ea7b3')) {
    type = 'approve';
  } else if (tx.input.startsWith('0x38ed1739') || tx.input.startsWith('0x7ff36ab5') || tx.input.startsWith('0x18cbafe5')) {
    type = 'swap';
  } else {
    type = 'contract';
  }

  return {
    hash: tx.hash,
    type,
    status,
    from: tx.from,
    to: tx.to,
    value: tx.value,
    symbol: 'BNB',
    timestamp: parseInt(tx.timeStamp) * 1000,
    blockNumber: parseInt(tx.blockNumber),
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice,
    isError,
  };
}

/**
 * نرمال‌سازی انتقال توکن
 */
function normalizeTokenTx(tx: BscTokenTransfer, userAddress: string): NormalizedTx {
  const user = userAddress.toLowerCase();
  const from = tx.from.toLowerCase();
  const to = tx.to.toLowerCase();

  let type: NormalizedTx['type'] = 'unknown';
  if (from === user) type = 'send';
  else if (to === user) type = 'receive';

  return {
    hash: tx.hash,
    type,
    status: 'success',
    from: tx.from,
    to: tx.to,
    value: tx.value,
    symbol: tx.tokenSymbol || 'TOKEN',
    tokenSymbol: tx.tokenSymbol,
    tokenName: tx.tokenName,
    tokenDecimal: parseInt(tx.tokenDecimal || '18'),
    timestamp: parseInt(tx.timeStamp) * 1000,
    blockNumber: parseInt(tx.blockNumber),
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice,
    isError: false,
  };
}

/**
 * ترکیب و مرتب‌سازی همه تراکنش‌ها
 */
export async function fetchAllTransactions(address: string): Promise<NormalizedTx[]> {
  const [bnbTxs, tokenTxs] = await Promise.all([
    fetchBNBTransactions(address, 50),
    fetchTokenTransfers(address, 50),
  ]);

  const all = [...bnbTxs, ...tokenTxs];
  // حذف تکراری‌ها (بر اساس hash + symbol)
  const seen = new Set<string>();
  const unique = all.filter((tx) => {
    const key = `${tx.hash}-${tx.symbol}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // مرتب‌سازی از جدید به قدیم
  unique.sort((a, b) => b.timestamp - a.timestamp);

  return unique;
}

/**
 * فرمت زمان
 */
export function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const now = Date.now();
  const diff = now - ts;

  if (diff < 60000) return 'همین الان';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} دقیقه پیش`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ساعت پیش`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} روز پیش`;

  return date.toLocaleDateString('fa-IR');
}
