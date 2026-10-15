import { ethers, Contract, JsonRpcProvider, Wallet } from 'ethers';
import { ARV_CONFIG } from '../arv-config';
import ARV_ABI from '../abi/arv-token.json';

// ===== Provider =====
let _provider: JsonRpcProvider | null = null;

export function getProvider(): JsonRpcProvider {
  if (!_provider) {
    _provider = new JsonRpcProvider(ARV_CONFIG.network.rpcUrl, {
      chainId: ARV_CONFIG.network.chainId,
      name: ARV_CONFIG.network.name,
    });
  }
  return _provider;
}

// ===== قرارداد (فقط خواندنی) =====
export function getReadOnlyContract(): Contract {
  return new Contract(
    ARV_CONFIG.token.address,
    ARV_ABI,
    getProvider()
  );
}

// ===== قرارداد با امضاکننده (برای ارسال) =====
export function getSignedContract(privateKey: string): Contract {
  const provider = getProvider();
  const wallet = new Wallet(privateKey, provider);
  return new Contract(ARV_CONFIG.token.address, ARV_ABI, wallet);
}

// ===== موجودی ARV =====
export async function getARVBalance(address: string): Promise<bigint> {
  const contract = getReadOnlyContract();
  return (await contract.balanceOf(address)) as bigint;
}

// ===== موجودی BNB (برای کارمزد) =====
export async function getBNBBalance(address: string): Promise<bigint> {
  const provider = getProvider();
  return await provider.getBalance(address);
}

// ===== اطلاعات توکن =====
export async function getTokenInfo(): Promise<{
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}> {
  const contract = getReadOnlyContract();
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    contract.name() as Promise<string>,
    contract.symbol() as Promise<string>,
    contract.decimals() as Promise<bigint>,
    contract.totalSupply() as Promise<bigint>,
  ]);
  return {
    name,
    symbol,
    decimals: Number(decimals),
    totalSupply,
  };
}

// ===== ارسال ARV =====
export async function sendARV(
  privateKey: string,
  to: string,
  amount: string, // مقدار به صورت رشته (مثلاً "100.5")
  decimals = 18
): Promise<{ hash: string; wait: () => Promise<any> }> {
  if (!ethers.isAddress(to)) {
    throw new Error('آدرس مقصد نامعتبر است');
  }

  const contract = getSignedContract(privateKey);
  const value = ethers.parseUnits(amount, decimals);

  // چک موجودی
  const from = new Wallet(privateKey).address;
  const balance = await getARVBalance(from);
  if (balance < value) {
    throw new Error('موجودی کافی نیست');
  }

  const tx = await contract.transfer(to, value);
  return {
    hash: tx.hash,
    wait: () => tx.wait(),
  };
}

// ===== تخمین کارمزد =====
export async function estimateGas(
  privateKey: string,
  to: string,
  amount: string,
  decimals = 18
): Promise<bigint> {
  const contract = getSignedContract(privateKey);
  const value = ethers.parseUnits(amount, decimals);
  return await contract.transfer.estimateGas(to, value);
}

// ===== تاریخچه تراکنش‌ها (از BscScan API) =====
export interface TxHistoryItem {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  type: 'send' | 'receive';
}

export async function getTxHistory(
  address: string,
  limit = 20
): Promise<TxHistoryItem[]> {
  // استفاده از BscScan Testnet API
  const apiKey = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || '';
  const url = `${ARV_CONFIG.network.explorer}/api?module=account&action=tokentx&contractaddress=${ARV_CONFIG.token.address}&address=${address}&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== '1') return [];

    const addressLower = address.toLowerCase();
    return data.result.map((tx: any) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      timestamp: parseInt(tx.timeStamp),
      type: tx.from.toLowerCase() === addressLower ? 'send' : 'receive',
    }));
  } catch {
    return [];
  }
}

// ===== لینک BscScan =====
export function getBscScanTxUrl(hash: string): string {
  return `${ARV_CONFIG.network.explorer}/tx/${hash}`;
}

export function getBscScanAddressUrl(address: string): string {
  return `${ARV_CONFIG.network.explorer}/address/${address}`;
}
