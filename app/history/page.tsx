'use client';

import { useState, useEffect } from 'react';
import {
  History, Shield, Gift, User, ArrowUpRight, ArrowDownLeft,
  ExternalLink, RefreshCw, Filter, Search, Info, Loader2,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { ARV_CONFIG } from '@/lib/arv-config';
import { shortAddress, formatDate } from '@/lib/utils';
import { getTxHistory, getBscScanTxUrl } from '@/lib/services/token-service';

type WalletId = 'main' | 'reward' | 'user';
type Filter = 'all' | 'send' | 'receive';

interface WalletOption {
  id: WalletId;
  label: string;
  address: string;
  color: 'gold' | 'green' | 'blue';
  icon: React.ReactNode;
}

export default function HistoryPage() {
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletId>('main');
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (selectedWallet) {
      loadHistory();
    }
  }, [selectedWallet]);

  async function loadHistory() {
    const wallet = walletOptions.find((w) => w.id === selectedWallet);
    if (!wallet?.address) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const txs = await getTxHistory(wallet.address, 30);
      setTransactions(txs);
    } catch (e: any) {
      setError(e.message || 'خطا در بارگذاری تاریخچه');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = transactions.filter((tx) => {
    if (filter === 'send' && tx.type !== 'send') return false;
    if (filter === 'receive' && tx.type !== 'receive') return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        tx.hash.toLowerCase().includes(s) ||
        tx.from.toLowerCase().includes(s) ||
        tx.to.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const selected = walletOptions.find((w) => w.id === selectedWallet);

  return (
    <div className="flex min-h-screen">
      
      <main className="flex-1 overflow-x-hidden">
        
        <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                <span className="gold-gradient">تاریخچه تراکنش‌ها</span>
              </h1>
              <p className="text-xs text-[var(--arv-text-muted)]">
                تراکنش‌های ARV کیف پول
              </p>
            </div>
            <button
              onClick={loadHistory}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

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
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    isActive
                      ? 'border-[var(--arv-gold)] bg-[var(--arv-gold)]/10'
                      : hasAddress
                      ? 'border-[var(--arv-blue)]/40 hover:border-[var(--arv-gold)]/40'
                      : 'border-[var(--arv-blue)]/20 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-2 ${
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

          {/* Filter & Search */}
          <GlowCard glowColor="gold">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex gap-1">
                {(['all', 'send', 'receive'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                      filter === f
                        ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)] font-bold'
                        : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)] hover:bg-[var(--arv-blue)]/60'
                    }`}
                  >
                    {f === 'all' ? 'همه' : f === 'send' ? 'ارسال' : 'دریافت'}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--arv-text-muted)]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو در هش یا آدرس..."
                  className="arv-input pr-10 text-xs"
                />
              </div>
            </div>
          </GlowCard>

          {/* Stats */}
          {selected?.address && (
            <div className="grid grid-cols-3 gap-3">
              <GlowCard glowColor="blue" delay={0.05}>
                <div className="text-center">
                  <div className="text-2xl font-bold gold-gradient">
                    {transactions.length}
                  </div>
                  <div className="text-xs text-[var(--arv-text-muted)] mt-1">
                    کل تراکنش‌ها
                  </div>
                </div>
              </GlowCard>
              <GlowCard glowColor="gold" delay={0.1}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--arv-warning)]">
                    {transactions.filter((t) => t.type === 'send').length}
                  </div>
                  <div className="text-xs text-[var(--arv-text-muted)] mt-1">
                    ارسال
                  </div>
                </div>
              </GlowCard>
              <GlowCard glowColor="green" delay={0.15}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--arv-success)]">
                    {transactions.filter((t) => t.type === 'receive').length}
                  </div>
                  <div className="text-xs text-[var(--arv-text-muted)] mt-1">
                    دریافت
                  </div>
                </div>
              </GlowCard>
            </div>
          )}

          {/* Transactions List */}
          <div className="space-y-2">
            {loading && (
              <GlowCard glowColor="gold">
                <div className="text-center py-8">
                  <Loader2
                    size={32}
                    className="animate-spin text-[var(--arv-gold)] mx-auto mb-3"
                  />
                  <div className="text-sm text-[var(--arv-text-muted)]">
                    در حال بارگذاری...
                  </div>
                </div>
              </GlowCard>
            )}

            {!loading && filtered.length === 0 && (
              <GlowCard glowColor="blue">
                <div className="text-center py-8">
                  <History
                    size={40}
                    className="text-[var(--arv-text-muted)] mx-auto mb-3"
                  />
                  <div className="text-sm text-[var(--arv-text-muted)]">
                    {transactions.length === 0
                      ? 'هنوز تراکنشی ثبت نشده'
                      : 'تراکنشی با این فیلتر پیدا نشد'}
                  </div>
                </div>
              </GlowCard>
            )}

            {!loading &&
              filtered.map((tx, i) => (
                <a
                  key={tx.hash || i}
                  href={getBscScanTxUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GlowCard
                    glowColor={tx.type === 'send' ? 'gold' : 'green'}
                    delay={i * 0.05}
                    hover
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tx.type === 'send'
                            ? 'bg-[var(--arv-warning)]/15 text-[var(--arv-warning)]'
                            : 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                        }`}
                      >
                        {tx.type === 'send' ? (
                          <ArrowUpRight size={18} />
                        ) : (
                          <ArrowDownLeft size={18} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-bold ${
                              tx.type === 'send'
                                ? 'text-[var(--arv-warning)]'
                                : 'text-[var(--arv-success)]'
                            }`}
                          >
                            {tx.type === 'send' ? 'ارسال' : 'دریافت'}
                          </span>
                          <span className="text-xs text-[var(--arv-text-muted)]">•</span>
                          <span className="text-xs text-[var(--arv-text-muted)]">
                            {formatDate(tx.timestamp)}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-[var(--arv-text-muted)] truncate" dir="ltr">
                          {tx.type === 'send'
                            ? `→ ${shortAddress(tx.to, 6)}`
                            : `← ${shortAddress(tx.from, 6)}`}
                        </div>
                      </div>

                      <div className="text-left flex-shrink-0">
                        <div
                          className={`font-bold text-sm ${
                            tx.type === 'send'
                              ? 'text-[var(--arv-warning)]'
                              : 'text-[var(--arv-success)]'
                          }`}
                        >
                          {tx.type === 'send' ? '-' : '+'}
                          {Number(
                            parseFloat(tx.value) / 1e18
                          ).toLocaleString('fa-IR', {
                            maximumFractionDigits: 4,
                          })}{' '}
                          ARV
                        </div>
                        <div className="text-xs text-[var(--arv-text-muted)] flex items-center gap-1 justify-end mt-1">
                          BscScan <ExternalLink size={10} />
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </a>
              ))}
          </div>

          {/* View All on BscScan */}
          {selected?.address && (
            <a
              href={`${ARV_CONFIG.network.explorer}/token/${ARV_CONFIG.token.address}?a=${selected.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <GlowCard glowColor="gold" hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--arv-gold)]/15 flex items-center justify-center">
                      <ExternalLink size={18} className="text-[var(--arv-gold)]" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">مشاهده کامل در BscScan</div>
                      <div className="text-xs text-[var(--arv-text-muted)]">
                        همه تراکنش‌های این آدرس
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-[var(--arv-gold)]" />
                </div>
              </GlowCard>
            </a>
          )}

          {/* Info */}
          <GlowCard glowColor="blue">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-400 flex-shrink-0 mt-1" />
              <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
          {selected?.address && (
            <GlowCard glowColor={selected.color}>
              <div className="text-xs text-[var(--arv-text-muted)] mb-2 text-center">
                آدرس {selected.label}
              </div>
              <code className="font-mono text-xs break-all block text-center p-3 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20" dir="ltr">
                {selected.address}
              </code>
            </GlowCard>
          )}
                <div className="font-bold text-white mb-2">درباره تاریخچه</div>
                <div>• داده‌ها از BscScan API بارگذاری می‌شوند</div>
                <div>• ممکنه چند دقیقه تأخیر داشته باشه</div>
                <div>• برای مشاهده کامل، روی هر تراکنش بزنید</div>
                <div>• آدرس قرارداد: {shortAddress(ARV_CONFIG.token.address, 6)}</div>
              </div>
            </div>
          </GlowCard>

        </div>
      </main>
    </div>
  );
}
