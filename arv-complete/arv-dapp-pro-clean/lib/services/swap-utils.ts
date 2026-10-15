import { ethers } from 'ethers';

export interface PriceImpactInfo {
  impactPercent: number;
  level: 'safe' | 'warning' | 'danger' | 'blocked';
  message: string;
  color: string;
}

export function calculatePriceImpact(
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint,
  fromDecimals: number = 18,
  toDecimals: number = 18
): PriceImpactInfo {
  try {
    const amountInNum = Number(ethers.formatUnits(amountIn, fromDecimals));
    const reserveInNum = Number(ethers.formatUnits(reserveIn, fromDecimals));

    if (amountInNum === 0 || reserveInNum === 0) {
      return { impactPercent: 0, level: 'safe', message: '', color: 'text-green-400' };
    }

    // فرمول AMM: با کارمزد 0.3%
    const amountInWithFee = amountInNum * 0.997;
    const impactPercent = (amountInWithFee / (reserveInNum + amountInWithFee)) * 100;

    if (impactPercent < 1) {
      return { impactPercent, level: 'safe', message: 'تأثیر قیمت: ' + impactPercent.toFixed(2) + '%', color: 'text-green-400' };
    }
    if (impactPercent < 5) {
      return { impactPercent, level: 'warning', message: 'هشدار: تأثیر قیمت ' + impactPercent.toFixed(2) + '% — قیمت کمی تغییر می‌کند', color: 'text-yellow-400' };
    }
    if (impactPercent < 15) {
      return { impactPercent, level: 'danger', message: 'توجه: تأثیر قیمت ' + impactPercent.toFixed(2) + '% — قیمت به‌شدت تغییر می‌کند!', color: 'text-orange-400' };
    }
    return { impactPercent, level: 'blocked', message: 'خطر: تأثیر قیمت ' + impactPercent.toFixed(2) + '% — سواپ مسدود شد', color: 'text-red-400' };
  } catch {
    return { impactPercent: 0, level: 'safe', message: '', color: 'text-green-400' };
  }
}

export async function estimateSwapGas(
  provider: ethers.JsonRpcProvider
): Promise<{ gasLimit: bigint; gasPrice: bigint; totalBNB: string; totalUSD: number } | null> {
  try {
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits('5', 'gwei');
    const gasLimit = 200000n;
    const total = gasLimit * gasPrice;
    const totalBNB = ethers.formatEther(total);

    let bnbPrice = 600;
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
      const data = await res.json();
      bnbPrice = data?.binancecoin?.usd || 600;
    } catch {}

    const totalUSD = Number(totalBNB) * bnbPrice;

    return { gasLimit, gasPrice, totalBNB: Number(totalBNB).toFixed(6), totalUSD };
  } catch {
    return null;
  }
}
