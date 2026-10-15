'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Repeat, Plus, Trash2, Power, AlertCircle, Check, Clock } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import TokenLogo from '@/components/ui/TokenLogo';
import { useLanguage } from '@/lib/i18n';
import {
  loadDCASchedules,
  addDCASchedule,
  removeDCASchedule,
  toggleDCASchedule,
  formatInterval,
  type DCASchedule,
} from '@/lib/services/dca-service';

const TOKENS = ['BNB', 'USDT', 'USDC', 'BTC', 'ETH', 'ARV'];
const INTERVALS = [1, 7, 14, 30];

export default function DCAPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const en = language === 'en';

  const [schedules, setSchedules] = useState<DCASchedule[]>([]);
  const [fromSymbol, setFromSymbol] = useState('USDT');
  const [toSymbol, setToSymbol] = useState('BNB');
  const [amount, setAmount] = useState('');
  const [intervalDays, setIntervalDays] = useState(7);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDCASchedules().then((list) => {
      setSchedules(list);
      setLoading(false);
    });
  }, []);

  const handleAdd = async () => {
    setError('');
    setSuccess('');
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError(en ? 'Amount must be a number' : 'مقدار باید عدد باشد');
      return;
    }
    if (fromSymbol === toSymbol) {
      setError(en ? 'Tokens must be different' : 'توکن‌ها باید متفاوت باشند');
      return;
    }
    const next = await addDCASchedule({ fromSymbol, toSymbol, amount: amt, intervalDays });
    setSchedules(next);
    setAmount('');
    setSuccess(en ? 'DCA added' : 'DCA اضافه شد');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleRemove = async (id: string) => {
    const next = await removeDCASchedule(id);
    setSchedules(next);
  };

  const handleToggle = async (id: string) => {
    const next = await toggleDCASchedule(id);
    setSchedules(next);
  };

  const formatTime = (ts: number) => {
    const diff = ts - Date.now();
    if (diff <= 0) return en ? 'Due now' : 'سررسید شده';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return en ? `${days}d ${hours}h` : `${days} روز و ${hours} ساعت`;
    const mins = Math.floor((diff % 3600000) / 60000);
    return en ? `${hours}h ${mins}m` : `${hours} ساعت و ${mins} دقیقه`;
  };

  return (
    <div className="min-h-screen bg-[var(--arv-blue-dark)]">
      <div className="p-4 md:p-6 max-w-lg mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-[var(--arv-blue)]/40 text-[var(--arv-gold)]">
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold gold-gradient">{en ? 'DCA' : 'خرید دوره‌ای (DCA)'}</h1>
            <p className="text-xs text-[var(--arv-text-muted)] mt-1">
              {en ? 'Automate recurring buys with reminders' : 'خریدهای دوره‌ای با یادآوری'}
            </p>
          </div>
        </div>

        <GlowCard glowColor="gold">
          <div className="text-xs text-[var(--arv-text-muted)] mb-2">{en ? 'New DCA' : 'DCA جدید'}</div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div className="text-xs text-[var(--arv-text-muted)] mb-1">{en ? 'From' : 'از'}</div>
              <div className="flex items-center gap-2">
                <TokenLogo symbol={fromSymbol} size={24} />
                <select value={fromSymbol} onChange={(e) => setFromSymbol(e.target.value)} className="flex-1 p-2 rounded-lg bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/30 text-white outline-none text-sm">
                  {TOKENS.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--arv-text-muted)] mb-1">{en ? 'To' : 'به'}</div>
              <div className="flex items-center gap-2">
                <TokenLogo symbol={toSymbol} size={24} />
                <select value={toSymbol} onChange={(e) => setToSymbol(e.target.value)} className="flex-1 p-2 rounded-lg bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/30 text-white outline-none text-sm">
                  {TOKENS.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs text-[var(--arv-text-muted)] mb-1">{en ? 'Amount' : 'مقدار'}</div>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" className="w-full p-3 rounded-xl bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/30 text-white outline-none" dir="ltr" />
          </div>

          <div className="mb-3">
            <div className="text-xs text-[var(--arv-text-muted)] mb-2">{en ? 'Interval' : 'بازه'}</div>
            <div className="grid grid-cols-4 gap-2">
              {INTERVALS.map((d) => (
                <button key={d} onClick={() => setIntervalDays(d)} className={`py-2 rounded-lg text-xs font-bold transition-all ${intervalDays === d ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)]' : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'}`}>
                  {d === 1 ? (en ? 'Daily' : 'روزانه') : d === 7 ? (en ? 'Weekly' : 'هفتگی') : d === 14 ? (en ? 'Bi-weekly' : '۲ هفته') : (en ? 'Monthly' : 'ماهانه')}
                </button>
              ))}
            </div>
          </div>

          <GradientButton variant="gold" size="md" fullWidth onClick={handleAdd} icon={<Plus size={16} />}>
            {en ? 'Add DCA' : 'افزودن DCA'}
          </GradientButton>

          {error && (<div className="mt-3 flex items-center gap-2 text-red-400 text-xs"><AlertCircle size={14} /> {error}</div>)}
          {success && (<div className="mt-3 flex items-center gap-2 text-[var(--arv-success)] text-xs"><Check size={14} /> {success}</div>)}
        </GlowCard>

        <GlowCard glowColor="blue">
          <div className="flex items-center gap-2 mb-3">
            <Repeat size={16} className="text-[var(--arv-gold)]" />
            <div className="text-sm font-bold">{en ? 'Your DCA schedules' : 'برنامه‌های DCA شما'}</div>
            <div className="text-xs text-[var(--arv-text-muted)] mr-auto">({schedules.length})</div>
          </div>

          {loading ? (<div className="text-center py-6 text-xs text-[var(--arv-text-muted)]">{en ? 'Loading...' : 'در حال بارگذاری...'}</div>) : schedules.length === 0 ? (
            <div className="text-center py-6 text-xs text-[var(--arv-text-muted)]">{en ? 'No DCA schedules yet' : 'هنوز برنامه DCA ندارید'}</div>
          ) : (
            <div className="space-y-2">
              {schedules.map((s) => (
                <div key={s.id} className={`p-3 rounded-xl ${s.active ? 'bg-[var(--arv-blue)]/30' : 'bg-[var(--arv-blue)]/10 opacity-60'}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <TokenLogo symbol={s.fromSymbol} size={24} />
                      <ArrowRight size={12} className="text-[var(--arv-gold)] rotate-180" />
                      <TokenLogo symbol={s.toSymbol} size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{s.amount} {s.fromSymbol} → {s.toSymbol}</div>
                      <div className="text-[10px] text-[var(--arv-text-muted)] flex items-center gap-2">
                        <Clock size={10} /> {formatInterval(s.intervalDays, en)}
                        <span className={s.active ? 'text-[var(--arv-gold)]' : ''}>
                          {s.active ? `• ${formatTime(s.nextRun)}` : (en ? '• Paused' : '• متوقف')}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleToggle(s.id)} className={`p-2 rounded-lg ${s.active ? 'text-[var(--arv-success)] hover:bg-[var(--arv-success)]/20' : 'text-[var(--arv-text-muted)] hover:bg-[var(--arv-blue)]/40'}`}>
                      <Power size={14} />
                    </button>
                    <button onClick={() => handleRemove(s.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {s.totalRuns > 0 && (
                    <div className="mt-2 text-[10px] text-[var(--arv-text-muted)]">
                      {en ? `Runs: ${s.totalRuns}` : `اجرا: ${s.totalRuns} بار`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlowCard>

        <GlowCard glowColor="gold">
          <div className="text-xs text-[var(--arv-text-muted)] space-y-1">
            <div className="font-bold text-white mb-1">{en ? 'How DCA works' : 'نحوه کار DCA'}</div>
            <div>• {en ? 'DCA sends you a reminder at each interval' : 'DCA در هر بازه به شما یادآوری می‌کند'}</div>
            <div>• {en ? 'You confirm the swap with one click' : 'شما با یک کلیک سواپ را تأیید می‌کنید'}</div>
            <div>• {en ? 'This is NOT automatic - you stay in control' : 'این خودکار نیست — شما کنترل دارید'}</div>
            <div>• {en ? 'Schedules are stored on your device' : 'برنامه‌ها روی دستگاه شما ذخیره می‌شوند'}</div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
