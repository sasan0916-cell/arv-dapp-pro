'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi';
import {
  ArrowDownUp, Shield, Gift, User, Loader2, AlertCircle,
  Check, Info, Settings, RefreshCw, ChevronDown,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { ARV_CONFIG } from '@/lib/arv-config';
import { calculateMinOut, executeSwap, executeSwapWithSigner, getNativeBalance, getQuote, getTokenBalance } from '@/lib/services/dex-service';
import { loadWallet } from '@/lib/services/wallet-service';
import { saveLocalTx } from '@/lib/services/local-tx';

type WalletId = 'main' | 'reward' | 'user' | 'external';

interface WalletOption {
  id: WalletId;
  label: string;
  address: string;
  color: 'gold' | 'green' | 'blue' | 'purple';
  icon: React.ReactNode;
}

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  address?: `0x${string}`;
  chainId: number;
  category: 'core' | 'stable' | 'large' | 'low-unit' | 'defi';
  decimals?: number;
}

// BNB Chain catalog. Core addresses are aligned with PancakeSwap's published token list;
// additional widely-used BSC assets are kept in the catalog with their verified token addresses.
// On BSC Testnet, tokens without a testnet deployment are shown as catalog-only until
// a real testnet token/pair is configured. This prevents presenting a mainnet token as
// if it were currently tradeable on Testnet.
const TOKENS: Token[] = [
  { symbol: 'ARV', name: 'Arvand Khabar Token', icon: '🟡', balance: '—', address: ARV_CONFIG.token.address || undefined, chainId: ARV_CONFIG.network.chainId as 56 | 97, category: 'core', decimals: 18 },
  { symbol: 'BNB', name: 'BNB', icon: '🟠', balance: '—', chainId: 56, category: 'core', decimals: 18 },
  { symbol: 'WBNB', name: 'Wrapped BNB', icon: '🟠', balance: '—', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', chainId: 56, category: 'core' },
  { symbol: 'USDT', name: 'Tether USD', icon: '💵', balance: '—', address: '0x55d398326f99059fF775485246999027B3197955', chainId: 56, category: 'stable' },
  { symbol: 'USDC', name: 'USD Coin', icon: '🔵', balance: '—', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', chainId: 56, category: 'stable' },
  { symbol: 'BUSD', name: 'Binance USD', icon: '🟢', balance: '—', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', chainId: 56, category: 'stable' },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🟡', balance: '—', address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', chainId: 56, category: 'stable' },
  { symbol: 'BTCB', name: 'Bitcoin BEP-20', icon: '₿', balance: '—', address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', chainId: 56, category: 'large' },
  { symbol: 'ETH', name: 'Ethereum BEP-20', icon: 'Ξ', balance: '—', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', chainId: 56, category: 'large' },
  { symbol: 'CAKE', name: 'PancakeSwap Token', icon: '🥞', balance: '—', address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', chainId: 56, category: 'defi' },
  { symbol: 'XRP', name: 'XRP Token', icon: '✕', balance: '—', address: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE', chainId: 56, category: 'large' },
  { symbol: 'ADA', name: 'Cardano Token', icon: '₳', balance: '—', address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47', chainId: 56, category: 'large' },
  { symbol: 'DOGE', name: 'Dogecoin', icon: '🐕', balance: '—', address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43', chainId: 56, category: 'low-unit' },
  { symbol: 'SHIB', name: 'Shiba Inu', icon: '🐕', balance: '—', address: '0x2859E4544C4bB03966803b044a93563Bd2D0DD4D', chainId: 56, category: 'low-unit' },
  { symbol: 'FLOKI', name: 'FLOKI', icon: '🐕', balance: '—', address: '0xfb5B838b6cfEEdC2873aB27866079AC55363D37E', chainId: 56, category: 'low-unit' },
  { symbol: 'PEPE', name: 'Pepe', icon: '🐸', balance: '—', address: '0x25d887Ce7a35172c62febfd67a1856f20faebb00', chainId: 56, category: 'low-unit' },
  { symbol: 'TRX', name: 'TRON', icon: '🔴', balance: '—', address: '0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3', chainId: 56, category: 'low-unit' },
  { symbol: 'LTC', name: 'Litecoin Token', icon: 'Ł', balance: '—', address: '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94', chainId: 56, category: 'large' },
  { symbol: 'BCH', name: 'Bitcoin Cash Token', icon: '₿', balance: '—', address: '0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf', chainId: 56, category: 'large' },
  { symbol: 'DOT', name: 'Polkadot Token', icon: '●', balance: '—', address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402', chainId: 56, category: 'large' },
  { symbol: 'LINK', name: 'Chainlink Token', icon: '🔗', balance: '—', address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD', chainId: 56, category: 'defi' },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', balance: '—', address: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1', chainId: 56, category: 'defi' },
  { symbol: 'SUSHI', name: 'Sushi', icon: '🍣', balance: '—', address: '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4', chainId: 56, category: 'defi' },
  { symbol: 'TWT', name: 'Trust Wallet Token', icon: '🛡️', balance: '—', address: '0x4B0F1812e5Df2A09796481Ff14017e6005508003', chainId: 56, category: 'defi' },
  { symbol: 'ALPHA', name: 'AlphaToken', icon: 'α', balance: '—', address: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', chainId: 56, category: 'defi' },
  { symbol: 'BAKE', name: 'BakeryToken', icon: '🍰', balance: '—', address: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5', chainId: 56, category: 'defi' },
  { symbol: 'ANKR', name: 'Ankr', icon: '🔷', balance: '—', address: '0xf307910A4c7bbc79691fD374889b36d8531B08e3', chainId: 56, category: 'defi' },
  { symbol: 'IOTX', name: 'IoTeX', icon: '⚡', balance: '—', address: '0x9678E42ceBEb63F23197D726B29b1CB20d0064E5', chainId: 56, category: 'low-unit' },
  { symbol: 'ATOM', name: 'Cosmos Token', icon: '⚛️', balance: '—', address: '0x0Eb3a705fc54725037CC9e008bDede697f62F335', chainId: 56, category: 'large' },
  { symbol: 'EOS', name: 'EOS Token', icon: '◆', balance: '—', address: '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6', chainId: 56, category: 'large' },
  { symbol: 'ONT', name: 'Ontology Token', icon: '◈', balance: '—', address: '0xFd7B3A77848f1C2D67E05E54d78d174a0C850335', chainId: 56, category: 'low-unit' },
];

const TOKEN_CATEGORIES: Record<Token['category'], string> = {
  core: 'اصلی',
  stable: 'استیبل‌کوین',
  large: 'ارزهای شناخته‌شده',
  'low-unit': 'قیمت واحد پایین',
  defi: 'DeFi',
};

export default function SwapPage() {
  const { address: externalAddress, isConnected: externalConnected, connector: externalConnector } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletId>('main');
  const [fromToken, setFromToken] = useState('ARV');
  const [toToken, setToToken] = useState('BNB');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [tokenSearch, setTokenSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [approvalHash, setApprovalHash] = useState('');
  const [txHash, setTxHash] = useState('');
  const [activeChain, setActiveChain] = useState<56 | 97>(56);
  const [quoting, setQuoting] = useState(false);
  const [quotePath, setQuotePath] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const wallets: WalletOption[] = [
      {
        id: 'main',
        label: 'کیف اصلی',
        address: ARV_CONFIG.wallets.main.address,
        color: 'gold',
        icon: <Shield size={20} />,
      },
      {
        id: 'reward',
        label: 'کیف پاداش',
        address: ARV_CONFIG.wallets.reward.address,
        color: 'green',
        icon: <Gift size={20} />,
      },
      {
        id: 'user',
        label: 'کیف کاربر',
        address: localStorage.getItem('arv_user_address') || '',
        color: 'blue',
        icon: <User size={20} />,
      },
      {
        id: 'external',
        label: externalConnected ? (externalConnector?.name || 'کیف خارجی') : 'اتصال کیف خارجی',
        address: externalAddress || '',
        color: 'purple',
        icon: <Shield size={20} />,
      },
    ];

    setWalletOptions(wallets);
  }, [externalAddress, externalConnected, externalConnector?.name]);

  const selected = walletOptions.find((w) => w.id === selectedWallet);
  const fromTokenData = TOKENS.find((t) => t.symbol === fromToken)!;
  const toTokenData = TOKENS.find((t) => t.symbol === toToken)!;

  useEffect(() => {
    if (externalConnected && externalAddress) {
      setSelectedWallet('external');
      return;
    }
    if (selectedWallet === 'external') setSelectedWallet('main');
  }, [externalConnected, externalAddress]);

  useEffect(() => {
    if (externalConnected && externalAddress && selectedWallet === 'external') refreshBalances();
    else if (selected?.address) refreshBalances();
  }, [selected?.address, selectedWallet, externalAddress, externalConnected, fromToken, toToken]);

  const resolveChain = (from: Token, to: Token): 56 | 97 => {
    if (from.symbol === 'ARV' || to.symbol === 'ARV') return ARV_CONFIG.network.chainId as 56 | 97;
    return 56;
  };

  const availableOnChain = (token: Token, chain: 56 | 97) =>
    token.symbol === 'BNB' || token.chainId === chain;

  const tokenAddress = (token: Token) => token.symbol === 'BNB' ? 'native' : token.address!;

  const refreshBalances = async () => {
    const address = selected?.address;
    if (!address) return;
    try {
      const next = await Promise.all(TOKENS.map(async (token) => {
        const chain: 56 | 97 = token.symbol === 'ARV' || (token.symbol === 'BNB' && ARV_CONFIG.network.chainId === 97) ? (ARV_CONFIG.network.chainId as 56 | 97) : 56;
        if (!availableOnChain(token, chain) || (!token.address && token.symbol !== 'BNB')) return token;
        const raw = token.symbol === 'BNB'
          ? await getNativeBalance(chain, address)
          : await getTokenBalance(chain, token.address!, address);
        return { ...token, balance: Number(ethers.formatUnits(raw, token.decimals ?? 18)).toFixed(6) };
      }));
      // Keep the catalog immutable; balances for the active pair are read directly below.
      const f = next.find(t => t.symbol === fromToken);
      const t = next.find(t => t.symbol === toToken);
      if (f) fromTokenData.balance = f.balance;
      if (t) toTokenData.balance = t.balance;
    } catch {}
  };

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setToAmount('');
      setQuotePath([]);
      setError('');
      if (!fromAmount || Number(fromAmount) <= 0) return;
      const chain = resolveChain(fromTokenData, toTokenData);
      setActiveChain(chain);
      if (!availableOnChain(fromTokenData, chain) || !availableOnChain(toTokenData, chain)) return;
      try {
        setQuoting(true);
        const amountIn = ethers.parseUnits(fromAmount, fromTokenData.decimals ?? 18);
        const quote = await getQuote({ chainId: chain, fromAddress: tokenAddress(fromTokenData), toAddress: tokenAddress(toTokenData), amountIn });
        if (cancelled) return;
        setToAmount(ethers.formatUnits(quote.amountOut, toTokenData.decimals ?? 18));
        setQuotePath(quote.path);
      } catch {
        if (!cancelled) setError('برای این جفت در حال حاضر مسیر و نقدینگی قابل Quote پیدا نشد.');
      } finally {
        if (!cancelled) setQuoting(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [fromAmount, fromToken, toToken, fromTokenData.decimals, toTokenData.decimals]);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
    setToAmount('');
    setQuotePath([]);
  };

  const handleMax = () => {
    if (fromTokenData.balance !== '—') setFromAmount(fromTokenData.balance.replace(/,/g, ''));
    else setError('موجودی این توکن هنوز از شبکه خوانده نشده است');
  };

  const handleSwap = async () => {
    if (!fromAmount || Number(fromAmount) <= 0) { setError('مقدار را وارد کنید'); return; }
    if (!selected?.address) { setError('ابتدا یک کیف پول فعال انتخاب کنید یا یک کیف پول خارجی متصل کنید'); return; }
    if (selectedWallet !== 'external' && !password) { setError('رمز کیف پول را وارد کنید تا تراکنش با کلید رمزگذاری‌شده امضا شود'); return; }
    if (selectedWallet === 'external' && !walletClient) { setError('ابتدا کیف پول خارجی را متصل کنید'); return; }

    const chain = resolveChain(fromTokenData, toTokenData);
    if (!availableOnChain(fromTokenData, chain) || !availableOnChain(toTokenData, chain)) {
      setError(chain === 97 ? 'ARV فعلاً فقط روی BSC Testnet فعال است؛ برای جفت‌های دیگر از BSC Mainnet استفاده می‌شود.' : 'این توکن روی شبکه انتخاب‌شده مستقر نیست.');
      return;
    }
    if (!toAmount) { setError('ابتدا Quote واقعی دریافت کنید'); return; }

    setLoading(true); setError(''); setSuccess(false); setTxHash(''); setApprovalHash('');
    try {
      if (selectedWallet === 'external') {
        if (!walletClient || !externalAddress) throw new Error('کیف پول خارجی متصل نیست');
        if (Number(walletClient.chain.id) !== chain) {
          await switchChainAsync({ chainId: chain });
        }
        const refreshedClient = await new Promise<typeof walletClient>((resolve) => setTimeout(() => resolve(walletClient), 250));
        const browserProvider = new ethers.BrowserProvider(refreshedClient.transport as any);
        const signer = await browserProvider.getSigner(externalAddress);
        const amountIn = ethers.parseUnits(fromAmount, fromTokenData.decimals ?? 18);
        const quote = await getQuote({ chainId: chain, fromAddress: tokenAddress(fromTokenData), toAddress: tokenAddress(toTokenData), amountIn });
        const minOut = calculateMinOut(quote.amountOut, slippage);
        const result = await executeSwapWithSigner({
          signer,
          chainId: chain,
          fromAddress: tokenAddress(fromTokenData),
          toAddress: tokenAddress(toTokenData),
          amountIn,
          amountOutMin: minOut,
          recipient: externalAddress,
          path: quote.path,
        });
        setApprovalHash(result.approvalHash || '');
        setTxHash(result.hash);
        saveLocalTx({ hash: result.hash, wallet: externalAddress, type: 'swap', chainId: chain, createdAt: Date.now(), label: `${fromToken} → ${toToken}`, approvalHash: result.approvalHash || undefined });
      } else {
        const wallet = await loadWallet(selectedWallet as 'main' | 'reward' | 'user', password);
        if (!wallet) throw new Error('رمز کیف پول صحیح نیست یا کیف پول ذخیره نشده است');
        if (wallet.address.toLowerCase() !== selected.address.toLowerCase()) throw new Error('کیف پول انتخاب‌شده با کلید واردشده مطابقت ندارد');
        const amountIn = ethers.parseUnits(fromAmount, fromTokenData.decimals ?? 18);
        const quote = await getQuote({ chainId: chain, fromAddress: tokenAddress(fromTokenData), toAddress: tokenAddress(toTokenData), amountIn });
        const minOut = calculateMinOut(quote.amountOut, slippage);
        const result = await executeSwap({
          privateKey: wallet.privateKey,
          chainId: chain,
          fromAddress: tokenAddress(fromTokenData),
          toAddress: tokenAddress(toTokenData),
          amountIn,
          amountOutMin: minOut,
          recipient: wallet.address,
          path: quote.path,
        });
        setApprovalHash(result.approvalHash || '');
        setTxHash(result.hash);
        saveLocalTx({ hash: result.hash, wallet: wallet.address, type: 'swap', chainId: chain, createdAt: Date.now(), label: `${fromToken} → ${toToken}`, approvalHash: result.approvalHash || undefined });
      }
      setSuccess(true);
      await refreshBalances();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تراکنش Swap انجام نشد');
    } finally { setLoading(false); }
  };

  const selectFromToken = (symbol: string) => {
    if (symbol === toToken) {
      setToToken(fromToken);
    }
    setFromToken(symbol);
    setShowFromDropdown(false);
    setFromAmount('');
    setToAmount('');
    setQuotePath([]);
  };

  const filteredTokens = TOKENS.filter((token) =>
    `${token.symbol} ${token.name}`.toLowerCase().includes(tokenSearch.toLowerCase())
  );

  const selectToToken = (symbol: string) => {
    if (symbol === fromToken) {
      setFromToken(toToken);
    }
    setToToken(symbol);
    setShowToDropdown(false);
    setFromAmount('');
    setToAmount('');
    setQuotePath([]);
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-x-hidden">
        <div className="p-4 md:p-6 max-w-lg mx-auto space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                <span className="gold-gradient">سواپ ارزهای دیجیتال</span>
              </h1>
              <p className="text-xs text-[var(--arv-text-muted)]">
                تبادل مستقیم توکن‌های BNB Chain؛ ARV، استیبل‌کوین‌ها، DeFi و توکن‌های کم‌قیمت
              </p>
              <div className="mt-2 text-[10px] text-[var(--arv-gold)]">
                {activeChain === 56 ? 'BSC Mainnet • معامله توکن‌های BNB Chain فعال' : 'BSC Testnet • معاملات ARV برای تست'}
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
            >
              <Settings size={18} />
            </button>
          </div>

          {/* Settings */}
          {showSettings && (
            <GlowCard glowColor="gold">
              <div className="mb-3">
                <div className="text-sm font-bold">تنظیمات Slippage</div>
              </div>
              <div className="flex gap-2">
                {[0.1, 0.5, 1.0, 3.0].map((val) => (
                  <button
                    key={val}
                    onClick={() => setSlippage(val)}
                    className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                      slippage === val
                        ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)] font-bold'
                        : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </GlowCard>
          )}

          {/* Wallet Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {walletOptions.map((wallet) => {
              const isActive = selectedWallet === wallet.id;
              const hasAddress = !!wallet.address;
              return (
                <button
                  key={wallet.id}
                  onClick={() => hasAddress && setSelectedWallet(wallet.id)}
                  disabled={!hasAddress}
                  className={`p-2 rounded-xl border-2 transition-all text-center ${
                    isActive
                      ? 'border-[var(--arv-gold)] bg-[var(--arv-gold)]/10'
                      : hasAddress
                      ? 'border-[var(--arv-blue)]/40 hover:border-[var(--arv-gold)]/40'
                      : 'border-[var(--arv-blue)]/20 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center mb-1 ${
                      wallet.color === 'gold'
                        ? 'bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]'
                        : wallet.color === 'green'
                        ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                        : wallet.color === 'blue'
                        ? 'bg-blue-400/15 text-blue-400'
                        : 'bg-purple-400/15 text-purple-300'
                    }`}
                  >
                    {wallet.icon}
                  </div>
                  <div className="text-xs font-bold">{wallet.label}</div>
                </button>
              );
            })}
          </div>

          {/* Swap Card */}
          <GlowCard glowColor="gold">
            {/* From */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--arv-text-muted)]">از</span>
                <span className="text-xs text-[var(--arv-text-muted)]">
                  موجودی: {fromTokenData.balance}
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent outline-none text-lg font-bold text-white"
                  dir="ltr"
                />
                <button
                  onClick={handleMax}
                  className="text-xs px-2 py-1 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] font-bold"
                >
                  MAX
                </button>
                <button
                  onClick={() => setShowFromDropdown(!showFromDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--arv-blue)] font-bold text-sm hover:bg-[var(--arv-blue)]/80 transition-all"
                >
                  <span>{fromTokenData.icon}</span>
                  <span>{fromToken}</span>
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* From Dropdown */}
              {showFromDropdown && (
                <div className="mt-2 p-2 rounded-xl bg-[var(--arv-blue-dark)] border border-[var(--arv-gold)]/30 max-h-60 overflow-y-auto">
                  <input value={tokenSearch} onChange={(e) => setTokenSearch(e.target.value)} placeholder="جستجوی نام یا نماد..." className="w-full mb-2 p-2 rounded-lg bg-[var(--arv-blue)]/50 outline-none text-sm" dir="rtl" />
                  {filteredTokens.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => selectFromToken(token.symbol)}
                      disabled={token.symbol === toToken}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        token.symbol === fromToken
                          ? 'bg-[var(--arv-gold)]/20 text-[var(--arv-gold)]'
                          : token.symbol === toToken
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:bg-[var(--arv-blue)]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{token.icon}</span>
                        <div className="text-right">
                          <div className="font-bold text-sm">{token.symbol}</div>
                          <div className="text-xs text-[var(--arv-text-muted)]">{token.name}</div>
                          <div className="text-[10px] text-[var(--arv-gold)]/80 mt-0.5">{TOKEN_CATEGORIES[token.category]}{token.chainId === 56 ? ' • Mainnet' : ' • Testnet'}</div>
                        </div>
                      </div>
                      <div className="text-xs text-[var(--arv-text-muted)]" dir="ltr">
                        {token.balance}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Switch Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={handleSwitch}
                className="w-10 h-10 rounded-full bg-[var(--arv-gold)] text-[var(--arv-blue-dark)] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <ArrowDownUp size={20} />
              </button>
            </div>

            {/* To */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--arv-text-muted)]">به</span>
                <span className="text-xs text-[var(--arv-text-muted)]">
                  موجودی: {toTokenData.balance}
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20">
                <input
                  type="number"
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                  className="flex-1 bg-transparent outline-none text-lg font-bold text-white"
                  dir="ltr"
                />
                <button
                  onClick={() => setShowToDropdown(!showToDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--arv-blue)] font-bold text-sm hover:bg-[var(--arv-blue)]/80 transition-all"
                >
                  <span>{toTokenData.icon}</span>
                  <span>{toToken}</span>
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* To Dropdown */}
              {showToDropdown && (
                <div className="mt-2 p-2 rounded-xl bg-[var(--arv-blue-dark)] border border-[var(--arv-gold)]/30 max-h-60 overflow-y-auto">
                  <input value={tokenSearch} onChange={(e) => setTokenSearch(e.target.value)} placeholder="جستجوی نام یا نماد..." className="w-full mb-2 p-2 rounded-lg bg-[var(--arv-blue)]/50 outline-none text-sm" dir="rtl" />
                  {filteredTokens.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => selectToToken(token.symbol)}
                      disabled={token.symbol === fromToken}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        token.symbol === toToken
                          ? 'bg-[var(--arv-gold)]/20 text-[var(--arv-gold)]'
                          : token.symbol === fromToken
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:bg-[var(--arv-blue)]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{token.icon}</span>
                        <div className="text-right">
                          <div className="font-bold text-sm">{token.symbol}</div>
                          <div className="text-xs text-[var(--arv-text-muted)]">{token.name}</div>
                          <div className="text-[10px] text-[var(--arv-gold)]/80 mt-0.5">{TOKEN_CATEGORIES[token.category]}{token.chainId === 56 ? ' • Mainnet' : ' • Testnet'}</div>
                        </div>
                      </div>
                      <div className="text-xs text-[var(--arv-text-muted)]" dir="ltr">
                        {token.balance}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </GlowCard>

          {/* Rate Info */}
          <GlowCard glowColor="blue">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">نرخ</span>
                <span dir="ltr" className="text-[var(--arv-gold)]">{quoting ? 'در حال Quote...' : toAmount ? `${toAmount} ${toToken}` : 'Quote از Router'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[var(--arv-text-muted)]">مسیر</span>
                <span dir="ltr" className="text-right text-[var(--arv-gold)]">{quotePath.length ? quotePath.map((a, i) => <span key={`${a}-${i}`}>{i ? ' → ' : ''}{a === 'native' ? (activeChain === 56 ? 'BNB' : 'tBNB') : `${a.slice(0, 6)}…${a.slice(-4)}`}</span>) : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">حداقل دریافتی</span>
                <span dir="ltr">{toAmount ? `${ethers.formatUnits(calculateMinOut(ethers.parseUnits(toAmount, toTokenData.decimals ?? 18), slippage), toTokenData.decimals ?? 18)} ${toToken}` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">Slippage</span>
                <span>{slippage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">کارمزد</span>
                <span dir="ltr">کارمزد شبکه (وابسته به BSC)</span>
              </div>
            </div>
          </GlowCard>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-[var(--arv-danger)] text-sm p-3 rounded-xl bg-[var(--arv-danger)]/10">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 text-[var(--arv-success)] text-sm p-3 rounded-xl bg-[var(--arv-success)]/10">
              <Check size={16} />
              سواپ با موفقیت انجام شد!
            </div>
          )}

          {/* Signing */}
          {selectedWallet === 'external' ? (
            <GlowCard glowColor="green">
              <div className="text-sm font-bold">کیف پول خارجی متصل است</div>
              <div className="text-[10px] text-[var(--arv-text-muted)] mt-2">امضای Approval و Swap مستقیماً داخل {externalConnector?.name || 'کیف پول شما'} انجام می‌شود و کلید خصوصی وارد DApp نمی‌شود.</div>
              <div className="mt-2 font-mono text-[10px] text-[var(--arv-gold)] break-all">{externalAddress}</div>
            </GlowCard>
          ) : (
            <GlowCard glowColor="blue">
              <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">رمز کیف پول برای امضای Swap</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز کیف پول انتخاب‌شده" className="arv-input w-full" dir="ltr" autoComplete="current-password" />
              <div className="text-[10px] text-[var(--arv-text-muted)] mt-2">کلید خصوصی از کیف پول رمزگذاری‌شده خوانده می‌شود و برای سرور ارسال نمی‌شود.</div>
            </GlowCard>
          )}

          {quoting && <div className="text-center text-xs text-[var(--arv-gold)]">در حال دریافت Quote واقعی از Router...</div>}

          {txHash && (
            <GlowCard glowColor="green">
              <div className="text-xs text-[var(--arv-text-muted)]">Transaction Hash</div>
              <a className="font-mono text-xs text-[var(--arv-gold)] break-all" href={`${activeChain === 56 ? 'https://bscscan.com/tx/' : 'https://testnet.bscscan.com/tx/'}${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
              {approvalHash && <div className="mt-2 text-[10px] text-[var(--arv-text-muted)]">Approval: {approvalHash}</div>}
            </GlowCard>
          )}

          {/* Swap Button */}
          <GradientButton
            variant="gold"
            size="lg"
            fullWidth
            onClick={handleSwap}
            disabled={loading || !fromAmount || parseFloat(fromAmount) <= 0}
            icon={
              loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowDownUp size={18} />
              )
            }
          >
            {loading ? 'در حال سواپ...' : 'تأیید و سواپ'}
          </GradientButton>

          {/* Info */}
          <GlowCard glowColor="gold">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-[var(--arv-gold)] flex-shrink-0 mt-1" />
              <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
                <div className="font-bold text-white mb-1">توجه</div>
                <div>• سواپ از طریق PancakeSwap انجام می‌شود</div>
                <div>• نرخ ممکن است تغییر کند</div>
                <div>• تراکنش غیرقابل بازگشت است</div>
              </div>
            </div>
          </GlowCard>

        </div>
      </main>
    </div>
  );
}
