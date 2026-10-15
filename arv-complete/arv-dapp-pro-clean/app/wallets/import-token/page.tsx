'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search, Plus, AlertCircle, Check, Trash2, Loader2 } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import TokenLogo from '@/components/ui/TokenLogo';
import {
  fetchTokenInfo,
  addImportedToken,
  loadImportedTokens,
  removeImportedToken,
  type ImportedToken,
} from '@/lib/services/token-import';

export default function ImportTokenPage() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState<56 | 97>(56);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState<{ symbol: string; name: string; decimals: number } | null>(null);
  const [imported, setImported] = useState<ImportedToken[]>([]);

  useState(() => {
    setImported(loadImportedTokens());
  });

  const handleSearch = async () => {
    setError('');
    setSuccess('');
    setPreview(null);
    if (!address.trim()) {
      setError('آدرس قرارداد را وارد کنید');
      return;
    }
    setLoading(true);
    try {
      const info = await fetchTokenInfo(address.trim(), chainId);
      if (!info) {
        setError('توکن پیدا نشد. آدرس یا شبکه را بررسی کنید');
      } else {
        setPreview(info);
      }
    } catch {
      setError('خطا در ارتباط با شبکه');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) return;
    const token: ImportedToken = {
      address: address.trim(),
      symbol: preview.symbol,
      name: preview.name,
      decimals: preview.decimals,
      chainId,
      importedAt: Date.now(),
    };
    const next = addImportedToken(token);
    setImported(next);
    setSuccess(`${preview.symbol} اضافه شد`);
    setPreview(null);
    setAddress('');
  };

  const handleRemove = (addr: string) => {
    const next = removeImportedToken(addr);
    setImported(next);
  };

  return (
    <div className="min-h-screen bg-[var(--arv-blue-dark)]">
      <div className="p-4 md:p-6 max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">
              <span className="gold-gradient">افزودن توکن جدید</span>
            </h1>
            <p className="text-xs text-[var(--arv-text-muted)] mt-1">
              آدرس قرارداد BEP-20 را وارد کنید
            </p>
          </div>
        </div>

        {/* Chain Selector */}
        <GlowCard glowColor="blue">
          <div className="text-xs text-[var(--arv-text-muted)] mb-2">شبکه</div>
          <div className="flex gap-2">
            <button
              onClick={() => setChainId(56)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                chainId === 56
                  ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)]'
                  : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'
              }`}
            >
              BSC Mainnet
            </button>
            <button
              onClick={() => setChainId(97)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                chainId === 97
                  ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)]'
                  : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'
              }`}
            >
              BSC Testnet
            </button>
          </div>
        </GlowCard>

        {/* Address Input */}
        <GlowCard glowColor="gold">
          <label className="text-xs text-[var(--arv-text-muted)] mb-2 block">
            آدرس قرارداد (Contract Address)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="flex-1 min-w-0 bg-[var(--arv-blue)]/40 rounded-lg px-3 py-2 outline-none text-sm font-mono text-white"
              dir="ltr"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] font-bold text-sm hover:bg-[var(--arv-gold)]/30 transition-all disabled:opacity-50 shrink-0"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            </button>
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
            {success}
          </div>
        )}

        {/* Preview */}
        {preview && (
          <GlowCard glowColor="green">
            <div className="text-xs text-[var(--arv-text-muted)] mb-3">پیش‌نمایش توکن</div>
            <div className="flex items-center gap-3">
              <TokenLogo symbol={preview.symbol} size={48} />
              <div className="flex-1">
                <div className="font-bold text-lg">{preview.symbol}</div>
                <div className="text-xs text-[var(--arv-text-muted)]">{preview.name}</div>
                <div className="text-[10px] text-[var(--arv-gold)] mt-1">
                  Decimals: {preview.decimals}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <GradientButton variant="gold" size="md" fullWidth onClick={handleAdd} icon={<Plus size={16} />}>
                افزودن به کیف پول
              </GradientButton>
            </div>
          </GlowCard>
        )}

        {/* Imported List */}
        <GlowCard glowColor="blue">
          <div className="text-sm font-bold mb-3">
            توکن‌های اضافه‌شده ({imported.length})
          </div>
          {imported.length === 0 ? (
            <div className="text-xs text-[var(--arv-text-muted)] text-center py-4">
              هنوز توکنی اضافه نکرده‌اید
            </div>
          ) : (
            <div className="space-y-2">
              {imported.map((token) => (
                <div
                  key={token.address}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--arv-blue)]/30"
                >
                  <TokenLogo symbol={token.symbol} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{token.symbol}</div>
                    <div className="text-[10px] text-[var(--arv-text-muted)] truncate" dir="ltr">
                      {token.address.slice(0, 10)}...{token.address.slice(-8)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(token.address)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </GlowCard>

        {/* Info */}
        <GlowCard glowColor="gold">
          <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
            <div className="font-bold text-white mb-1">⚠️ توجه</div>
            <div>• فقط توکن‌های BEP-20 (BSC) پشتیبانی می‌شوند</div>
            <div>• آدرس را از منبع معتبر (BscScan) کپی کنید</div>
            <div>• توکن‌های جعلی می‌توانند دارایی شما را به خطر بیندازند</div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
