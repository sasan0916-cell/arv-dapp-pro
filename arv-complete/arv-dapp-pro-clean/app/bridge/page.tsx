'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeftRight, ExternalLink, Info, AlertTriangle, Zap } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import TokenLogo from '@/components/ui/TokenLogo';
import { useLanguage } from '@/lib/i18n';

interface BridgeOption {
  name: string;
  description: string;
  descriptionEn: string;
  url: string;
  chains: string[];
  color: string;
  icon: string;
}

const BRIDGES: BridgeOption[] = [
  {
    name: 'Stargate',
    description: 'پل غیرمتمرکز با نقدینگی بالا، پشتیبانی از BSC و ۲۰+ شبکه',
    descriptionEn: 'Decentralized bridge with deep liquidity, supports BSC and 20+ chains',
    url: 'https://stargate.finance/bridge?srcChain=bsc&dstChain=ethereum&srcToken=0x55d398326f99059fF775485246999027B3197955',
    chains: ['BSC', 'Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche'],
    color: 'gold',
    icon: '⭐',
  },
  {
    name: 'LayerZero',
    description: 'پروتکل بین‌زنجیره‌ای با امنیت بالا',
    descriptionEn: 'Omnichain protocol with high security',
    url: 'https://layerzero.network/',
    chains: ['BSC', 'Ethereum', 'Polygon', 'Avalanche', 'Fantom'],
    color: 'blue',
    icon: '🔗',
  },
  {
    name: 'Synapse',
    description: 'پل سریع و ارزان بین شبکه‌ها',
    descriptionEn: 'Fast and cheap cross-chain bridge',
    url: 'https://synapseprotocol.com/',
    chains: ['BSC', 'Ethereum', 'Polygon', 'Avalanche'],
    color: 'green',
    icon: '⚡',
  },
];

export default function BridgePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const en = language === 'en';

  const [fromChain, setFromChain] = useState('BSC');
  const [toChain, setToChain] = useState('Ethereum');
  const [token, setToken] = useState('USDT');

  const chains = ['BSC', 'Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'Fantom'];
  const tokens = ['USDT', 'USDC', 'BNB', 'ETH', 'BTC'];

  return (
    <div className="min-h-screen bg-[var(--arv-blue-dark)]">
      <div className="p-4 md:p-6 max-w-lg mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]">
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold gold-gradient">{en ? 'Cross-Chain Bridge' : 'پل بین شبکه‌ها'}</h1>
            <p className="text-xs text-[var(--arv-text-muted)] mt-1">
              {en ? 'Transfer tokens between different blockchains' : 'انتقال توکن بین شبکه‌های مختلف'}
            </p>
          </div>
        </div>

        <GlowCard glowColor="gold">
          <div className="text-xs text-[var(--arv-text-muted)] mb-2">{en ? 'Select Route' : 'انتخاب مسیر'}</div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div className="text-xs text-[var(--arv-text-muted)] mb-1">{en ? 'From' : 'از'}</div>
              <select value={fromChain} onChange={(e) => setFromChain(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/30 text-white outline-none">
                {chains.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <div className="text-xs text-[var(--arv-text-muted)] mb-1">{en ? 'To' : 'به'}</div>
              <select value={toChain} onChange={(e) => setToChain(e.target.value)} className="w-full p-3 rounded-xl bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/30 text-white outline-none">
                {chains.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs text-[var(--arv-text-muted)] mb-1">{en ? 'Token' : 'توکن'}</div>
            <div className="flex items-center gap-2">
              <TokenLogo symbol={token} size={32} />
              <select value={token} onChange={(e) => setToken(e.target.value)} className="flex-1 p-3 rounded-xl bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/30 text-white outline-none">
                {tokens.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center my-3">
            <div className="w-10 h-10 rounded-full bg-[var(--arv-gold)]/15 flex items-center justify-center">
              <ArrowLeftRight size={18} className="text-[var(--arv-gold)]" />
            </div>
          </div>

          <div className="text-center text-xs text-[var(--arv-gold)] font-bold">
            {fromChain} → {toChain}
          </div>
        </GlowCard>

        <GlowCard glowColor="blue">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-[var(--arv-gold)]" />
            <div className="text-sm font-bold">{en ? 'Available Bridges' : 'پل‌های موجود'}</div>
          </div>

          <div className="space-y-3">
            {BRIDGES.map((bridge) => (
              <a
                key={bridge.name}
                href={bridge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl bg-[var(--arv-blue)]/30 border border-[var(--arv-blue)] hover:border-[var(--arv-gold)]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{bridge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm flex items-center gap-1">
                      {bridge.name}
                      <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
                    </div>
                    <div className="text-[10px] text-[var(--arv-text-muted)] mt-0.5">
                      {en ? bridge.descriptionEn : bridge.description}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bridge.chains.slice(0, 4).map((chain) => (
                        <span key={chain} className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--arv-gold)]/10 text-[var(--arv-gold)]">
                          {chain}
                        </span>
                      ))}
                      {bridge.chains.length > 4 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--arv-gold)]/10 text-[var(--arv-gold)]">
                          +{bridge.chains.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-[var(--arv-gold)] rotate-180 group-hover:-translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </GlowCard>

        <GlowCard glowColor="gold">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-1" />
            <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
              <div className="font-bold text-yellow-400 mb-1">{en ? 'Important' : 'مهم'}</div>
              <div>• {en ? 'Bridge transfers usually take 5-30 minutes' : 'انتقال پل معمولاً ۵-۳۰ دقیقه طول می‌کشد'}</div>
              <div>• {en ? 'Always verify the destination chain and address' : 'حتماً شبکه مقصد و آدرس را بررسی کنید'}</div>
              <div>• {en ? 'Fees vary by bridge and network congestion' : 'کارمزد بسته به پل و شلوغی شبکه متفاوت است'}</div>
              <div>• {en ? 'ARV Super DApp only provides links - all bridges are third-party services' : 'ARV Super DApp فقط لینک می‌دهد — همه پل‌ها سرویس‌های شخص ثالث هستند'}</div>
            </div>
          </div>
        </GlowCard>

        <GlowCard glowColor="blue">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-[var(--arv-gold)] shrink-0 mt-1" />
            <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
              <div className="font-bold text-white mb-1">{en ? 'Why use a bridge?' : 'چرا از پل استفاده کنیم؟'}</div>
              <div>• {en ? 'Move assets between blockchains' : 'انتقال دارایی بین بلاک‌چین‌ها'}</div>
              <div>• {en ? 'Access DApps on other networks' : 'دسترسی به DAppهای شبکه‌های دیگر'}</div>
              <div>• {en ? 'Take advantage of lower fees elsewhere' : 'استفاده از کارمزد کمتر در شبکه‌های دیگر'}</div>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
