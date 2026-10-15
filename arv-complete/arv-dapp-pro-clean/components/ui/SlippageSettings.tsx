'use client';
import { useState } from 'react';
import { Settings, AlertTriangle, Clock } from 'lucide-react';

interface SlippageSettingsProps {
  slippage: number;
  onSlippageChange: (v: number) => void;
  deadline: number;
  onDeadlineChange: (v: number) => void;
  onClose: () => void;
}

export function SlippageSettings({ slippage, onSlippageChange, deadline, onDeadlineChange, onClose }: SlippageSettingsProps) {
  const [custom, setCustom] = useState('');

  const presets = [0.1, 0.5, 1.0, 3.0];

  const applyCustom = () => {
    const v = parseFloat(custom);
    if (!isNaN(v) && v > 0 && v <= 50) onSlippageChange(v);
  };

  return (
    <div className="p-4 rounded-xl bg-[var(--arv-blue-dark)] border border-[var(--arv-gold)]/30 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Settings size={14} className="text-[var(--arv-gold)]" />
          تنظیمات پیشرفته
        </div>
        <button onClick={onClose} className="text-xs text-[var(--arv-text-muted)]">بستن</button>
      </div>

      <div>
        <div className="text-xs text-[var(--arv-text-muted)] mb-2">Slippage Tolerance</div>
        <div className="flex gap-2 mb-2">
          {presets.map((v) => (
            <button
              key={v}
              onClick={() => onSlippageChange(v)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                slippage === v ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)]' : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'
              }`}
            >
              {v}%
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="سفارشی..."
            className="flex-1 bg-[var(--arv-blue)]/40 rounded-lg px-3 py-2 outline-none text-xs text-white"
            dir="ltr"
          />
          <button onClick={applyCustom} className="px-3 py-2 rounded-lg bg-[var(--arv-gold)]/20 text-[var(--arv-gold)] text-xs font-bold">اعمال</button>
        </div>
        {slippage > 5 && (
          <div className="mt-2 text-[11px] text-yellow-400 flex items-center gap-1">
            <AlertTriangle size={12} /> Slippage بالا — خطر front-running
          </div>
        )}
      </div>

      <div>
        <div className="text-xs text-[var(--arv-text-muted)] mb-2 flex items-center gap-1"><Clock size={12} /> مهلت تراکنش (دقیقه)</div>
        <div className="flex gap-2">
          {[10, 20, 30, 60].map((v) => (
            <button
              key={v}
              onClick={() => onDeadlineChange(v)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                deadline === v ? 'bg-[var(--arv-gold)] text-[var(--arv-blue-dark)]' : 'bg-[var(--arv-blue)]/40 text-[var(--arv-text-muted)]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
