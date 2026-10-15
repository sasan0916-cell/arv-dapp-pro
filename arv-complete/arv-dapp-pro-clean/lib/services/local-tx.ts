export type LocalTxType = 'swap' | 'approval' | 'liquidity-add' | 'liquidity-remove' | 'transfer';

export interface LocalTxRecord {
  hash: string;
  wallet: string;
  type: LocalTxType;
  chainId: number;
  createdAt: number;
  label?: string;
  approvalHash?: string;
}

const KEY = 'arv_local_tx_history_v1';

export function saveLocalTx(record: LocalTxRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const current = JSON.parse(localStorage.getItem(KEY) || '[]') as LocalTxRecord[];
    const next = [record, ...current.filter((x) => x.hash !== record.hash)].slice(0, 100);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export function getLocalTxHistory(wallet?: string): LocalTxRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = JSON.parse(localStorage.getItem(KEY) || '[]') as LocalTxRecord[];
    if (!wallet) return current;
    return current.filter((x) => x.wallet.toLowerCase() === wallet.toLowerCase());
  } catch {
    return [];
  }
}
