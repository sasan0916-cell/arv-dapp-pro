'use client';

export default function MarketChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-[var(--arv-text-muted)] text-sm">
        Loading chart data...
      </div>
    );
  }

  // محاسبه مینیمم و ماکسیمم برای مقیاس‌بندی
  const min = Math.min(...data.map((d) => d.low || 0));
  const max = Math.max(...data.map((d) => d.high || 0));
  const range = max - min || 1;
  const width = 800;
  const height = 400;

  // تبدیل دیتا به نقاط SVG
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.close - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // برای پر کردن زیر نمودار (گرادیانت)
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="w-full h-[400px] relative bg-[var(--arv-blue-dark)]/40 rounded-xl overflow-hidden border border-[var(--arv-gold)]/20 mt-4">
      {/* نشانگر قیمت فعلی */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <div className="text-[var(--arv-gold)] font-bold text-lg">
          ${data[data.length - 1]?.close.toFixed(6) || '0.000000'}
        </div>
        <div className="text-[10px] text-[var(--arv-text-muted)]">ARV / BNB</div>
      </div>
      
      {/* برچسب DEMO */}
      <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold">
        DEMO
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ناحیه زیر نمودار */}
        <polygon
          fill="url(#areaGradient)"
          points={areaPoints}
        />

        {/* خط اصلی نمودار */}
        <polyline
          fill="none"
          stroke="#d4af37"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </div>
  );
}
