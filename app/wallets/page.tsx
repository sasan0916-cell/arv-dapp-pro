'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet, Plus, RotateCcw, Shield, Gift, User, Copy, Eye,
  EyeOff, Check, ExternalLink, Trash2, KeyRound, Fingerprint,
  ChevronLeft,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Sidebar } from '@/components/Sidebar';
import { ARV_CONFIG } from '@/lib/arv-config';
import { shortAddress, copyToClipboard } from '@/lib/utils';

interface WalletCard {
  id: 'main' | 'reward' | 'user';
  label: string;
  address: string;
  share?: number;
  amount?: string;
  isAdmin: boolean;
  hasWallet: boolean;
  hasBiometric: boolean;
  color: 'gold' | 'blue' | 'green';
  icon: React.ReactNode;
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<WalletCard[]>([
    {
      id: 'main',
      label: 'کیف اصلی',
      address: ARV_CONFIG.wallets.main.address,
      share: 60,
      amount: ARV_CONFIG.wallets.main.amount,
      isAdmin: true,
      hasWallet: false,
      hasBiometric: false,
      color: 'gold',
      icon: <Shield size={24} />,
    },
    {
      id: 'reward',
      label: 'کیف پاداش',
      address: ARV_CONFIG.wallets.reward.address,
      share: 40,
      amount: ARV_CONFIG.wallets.reward.amount,
      isAdmin: true,
      hasWallet: false,
      hasBiometric: false,
      color: 'green',
      icon: <Gift size={24} />,
    },
    {
      id: 'user',
      label: 'کیف کاربر',
      address: '',
      isAdmin: false,
      hasWallet: false,
      hasBiometric: false,
      color: 'blue',
      icon: <User size={24} />,
    },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hideAddress, setHideAddress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // چک کن کدوم کیف پول‌ها ساخته شدن
    if (typeof window !== 'undefined') {
      const updated = wallets.map((w) => ({
        ...w,
        hasWallet: !!localStorage.getItem(`arv_wallet_${w.id}`),
        hasBiometric: !!localStorage.getItem(`arv_cred_${w.id}`),
      }));
      setWallets(updated);
    }
  }, []);

  const handleCopy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleHide = (id: string) => {
    setHideAddress((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        
        <div className="p-4 md:p-6 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              <span className="gold-gradient">کیف پول‌های من</span>
            </h1>
            <p className="text-sm text-[var(--arv-text-muted)]">
              مدیریت کیف پول‌های مستقل ARV
            </p>
          </div>

          {/* Wallet Cards */}
          <div className="space-y-4">
            {wallets.map((wallet, i) => (
              <GlowCard key={wallet.id} glowColor={wallet.color} delay={i * 0.1}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        wallet.color === 'gold'
                          ? 'bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]'
                          : wallet.color === 'green'
                          ? 'bg-[var(--arv-success)]/15 text-[var(--arv-success)]'
                          : 'bg-blue-400/15 text-blue-400'
                      }`}
                    >
                      {wallet.icon}
                    </div>
                    <div>
                      <div className="font-bold text-lg flex items-center gap-2">
                        {wallet.label}
                        {wallet.isAdmin && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--arv-gold)]/15 text-[var(--arv-gold)]">
                            مدیرکل
                          </span>
                        )}
                      </div>
                      {wallet.share && (
                        <div className="text-xs text-[var(--arv-text-muted)]">
                          {wallet.share}% از عرضه کل
                        </div>
                      )}
                    </div>
                  </div>

                  {wallet.hasWallet && (
                    <div className="flex items-center gap-1">
                      {wallet.hasBiometric && (
                        <div className="w-8 h-8 rounded-lg bg-[var(--arv-success)]/15 flex items-center justify-center">
                          <Fingerprint size={16} className="text-[var(--arv-success)]" />
                        </div>
                      )}
                      <div className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></div>
                    </div>
                  )}
                </div>

                {wallet.address ? (
                  <>
                    <div className="mb-3">
                      <label className="text-xs text-[var(--arv-text-muted)] mb-1 block">
                        آدرس
                      </label>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-gold)]/20">
                        <code className="flex-1 font-mono text-xs overflow-hidden text-ellipsis">
                          {hideAddress[wallet.id]
                            ? '•'.repeat(42)
                            : wallet.address}
                        </code>
                        <button
                          onClick={() => toggleHide(wallet.id)}
                          className="text-[var(--arv-text-muted)] hover:text-white"
                        >
                          {hideAddress[wallet.id] ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(wallet.address, wallet.id)}
                          className="text-[var(--arv-gold)] hover:text-[var(--arv-gold-light)]"
                        >
                          {copiedId === wallet.id ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {wallet.amount && (
                      <div className="mb-4">
                        <div className="text-xs text-[var(--arv-text-muted)] mb-1">
                          موجودی اولیه
                        </div>
                        <div className="text-2xl font-bold gold-gradient">
                          {Number(wallet.amount).toLocaleString('fa-IR')} ARV
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {wallet.hasWallet ? (
                        <>
                          <GradientButton variant="gold" size="sm" href={`/wallets/${wallet.id}`}>
                            ورود
                          </GradientButton>
                          <GradientButton variant="outline" size="sm" onClick={() => {}}>
                            <Trash2 size={14} />
                          </GradientButton>
                        </>
                      ) : (
                        <>
                          <GradientButton
                            variant="gold"
                            size="sm"
                            href={`/wallets/restore?wallet=${wallet.id}`}
                            icon={<KeyRound size={14} />}
                          >
                            ساخت / بازیابی
                          </GradientButton>
                          <a
                            href={`${ARV_CONFIG.links.bscscanMainWallet}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl text-xs border border-[var(--arv-gold)]/40 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/10 flex items-center gap-1"
                          >
                            BscScan <ExternalLink size={12} />
                          </a>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-sm text-[var(--arv-text-muted)] mb-4">
                      هنوز کیف پولی نساخته‌اید
                    </div>
                    <div className="flex gap-2 justify-center">
                      <GradientButton
                        variant="gold"
                        size="sm"
                        href="/wallets/create"
                        icon={<Plus size={14} />}
                      >
                        ساخت کیف جدید
                      </GradientButton>
                      <GradientButton
                        variant="outline"
                        size="sm"
                        href="/wallets/restore"
                        icon={<RotateCcw size={14} />}
                      >
                        بازیابی
                      </GradientButton>
                    </div>
                  </div>
                )}
              </GlowCard>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/wallets/create">
              <GlowCard glowColor="gold" hover>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--arv-gold)]/15 flex items-center justify-center">
                    <Plus size={24} className="text-[var(--arv-gold)]" />
                  </div>
                  <div>
                    <div className="font-bold">ساخت کیف جدید</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">
                      ۱۲ کلمه بازیابی
                    </div>
                  </div>
                </div>
              </GlowCard>
            </Link>

            <Link href="/wallets/restore">
              <GlowCard glowColor="blue" hover>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-400/15 flex items-center justify-center">
                    <RotateCcw size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="font-bold">بازیابی</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">
                      ۱۲ کلمه یا ۶۴ کاراکتر
                    </div>
                  </div>
                </div>
              </GlowCard>
            </Link>
          </div>

          {/* Info */}
          <GlowCard glowColor="gold">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-[var(--arv-gold)] flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold mb-2">امنیت کیف پول</div>
                <ul className="text-sm text-[var(--arv-text-muted)] space-y-1 list-disc pr-4">
                  <li>کلید خصوصی شما فقط روی دستگاه شما ذخیره می‌شود (رمزنگاری‌شده)</li>
                  <li>هرگز کلید خصوصی خود را با کسی به اشتراک نگذارید</li>
                  <li>۱۲ کلمه بازیابی را در جای امن یادداشت کنید</li>
                  <li>اثر انگشت را برای امنیت بیشتر فعال کنید</li>
                </ul>
              </div>
            </div>
          </GlowCard>

        </div>
      </main>
    </div>
  );
}
