import { ethers, Contract, JsonRpcProvider, Wallet, Signer } from 'ethers';

export type DexNetwork = 56 | 97;

export const PANCAKE_V2 = {
  56: {
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E' as `0x${string}`,
    wrappedNative: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as `0x${string}`,
  },
  97: {
    router: '0xB1330C8822cBcce124b6b94aA89e2C026F1B7d4e' as `0x${string}`,
    wrappedNative: '0xae13d989dac2f0debff460ac112a837c89baa7cd' as `0x${string}`,
  },
} as const;

export const PANCAKE_V2_FACTORY: Record<DexNetwork, string> = {
  56: '0xCA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  97: '0xc13Eb18BAa7e6FF4cB7862a7BdE0425B42d549e8', // ARVFactory
};

const ERC20_ABI = [
  'function approve(address spender,uint256 amount) returns (bool)',
  'function allowance(address owner,address spender) view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

const ROUTER_ABI = [
  'function getAmountsOut(uint256 amountIn,address[] calldata path) external view returns (uint256[] memory amounts)',
  'function getAmountsIn(uint256 amountOut,address[] calldata path) external view returns (uint256[] memory amounts)',
  'function swapExactETHForTokens(uint256 amountOutMin,address[] calldata path,address to,uint256 deadline) external payable returns (uint256[] memory amounts)',
  'function swapExactTokensForETH(uint256 amountIn,uint256 amountOutMin,address[] calldata path,address to,uint256 deadline) external returns (uint256[] memory amounts)',
  'function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] calldata path,address to,uint256 deadline) external returns (uint256[] memory amounts)',
  'function addLiquidity(address tokenA,address tokenB,uint256 amountADesired,uint256 amountBDesired,uint256 amountAMin,uint256 amountBMin,address to,uint256 deadline) external returns (uint256 amountA,uint256 amountB,uint256 liquidity)',
  'function addLiquidityETH(address token,uint256 amountTokenDesired,uint256 amountTokenMin,uint256 amountETHMin,address to,uint256 deadline) external payable returns (uint256 amountToken,uint256 amountETH,uint256 liquidity)',
];

export function getDexProvider(chainId: DexNetwork): JsonRpcProvider {
  const rpc = chainId === 56 ? 'https://bsc-dataseed.binance.org/' : 'https://data-seed-prebsc-1-s1.binance.org:8545/';
  const name = chainId === 56 ? 'BSC Mainnet' : 'BSC Testnet';
  return new JsonRpcProvider(rpc, { chainId, name });
}

export function getPath(from: string, to: string, chainId: DexNetwork): string[] {
  const { wrappedNative } = PANCAKE_V2[chainId];
  const a = from.toLowerCase();
  const b = to.toLowerCase();
  if (a === b) throw new Error('مبدأ و مقصد نباید یکسان باشند');
  if (a === 'native') return [wrappedNative, to];
  if (b === 'native') return [from, wrappedNative];
  return [from, to];
}

const STABLES: Record<DexNetwork, string[]> = {
  56: [
    '0x55d398326f99059fF775485246999027B3197955',
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  ],
  97: [],
};

function candidatePaths(from: string, to: string, chainId: DexNetwork): string[][] {
  const { wrappedNative } = PANCAKE_V2[chainId];
  const a = from.toLowerCase();
  const b = to.toLowerCase();
  if (a === b) throw new Error('مبدأ و مقصد نباید یکسان باشند');
  const fromNative = a === 'native';
  const toNative = b === 'native';
  const fa = fromNative ? wrappedNative : from;
  const tb = toNative ? wrappedNative : to;
  const paths: string[][] = [[fa, tb]];
  if (fa.toLowerCase() !== wrappedNative.toLowerCase() && tb.toLowerCase() !== wrappedNative.toLowerCase()) {
    paths.push([fa, wrappedNative, tb]);
    for (const stable of STABLES[chainId]) paths.push([fa, stable, tb]);
  }
  return paths.filter((path, i, all) => all.findIndex(p => p.map(x => x.toLowerCase()).join('/') === path.map(x => x.toLowerCase()).join('/')) === i);
}

export function isNative(symbol: string): boolean {
  return symbol === 'BNB' || symbol === 'tBNB';
}

export async function getQuote(params: {
  chainId: DexNetwork;
  fromAddress: string;
  toAddress: string;
  amountIn: bigint;
}): Promise<{ amountOut: bigint; path: string[]; reserveIn: bigint; reserveOut: bigint }> {
  const { chainId, fromAddress, toAddress, amountIn } = params;
  const router = new Contract(PANCAKE_V2[chainId].router, ROUTER_ABI, getDexProvider(chainId));
  let best: { amountOut: bigint; path: string[]; reserveIn: bigint; reserveOut: bigint } | null = null;
  for (const path of candidatePaths(fromAddress, toAddress, chainId)) {
    try {
      const amounts = await router.getAmountsOut(amountIn, path) as bigint[];
      const amountOut = amounts[amounts.length - 1];
      if (!best || amountOut > best.amountOut) {
        // reserves رو جدا می‌گیریم، خطا رو نادیده می‌گیریم
        let reserveIn = 0n;
        let reserveOut = 0n;
        try {
          const reserves = await getReservesSafe(chainId, path[0], path[path.length - 1]);
          if (reserves) {
            reserveIn = reserves[0];
            reserveOut = reserves[1];
          }
        } catch {}
        best = { amountOut, path, reserveIn, reserveOut };
      }
    } catch {
      // Pair/path has no usable liquidity; try the next route.
    }
  }
  if (!best) throw new Error('برای این جفت مسیر و نقدینگی قابل معامله پیدا نشد');
  return best;
}

// گرفتن reserves از Pair - با timeout و خطای امن
export async function getReservesSafe(chainId: DexNetwork, tokenA: string, tokenB: string): Promise<[bigint, bigint] | null> {
  try {
    const pair = await Promise.race([
      getPairAddress(chainId, tokenA, tokenB),
      new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]);
    if (!pair || pair === '0x0000000000000000000000000000000000000000') {
      return null;
    }
    const pairContract = new Contract(pair, [
      'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
      'function token0() view returns (address)',
    ], getDexProvider(chainId));
    const [r0, r1] = await Promise.race([
      pairContract.getReserves() as Promise<[bigint, bigint, number]>,
      new Promise<[bigint, bigint, number]>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]);
    const t0 = await pairContract.token0() as string;
    const a = tokenA.toLowerCase();
    if (a === t0.toLowerCase()) return [BigInt(r0), BigInt(r1)];
    return [BigInt(r1), BigInt(r0)];
  } catch {
    return null;
  }
}

export async function getTokenBalance(chainId: DexNetwork, tokenAddress: string, owner: string): Promise<bigint> {
  const provider = getDexProvider(chainId);
  return await new Contract(tokenAddress, ERC20_ABI, provider).balanceOf(owner) as bigint;
}

export async function getNativeBalance(chainId: DexNetwork, owner: string): Promise<bigint> {
  return getDexProvider(chainId).getBalance(owner);
}

export async function ensureAllowance(
  signer: Signer,
  tokenAddress: string,
  amount: bigint,
): Promise<string | null> {
  const chainId = Number((await signer.provider!.getNetwork()).chainId) as DexNetwork;
  const routerAddress = PANCAKE_V2[chainId]?.router;
  if (!routerAddress) throw new Error('شبکه DEX پشتیبانی نمی‌شود');
  const token = new Contract(tokenAddress, ERC20_ABI, signer);
  const allowance = await token.allowance(await signer.getAddress(), routerAddress) as bigint;
  if (allowance >= amount) return null;
  const tx = await token.approve(routerAddress, amount);
  await tx.wait();
  return tx.hash;
}

export async function executeSwapWithSigner(params: {
  signer: Signer;
  chainId: DexNetwork;
  fromAddress: string;
  toAddress: string;
  amountIn: bigint;
  amountOutMin: bigint;
  recipient: string;
  path?: string[];
}): Promise<{ hash: string; approvalHash: string | null; path: string[] }> {
  const { signer, chainId, fromAddress, toAddress, amountIn, amountOutMin, recipient } = params;
  const network = await signer.provider?.getNetwork();
  if (!network || Number(network.chainId) !== chainId) {
    throw new Error('کیف پول روی شبکه صحیح قرار ندارد');
  }
  const router = new Contract(PANCAKE_V2[chainId].router, ROUTER_ABI, signer);
  const path = params.path ?? getPath(fromAddress, toAddress, chainId);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  let approvalHash: string | null = null;

  if (fromAddress !== 'native') {
    approvalHash = await ensureAllowance(signer, fromAddress, amountIn);
  }

  let tx;
  if (fromAddress === 'native') {
    tx = await router.swapExactETHForTokens(amountOutMin, path, recipient, deadline, { value: amountIn });
  } else if (toAddress === 'native') {
    tx = await router.swapExactTokensForETH(amountIn, amountOutMin, path, recipient, deadline);
  } else {
    tx = await router.swapExactTokensForTokens(amountIn, amountOutMin, path, recipient, deadline);
  }
  await tx.wait();
  return { hash: tx.hash, approvalHash, path };
}

export async function executeSwap(params: {
  privateKey: string;
  chainId: DexNetwork;
  fromAddress: string;
  toAddress: string;
  amountIn: bigint;
  amountOutMin: bigint;
  recipient: string;
  path?: string[];
}): Promise<{ hash: string; approvalHash: string | null; path: string[] }> {
  const provider = getDexProvider(params.chainId);
  const signer = new Wallet(params.privateKey, provider);
  return executeSwapWithSigner({ signer, ...params });
}

export async function getPairAddress(chainId: DexNetwork, tokenA: string, tokenB: string): Promise<string> {
  const factory = new Contract(PANCAKE_V2_FACTORY[chainId], [
    'function getPair(address tokenA,address tokenB) external view returns (address pair)',
  ], getDexProvider(chainId));
  return await factory.getPair(tokenA, tokenB) as string;
}

export async function getLpBalance(chainId: DexNetwork, pairAddress: string, owner: string): Promise<bigint> {
  return await new Contract(pairAddress, ['function balanceOf(address owner) view returns (uint256)'], getDexProvider(chainId)).balanceOf(owner) as bigint;
}

export async function getLpTotalSupply(chainId: DexNetwork, pairAddress: string): Promise<bigint> {
  return await new Contract(pairAddress, ['function totalSupply() view returns (uint256)'], getDexProvider(chainId)).totalSupply() as bigint;
}

export async function removeLiquidityETHWithSigner(params: {
  signer: Signer;
  token: string;
  liquidity: bigint;
  amountTokenMin: bigint;
  amountETHMin: bigint;
  recipient: string;
}): Promise<string> {
  const provider = params.signer.provider;
  const network = await provider?.getNetwork();
  const chainId = Number(network?.chainId ?? 0) as DexNetwork;
  if (!network || (chainId !== 56 && chainId !== 97)) throw new Error('Liquidity removal is available on BSC Mainnet and Testnet');
  const pair = await getPairAddress(chainId, params.token, PANCAKE_V2[chainId].wrappedNative);
  if (!pair || pair === ethers.ZeroAddress) throw new Error('No BNB liquidity pair exists for this token');
  const pairContract = new Contract(pair, [
    'function approve(address spender,uint256 amount) returns (bool)',
    'function allowance(address owner,address spender) view returns (uint256)',
  ], params.signer);
  const router = PANCAKE_V2[chainId].router;
  const allowance = await pairContract.allowance(params.recipient, router) as bigint;
  if (allowance < params.liquidity) {
    const approval = await pairContract.approve(router, params.liquidity);
    await approval.wait();
  }
  const contract = new Contract(router, [
    'function removeLiquidityETH(address token,uint256 liquidity,uint256 amountTokenMin,uint256 amountETHMin,address to,uint256 deadline) external returns (uint256 amountToken,uint256 amountETH)',
  ], params.signer);
  const deadline = Math.floor(Date.now() / 1000) + 1200;
  const tx = await contract.removeLiquidityETH(
    params.token,
    params.liquidity,
    params.amountTokenMin,
    params.amountETHMin,
    params.recipient,
    deadline,
  );
  await tx.wait();
  return tx.hash;
}

export function calculateMinOut(amountOut: bigint, slippagePercent: number): bigint {
  if (!Number.isFinite(slippagePercent) || slippagePercent < 0 || slippagePercent > 50) throw new Error('Slippage must be between 0% and 50%');
  const bps = BigInt(Math.round(slippagePercent * 100));
  return amountOut * (10000n - bps) / 10000n;
}
