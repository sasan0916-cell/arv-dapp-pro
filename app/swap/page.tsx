'use client';

import { useState, useEffect } from 'react';
import {
  ArrowDownUp, Shield, Gift, User, Loader2, AlertCircle,
  Check, Info, Settings, RefreshCw, ChevronDown,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { ARV_CONFIG } from '@/lib/arv-config';

type WalletId = 'main' | 'reward' | 'user';

interface WalletOption {
  id: WalletId;
  label: string;
  address: string;
  color: 'gold' | 'green' | 'blue';
  icon: React.ReactNode;
}

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
}

const TOKENS: Token[] = [
  { symbol: 'ARV', name: 'Arvand Khabar Token', icon: '🟡', balance: '6,000,000' },
  { symbol: 'BNB', name: 'Binance Coin', icon: '🟠', balance: '0.19994' },
  { symbol: 'USDT', name: 'Tether', icon: '💵', balance: '1,000' },
  { symbol: 'BUSD', name: 'Binance USD', icon: '💚', balance: '500' },
  { symbol: 'BTCB', name: 'Bitcoin BEP-20', icon: '₿', balance: '0.01' },
  { symbol: 'ETH', name: 'Ethereum BEP-20', icon: 'Ξ', balance: '0.05' },
  { symbol: 'TON', name: 'Toncoin', icon: '💎', balance: '10' },
];

// نرخ‌های شبیه‌سازی‌شده (نسبت به ARV)
const RATES: Record<string, number> = {
  ARV: 1,
  BNB: 0.0000023,
  USDT: 0.0234,
  BUSD: 0.0234,
  BTCB: 0.0000004,
  ETH: 0.000007,
  TON: 0.0034,
};

export default function SwapPage() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    ];

    setWalletOptions(wallets);
  }, []);

  const selected = walletOptions.find((w) => w.id === selectedWallet);
  const fromTokenData = TOKENS.find((t) => t.symbol === fromToken)!;
  const toTokenData = TOKENS.find((t) => t.symbol === toToken)!;

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && fromToken && toToken) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        const result = (num * RATES[fromToken]) / RATES[toToken];
        setToAmount(result.toFixed(6));
      }
    } else {
      setToAmount('');
    }
  };

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleMax = () => {
    setFromAmount(fromTokenData.balance.replace(/,/g, ''));
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError('مقدار را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      setFromAmount('');
      setToAmount('');
    }, 2000);
  };

  const selectFromToken = (symbol: string) => {
    if (symbol === toToken) {
      setToToken(fromToken);
    }
    setFromToken(symbol);
    setShowFromDropdown(false);
    setFromAmount('');
    setToAmount('');
  };

  const selectToToken = (symbol: string) => {
    if (symbol === fromToken) {
      setFromToken(toToken);
    }
    setToToken(symbol);
    setShowToDropdown(false);
    setFromAmount('');
    setToAmount('');
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
                تبادل ARV با BNB، USDT، BUSD، BTCB، ETH
              </p>
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
          <div className="grid grid-cols-3 gap-2">
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
                        : 'bg-blue-400/15 text-blue-400'
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
                  {TOKENS.map((token) => (
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
                  {TOKENS.map((token) => (
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
                <span dir="ltr">
                  1 {fromToken} = {((RATES[fromToken] / RATES[toToken]) * 1).toFixed(6)} {toToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">Slippage</span>
                <span>{slippage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--arv-text-muted)]">کارمزد</span>
                <span dir="ltr">~0.0002 tBNB</span>
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
