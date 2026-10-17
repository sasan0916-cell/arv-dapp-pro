/**
 * ARV LP Rewards Service
 * Connects to ARVLPRewards contract on BSC Testnet
 */
import { ethers } from 'ethers';
import { ARV_CONFIG } from '@/lib/arv-config';

// ============ Config ============
const REWARDS_ADDRESS = '0xAF16ecF0e7C160144D96198BB717d43B6A016A66';
const LP_TOKEN_ADDRESS = '0xa36f98bc817c2862F5b6849A1F58de5052F69c29';
const RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const CHAIN_ID = 97;

// ============ ABIs ============
const REWARDS_ABI = [
  // Views
  'function totalSupply() view returns (uint256)',
  'function rewardRate() view returns (uint256)',
  'function periodFinish() view returns (uint256)',
  'function rewardPerTokenStored() view returns (uint256)',
  'function rewardPerToken() view returns (uint256)',
  'function lastTimeRewardApplicable() view returns (uint256)',
  'function lastUpdateTime() view returns (uint256)',
  'function rewardsDuration() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function earned(address) view returns (uint256)',
  'function rewards(address) view returns (uint256)',
  'function lpToken() view returns (address)',
  'function rewardToken() view returns (address)',
  'function owner() view returns (address)',
  // User actions
  'function stake(uint256 amount)',
  'function withdraw(uint256 amount)',
  'function claimReward()',
  'function exit()',
  // Owner
  'function notifyRewardAmount(uint256 reward)',
];

const LP_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function allowance(address,address) view returns (uint256)',
  'function approve(address,uint256) returns (bool)',
  'function totalSupply() view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

// ============ Helpers ============
function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID, { staticNetwork: true });
}

function getRewardsContract(provider?: ethers.JsonRpcProvider): ethers.Contract {
  return new ethers.Contract(REWARDS_ADDRESS, REWARDS_ABI, provider || getProvider());
}

function getLpContract(provider?: ethers.JsonRpcProvider): ethers.Contract {
  return new ethers.Contract(LP_TOKEN_ADDRESS, LP_ABI, provider || getProvider());
}

function signedRewards(pk: string): ethers.Contract {
  const provider = getProvider();
  const wallet = new ethers.Wallet(pk.startsWith('0x') ? pk : '0x' + pk, provider);
  return new ethers.Contract(REWARDS_ADDRESS, REWARDS_ABI, wallet);
}

function signedLp(pk: string): ethers.Contract {
  const provider = getProvider();
  const wallet = new ethers.Wallet(pk.startsWith('0x') ? pk : '0x' + pk, provider);
  return new ethers.Contract(LP_TOKEN_ADDRESS, LP_ABI, wallet);
}

// ============ Stats ============
export interface RewardsStats {
  totalSupply: string;
  rewardRate: string;
  periodFinish: number;
  rewardPerTokenStored: string;
  rewardsDuration: number;
  contractBalance: string;
  rewardsRemaining: string;
  apy: number;
}

export async function getRewardsStats(): Promise<RewardsStats> {
  const provider = getProvider();
  const rewards = getRewardsContract(provider);
  const lp = getLpContract(provider);

  const [totalSupply, rewardRate, periodFinish, rewardPerTokenStored, rewardsDuration, contractBalance, lpTotalSupply, lpDecimals] =
    await Promise.all([
      rewards.totalSupply(),
      rewards.rewardRate(),
      rewards.periodFinish(),
      rewards.rewardPerTokenStored(),
      rewards.rewardsDuration(),
      rewards.balanceOf(REWARDS_ADDRESS),
      lp.totalSupply(),
      lp.decimals(),
    ]);

  // Rewards remaining = rewardRate * (periodFinish - now)
  const now = Math.floor(Date.now() / 1000);
  const pf = Number(periodFinish);
  const timeLeft = Math.max(0, pf - now);
  const rr = BigInt(rewardRate.toString());
  const rewardsRemaining = rr * BigInt(timeLeft);

  // APY calculation
  // TVL_LP = totalSupply_in_contract * (lpTotalSupply / lpTotalSupply) -- tricky
  // Simplified: rewardsPerYear / TVL * 100
  // rewardsPerYear = rewardRate * 365 days
  // TVL in ARV value = totalSupply * (LP_value_per_token)
  // LP_value_per_token = (2 * ARV_reserve) / lpTotalSupply  (since 50/50 pool)
  // But we don't have ARV reserve easily; use contractBalance as reward pool as a proxy
  // Better: APY = (rewardRate * secondsInYear * ARV_price) / TVL_in_contract
  // Simplified: if totalSupply = 0, APY = 0
  // If we can approximate: APY ≈ (rewardRate * secondsInYear * 1) / totalSupply_in_contract_terms
  // For simplicity: use ARV decimals (both 18)
  let apy = 0;
  try {
    const ts = BigInt(totalSupply.toString());
    if (ts > 0n) {
      const secondsInYear = 365n * 24n * 3600n;
      const rewardsPerYear = rr * secondsInYear;
      // rewardsPerYear and totalSupply both 18 decimals → ratio is dimensionless
      const ratio = Number((rewardsPerYear * 10000n) / ts) / 10000;
      apy = ratio * 100;
    }
  } catch {}

  return {
    totalSupply: ethers.formatUnits(totalSupply, 18),
    rewardRate: rewardRate.toString(),
    periodFinish: pf,
    rewardPerTokenStored: rewardPerTokenStored.toString(),
    rewardsDuration: Number(rewardsDuration),
    contractBalance: ethers.formatUnits(contractBalance, 18),
    rewardsRemaining: ethers.formatUnits(rewardsRemaining, 18),
    apy,
  };
}

// ============ User Info ============
export interface UserStakeInfo {
  staked: string;
  earned: string;
}

export async function getUserStakeInfo(userAddress: string): Promise<UserStakeInfo> {
  if (!ethers.isAddress(userAddress)) {
    return { staked: '0', earned: '0' };
  }

  const provider = getProvider();
  const rewards = getRewardsContract(provider);

  const [staked, earned] = await Promise.all([
    rewards.balanceOf(userAddress),
    rewards.earned(userAddress),
  ]);

  return {
    staked: ethers.formatUnits(staked, 18),
    earned: ethers.formatUnits(earned, 18),
  };
}

// ============ LP Balance / Allowance ============
export async function getLpBalance(userAddress: string): Promise<string> {
  if (!ethers.isAddress(userAddress)) return '0';
  const lp = getLpContract();
  const bal = await lp.balanceOf(userAddress);
  return ethers.formatUnits(bal, 18);
}

export async function getLpAllowance(userAddress: string): Promise<string> {
  if (!ethers.isAddress(userAddress)) return '0';
  const lp = getLpContract();
  const allow = await lp.allowance(userAddress, REWARDS_ADDRESS);
  return ethers.formatUnits(allow, 18);
}

// ============ Actions (signed) ============
export async function approveLp(privateKey: string, amount?: string): Promise<{ hash: string }> {
  const lp = signedLp(privateKey);
  // ✅ امن: فقط به اندازه‌ی مبلغ مشخص (یا حداکثر ۱۰۰ LP اگه مشخص نکرد)
  // برای مقادیر بزرگ، باید کاربر مقدار دقیق رو وارد کنه
  const approveAmount = amount 
    ? ethers.parseUnits(amount, 18)
    : ethers.parseUnits('100', 18);  // fallback: 100 LP
  const tx = await lp.approve(REWARDS_ADDRESS, approveAmount);
  return { hash: tx.hash };
}

export async function stakeLp(privateKey: string, amount: string): Promise<{ hash: string }> {
  const rewards = signedRewards(privateKey);
  const value = ethers.parseUnits(amount, 18);
  const tx = await rewards.stake(value);
  return { hash: tx.hash };
}

export async function withdrawLp(privateKey: string, amount: string): Promise<{ hash: string }> {
  const rewards = signedRewards(privateKey);
  const value = ethers.parseUnits(amount, 18);
  const tx = await rewards.withdraw(value);
  return { hash: tx.hash };
}

export async function claimRewards(privateKey: string): Promise<{ hash: string }> {
  const rewards = signedRewards(privateKey);
  const tx = await rewards.claimReward();
  return { hash: tx.hash };
}

export async function exitAll(privateKey: string): Promise<{ hash: string }> {
  const rewards = signedRewards(privateKey);
  const tx = await rewards.exit();
  return { hash: tx.hash };
}

// ============ Constants export ============
export const REWARDS_CONSTANTS = {
  address: REWARDS_ADDRESS,
  lpToken: LP_TOKEN_ADDRESS,
  chainId: CHAIN_ID,
  explorer: 'https://testnet.bscscan.com',
};
