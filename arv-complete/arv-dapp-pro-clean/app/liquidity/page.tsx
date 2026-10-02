'use client';

import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { CheckCircle2, Droplets, Loader2, Shield, Wallet, Trash2, RefreshCw } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { ARV_CONFIG } from '@/lib/arv-config';
import { getPairAddress, getLpBalance, ensureAllowance, PANCAKE_V2, removeLiquidityETHWithSigner } from '@/lib/services/dex-service';
import { loadWallet } from '@/lib/services/wallet-service';
import { saveLocalTx } from '@/lib/services/local-tx';
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi';
import { useLanguage } from '@/lib/i18n';

const TOKENS = [
  { symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
  { symbol: 'USDC', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18 },
  { symbol: 'CAKE', address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', decimals: 18 },
  { symbol: 'ARV', address: ARV_CONFIG.token.mainnetAddress || '', decimals: 18 },
];

export default function LiquidityPage() {
  const { language } = useLanguage();
  const en = language === 'en';
  const { address: externalAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();
  const [tab, setTab] = useState<'add'|'remove'>('add');
  const [token, setToken] = useState(TOKENS[0].symbol);
  const [tokenAmount, setTokenAmount] = useState('');
  const [bnbAmount, setBnbAmount] = useState('');
  const [lpAmount, setLpAmount] = useState('');
  const [lpBalance, setLpBalance] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [hash, setHash] = useState('');
  const [mode, setMode] = useState<'external'|'internal'>('external');
  const selected = useMemo(() => TOKENS.find(x => x.symbol === token)!, [token]);
  const router = PANCAKE_V2[56].router;
  const explorer = 'https://bscscan.com';

  const getSigner = async () => {
    if (mode === 'external') {
      if (!walletClient || !externalAddress) throw new Error(en ? 'Connect an external wallet first' : 'ابتدا کیف پول خارجی را متصل کنید');
      if (walletClient.chain.id !== 56) await switchChainAsync({ chainId: 56 });
      const provider = new ethers.BrowserProvider(walletClient.transport as any);
      return { signer: await provider.getSigner(externalAddress), recipient: externalAddress };
    }
    const wallet = await loadWallet('user', password);
    if (!wallet) throw new Error(en ? 'Internal user wallet not found or password is incorrect' : 'کیف پول کاربر یافت نشد یا رمز عبور اشتباه است');
    return { signer: new ethers.Wallet(wallet.privateKey, new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/', { chainId: 56, name: 'BSC Mainnet' })), recipient: wallet.address };
  };

  const refreshLp = async () => {
    setError('');
    try {
      if (!selected.address) { setLpBalance(''); return; }
      const owner = mode === 'external' ? externalAddress : (() => { try { return localStorage.getItem('arv_user_address') || ''; } catch { return ''; } })();
      if (!owner) { setLpBalance(''); return; }
      const pair = await getPairAddress(56, selected.address, PANCAKE_V2[56].wrappedNative);
      if (!pair || pair === ethers.ZeroAddress) { setLpBalance('0'); return; }
      const balance = await getLpBalance(56, pair, owner);
      setLpBalance(ethers.formatUnits(balance, 18));
    } catch { setLpBalance('0'); }
  };

  useEffect(() => { refreshLp(); }, [token, mode, externalAddress]);

  const addLiquidity = async () => {
    setBusy(true); setError(''); setHash('');
    try {
      if (!ARV_CONFIG.mainnetReady && token === 'ARV') throw new Error(en ? 'ARV Mainnet contract is not configured yet' : 'قرارداد Mainnet توکن ARV هنوز تنظیم نشده است');
      if (!tokenAmount || !bnbAmount || Number(tokenAmount) <= 0 || Number(bnbAmount) <= 0) throw new Error(en ? 'Both amounts are required' : 'هر دو مقدار الزامی هستند');
      const { signer, recipient } = await getSigner();
      const amountToken = ethers.parseUnits(tokenAmount, selected.decimals);
      const amountBnb = ethers.parseEther(bnbAmount);
      await ensureAllowance(signer, selected.address, amountToken);
      const abi = ['function addLiquidityETH(address token,uint256 amountTokenDesired,uint256 amountTokenMin,uint256 amountETHMin,address to,uint256 deadline) external payable returns (uint256,uint256,uint256)'];
      const contract = new ethers.Contract(router, abi, signer);
      const deadline = Math.floor(Date.now()/1000) + 1200;
      const tx = await contract.addLiquidityETH(selected.address, amountToken, amountToken * 99n / 100n, amountBnb * 99n / 100n, recipient, deadline, { value: amountBnb });
      await tx.wait();
      setHash(tx.hash);
      saveLocalTx({ hash: tx.hash, wallet: recipient, type: 'liquidity-add', chainId: 56, createdAt: Date.now(), label: `${token}/BNB` });
      await refreshLp();
    } catch (e) { setError(e instanceof Error ? e.message : (en ? 'Liquidity transaction failed' : 'تراکنش نقدینگی ناموفق بود')); }
    finally { setBusy(false); }
  };

  const removeLiquidity = async () => {
    setBusy(true); setError(''); setHash('');
    try {
      if (!selected.address) throw new Error(en ? 'This token has no configured Mainnet address' : 'آدرس Mainnet این توکن تنظیم نشده است');
      if (!lpAmount || Number(lpAmount) <= 0) throw new Error(en ? 'Enter LP token amount' : 'مقدار LP را وارد کنید');
      const { signer, recipient } = await getSigner();
      const pair = await getPairAddress(56, selected.address, PANCAKE_V2[56].wrappedNative);
      if (!pair || pair === ethers.ZeroAddress) throw new Error(en ? 'No liquidity pair exists' : 'استخر این جفت وجود ندارد');
      const liquidity = ethers.parseUnits(lpAmount, 18);
      const balance = await getLpBalance(56, pair, recipient);
      if (balance < liquidity) throw new Error(en ? 'Insufficient LP balance' : 'موجودی LP کافی نیست');
      const txHash = await removeLiquidityETHWithSigner({ signer, token: selected.address, liquidity, amountTokenMin: 0n, amountETHMin: 0n, recipient });
      setHash(txHash);
      saveLocalTx({ hash: txHash, wallet: recipient, type: 'liquidity-remove', chainId: 56, createdAt: Date.now(), label: `${token}/BNB` });
      await refreshLp();
    } catch (e) { setError(e instanceof Error ? e.message : (en ? 'Liquidity removal failed' : 'حذف نقدینگی ناموفق بود')); }
    finally { setBusy(false); }
  };

  return <div className="flex min-h-screen"><main className="flex-1 overflow-x-hidden"><div className="p-4 md:p-6 max-w-lg mx-auto space-y-4">
    <div><h1 className="text-2xl font-bold gold-gradient">{en ? 'Liquidity' : 'نقدینگی'}</h1><p className="text-xs text-[var(--arv-text-muted)]">{en ? 'Add or remove liquidity from BSC PancakeSwap V2 pools.' : 'افزودن یا حذف نقدینگی از استخرهای PancakeSwap V2 روی BSC.'}</p></div>
    <GlowCard glowColor="gold">
      <div className="grid grid-cols-2 gap-2 mb-4"><button onClick={()=>setTab('add')} className={`rounded-xl p-3 ${tab==='add'?'bg-[var(--arv-gold)] text-black':'bg-[var(--arv-blue)]/40'}`}><Droplets size={16} className="inline mr-1"/>{en ? 'Add' : 'افزودن'}</button><button onClick={()=>setTab('remove')} className={`rounded-xl p-3 ${tab==='remove'?'bg-[var(--arv-gold)] text-black':'bg-[var(--arv-blue)]/40'}`}><Trash2 size={16} className="inline mr-1"/>{en ? 'Remove' : 'حذف'}</button></div>
      <div className="flex gap-2 mb-4"><button onClick={()=>setMode('external')} className={`flex-1 rounded-xl p-3 ${mode==='external'?'bg-[var(--arv-gold)] text-black':'bg-[var(--arv-blue)]/40'}`}><Wallet size={16} className="inline mr-1"/>{en ? 'External Wallet' : 'کیف پول خارجی'}</button><button onClick={()=>setMode('internal')} className={`flex-1 rounded-xl p-3 ${mode==='internal'?'bg-[var(--arv-gold)] text-black':'bg-[var(--arv-blue)]/40'}`}><Shield size={16} className="inline mr-1"/>{en ? 'Internal Wallet' : 'کیف پول داخلی'}</button></div>
      <label className="text-xs text-[var(--arv-text-muted)]">{en ? 'Token' : 'توکن'}</label><select value={token} onChange={e=>setToken(e.target.value)} className="w-full mt-1 mb-3 p-3 rounded-xl bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/20">{TOKENS.map(t=><option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}</select>
      {tab==='add' ? <>
        <label className="text-xs text-[var(--arv-text-muted)]">{en ? 'Token amount' : 'مقدار توکن'}</label><input value={tokenAmount} onChange={e=>setTokenAmount(e.target.value)} inputMode="decimal" className="w-full mt-1 mb-3 p-3 rounded-xl bg-[var(--arv-blue)]/40" placeholder="0.0"/>
        <label className="text-xs text-[var(--arv-text-muted)]">{en ? 'BNB amount' : 'مقدار BNB'}</label><input value={bnbAmount} onChange={e=>setBnbAmount(e.target.value)} inputMode="decimal" className="w-full mt-1 mb-3 p-3 rounded-xl bg-[var(--arv-blue)]/40" placeholder="0.0"/>
      </> : <>
        <div className="flex items-center justify-between text-xs mb-2"><span>{en ? 'Your LP balance' : 'موجودی LP شما'}</span><button onClick={refreshLp} className="text-[var(--arv-gold)]"><RefreshCw size={14}/></button></div>
        <div className="p-3 mb-3 rounded-xl bg-[var(--arv-blue)]/40 font-mono text-sm">{lpBalance || '0'} LP</div>
        <label className="text-xs text-[var(--arv-text-muted)]">{en ? 'LP amount to remove' : 'مقدار LP برای حذف'}</label><input value={lpAmount} onChange={e=>setLpAmount(e.target.value)} inputMode="decimal" className="w-full mt-1 mb-3 p-3 rounded-xl bg-[var(--arv-blue)]/40" placeholder="0.0"/>
        <button onClick={()=>setLpAmount(lpBalance)} className="text-xs text-[var(--arv-gold)] mb-3">{en ? 'Use max' : 'حداکثر'}</button>
      </>}
      {mode==='internal' && <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mb-3 p-3 rounded-xl bg-[var(--arv-blue)]/40" placeholder={en ? 'Wallet password' : 'رمز کیف پول'}/>} 
      <GradientButton onClick={tab==='add'?addLiquidity:removeLiquidity} disabled={busy}>{busy?<Loader2 className="animate-spin"/>:(tab==='add'?<Droplets/>:<Trash2/>)}{busy?(en?'Processing...':'در حال پردازش...'):(tab==='add'?(en?'Add liquidity':'افزودن نقدینگی'):(en?'Remove liquidity':'حذف نقدینگی'))}</GradientButton>
      {hash && <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-sm"><CheckCircle2 className="inline mr-1 text-green-400"/>{en?'Transaction:':'تراکنش:'} <a className="font-mono text-[var(--arv-gold)]" target="_blank" rel="noreferrer" href={`${explorer}/tx/${hash}`}>{hash.slice(0,10)}...{hash.slice(-8)}</a></div>}
      {error && <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-200">{error}</div>}
    </GlowCard>
    <GlowCard glowColor="blue"><p className="text-xs text-[var(--arv-text-muted)]">{en ? 'Liquidity actions are on-chain. Verify token addresses and start with small amounts. Minimum amounts are protected at 1% for additions; removals require your confirmation in the wallet.' : 'عملیات نقدینگی روی زنجیره انجام می‌شود. آدرس توکن را بررسی و با مقدار کم شروع کنید. حداقل مقدار در افزودن ۱٪ محافظت می‌شود و حذف با تأیید کیف پول انجام می‌شود.'}</p></GlowCard>
  </div></main></div>;
}
