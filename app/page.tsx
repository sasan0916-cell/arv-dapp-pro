'use client';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import {
  Wallet, Coins, Gift, ExternalLink, FileText,
  ChevronLeft, Shield, BookOpen, RefreshCw,
} from 'lucide-react';
import { ARV_CONFIG } from '@/lib/arv-config';
import { getARVBalance, getTokenInfo } from '@/lib/services/token-service';
import { formatNumber, shortAddress } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const [arvBalance, setArvBalance] = useState<bigint>(0n);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadTokenInfo(); }, []);
  useEffect(() => { if (address) loadBalance(address); }, [address]);

  async function loadTokenInfo() {
    try { setTokenInfo(await getTokenInfo()); } catch (e) { console.error(e); }
  }
  async function loadBalance(addr: string) {
    setLoading(true);
    try { setArvBalance(await getARVBalance(addr)); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const decimals = tokenInfo?.decimals ?? 18;
  const formattedBalance = formatUnits(arvBalance, decimals);
  const totalSupplyFormatted = tokenInfo ? formatUnits(tokenInfo.totalSupply, decimals) : '0';

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        
        <div className="p-4 md:p-6 space-y-6">

          <section className="arv-card">
            <div className="text-center mb-4">
              <span className="text-xs text-[var(--arv-gold)]">{ARV_CONFIG.token.tagline}</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-right">
                <h1 className="text-3xl md:text-5xl font-bold mb-3">
                  <span className="gold-gradient">{ARV_CONFIG.token.name}</span>
                </h1>
                <p className="text-xl text-[var(--arv-gold)] mb-3">{ARV_CONFIG.token.symbol} Token</p>
                <p className="text-sm text-[var(--arv-text-muted)] leading-relaxed mb-6">
                  مرجع رسمی معرفی ARV؛ توکن اکوسیستم اروند خبر با زیرساخت فعال روی {ARV_CONFIG.network.nameShort}
                </p>
                <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                  <a href="/wallets" className="arv-btn-gold flex items-center gap-2 text-sm">
                    <Wallet size={16} /> باز کردن کیف پول
                  </a>
                  <a href="/about" className="px-6 py-3 rounded-xl border border-[var(--arv-gold)]/40 text-[var(--arv-gold)] hover:bg-[var(--arv-gold)]/10 text-sm flex items-center gap-2">
                    <ChevronLeft size={16} /> بیشتر بدانید
                  </a>
                </div>
              </div>
              <div className="w-40 h-40 md:w-56 md:h-56 relative rounded-full overflow-hidden shadow-2xl shadow-[var(--arv-gold)]/30 flex-shrink-0">
  <Image
    src="/arv-logo.png"
    alt="Arvand Khabar Token"
    fill
    className="object-contain"
    priority
  />
</div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatBigCard title="کیف پول شخصی" subtitle="غیرامانی و مستقل" icon={<Wallet size={24} />} extra="ورود به کیف پول" href="/wallets" color="blue" />
            <StatBigCard title="عرضه فعلی تست" subtitle={`${ARV_CONFIG.token.symbol} ${formatNumber(Number(totalSupplyFormatted))}`} icon={<Coins size={24} />} extra="قرارداد Testnet" color="gold" />
            <StatBigCard title="قرارداد فعال" subtitle={shortAddress(ARV_CONFIG.token.address, 8)} icon={<FileText size={24} />} extra="مشاهده در BscScan" href={ARV_CONFIG.links.bscscanToken} color="green" />
          </section>

          <section className="arv-card border-r-4 border-[var(--arv-gold)]">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[var(--arv-gold)] flex-shrink-0" />
              <p className="text-sm text-[var(--arv-text-muted)]">
                <strong className="text-white">وضعیت فعلی:</strong> قرارداد و عرضه فعلی مربوط به Testnet است. عرضه هدف در Mainnet آینده {formatNumber(Number(ARV_CONFIG.token.totalSupplyMainnet))} ARV خواهد بود.
              </p>
            </div>
          </section>

          <section className="arv-card border-r-4 border-[var(--arv-warning)]">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-[var(--arv-warning)] flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-[var(--arv-warning)] mb-2">اطلاعیه مهم</div>
                <p className="text-sm text-[var(--arv-text-muted)] leading-relaxed">
                  توجه: ARV در حال حاضر یک توکن در مرحله توسعه و آزمایش است و فعال به‌عنوان سرمایه‌گذاری یا ابزار مالی ارائه نمی‌شود.
                </p>
              </div>
            </div>
          </section>

          <section className="arv-card">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-[var(--arv-gold)]" />
              ARV؛ اکوسیستم در حال توسعه اروند خبر
            </h2>
            <p className="text-sm text-[var(--arv-text-muted)] leading-relaxed mb-6">
              ARV برای ایجاد یک مسیر مشخص میان فعالیت کاربران در سایت خبری اروند خبر و کاربرد توکن طراحی شده است.
              عرضه فعلی Testnet {formatNumber(Number(ARV_CONFIG.token.totalSupplyTestnet))} ARV است و برنامه عرضه در Mainnet،
              {formatNumber(Number(ARV_CONFIG.token.totalSupplyMainnet))} ARV با تخصیص {ARV_CONFIG.wallets.main.share}٪ برای کیف پول اصلی و {ARV_CONFIG.wallets.reward.share}٪ برای استخر پاداش است.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatSmall value="100M" label="هدف عرضه Mainnet" />
              <StatSmall value="10M" label="عرضه فعلی Testnet" />
              <StatSmall value="18" label="اعشار" />
              <StatSmall value="40/60" label="تخصیص Mainnet" />
            </div>
          </section>

          <section className="arv-card">
            <h2 className="text-lg font-bold mb-6 text-center">چطور با ARV شروع کنیم؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {ARV_CONFIG.steps.map((step) => (
                <div key={step.num} className="arv-card bg-[var(--arv-blue)]/20 text-center">
                  <div className="text-2xl font-bold gold-gradient mb-2">{String(step.num).padStart(2, '0')}</div>
                  <div className="font-bold mb-2 text-sm">{step.title}</div>
                  <p className="text-xs text-[var(--arv-text-muted)]">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {isConnected && (
            <section className="arv-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--arv-gold)]/10 flex items-center justify-center">
                    <Wallet size={20} className="text-[var(--arv-gold)]" />
                  </div>
                  <div>
                    <div className="font-bold">کیف پول شما</div>
                    <div className="text-xs text-[var(--arv-text-muted)]">{shortAddress(address!)}</div>
                  </div>
                </div>
                <button onClick={() => address && loadBalance(address)} className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]" disabled={loading}>
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              <div className="text-4xl font-bold gold-gradient mb-2">{formattedBalance}</div>
              <div className="text-sm text-[var(--arv-text-muted)]">ARV Tokens</div>
            </section>
          )}

          {tokenInfo && (
            <section className="arv-card">
              <h2 className="font-bold mb-4">اطلاعات توکن ARV</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <InfoRow label="نام" value={tokenInfo.name} />
                <InfoRow label="نماد" value={tokenInfo.symbol} />
                <InfoRow label="اعشار" value={tokenInfo.decimals.toString()} />
                <InfoRow label="شبکه" value={ARV_CONFIG.network.name} />
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}

function StatBigCard({ title, subtitle, icon, extra, href, color }: any) {
  const colorMap: any = { gold: 'text-[var(--arv-gold)]', blue: 'text-blue-400', green: 'text-[var(--arv-success)]' };
  const content = (
    <div className="arv-card hover:scale-[1.02] transition-transform cursor-pointer">
      <div className={`${colorMap[color]} mb-3`}>{icon}</div>
      <div className="font-bold mb-1">{title}</div>
      <div className="text-xl font-bold mb-3">{subtitle}</div>
      <div className="text-xs text-[var(--arv-text-muted)] flex items-center gap-1">
        {extra} <ExternalLink size={12} />
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

function StatSmall({ value, label }: any) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold gold-gradient">{value}</div>
      <div className="text-xs text-[var(--arv-text-muted)] mt-1">{label}</div>
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div>
      <div className="text-xs text-[var(--arv-text-muted)] mb-1">{label}</div>
      <div className="font-bold text-sm">{value}</div>
    </div>
  );
}
