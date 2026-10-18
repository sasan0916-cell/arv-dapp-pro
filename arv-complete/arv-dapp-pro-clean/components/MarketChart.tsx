'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function MarketChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="w-full h-[400px] flex items-center justify-center text-[var(--arv-text-muted)] text-sm">Loading chart data...</div>;
  }

  const chartData = data.map((d) => ({
    ...d,
    dateLabel: new Date(d.time * 1000).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="w-full h-[400px]" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" vertical={false} />
          <XAxis dataKey="dateLabel" stroke="rgba(212, 175, 55, 0.5)" tick={{ fill: 'rgba(212, 175, 55, 0.7)', fontSize: 10 }} tickMargin={10} />
          <YAxis domain={['auto', 'auto']} stroke="rgba(212, 175, 55, 0.5)" tick={{ fill: 'rgba(212, 175, 55, 0.7)', fontSize: 10 }} tickFormatter={(val) => val.toFixed(4)} />
          <Tooltip contentStyle={{ backgroundColor: '#0a1929', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#d4af37' }} labelStyle={{ color: '#fff' }} />
          <Area type="monotone" dataKey="close" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
