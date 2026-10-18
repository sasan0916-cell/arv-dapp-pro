'use client';

export default function MarketChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-red-500 border-2 border-red-500 rounded-xl">
        No Data Passed to Chart
      </div>
    );
  }

  const min = Math.min(...data.map((d) => d.low || 0));
  const max = Math.max(...data.map((d) => d.high || 0));
  const range = max - min || 1;
  const width = 800;
  const height = 400;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.close - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-[400px] relative border border-green-500 rounded-xl overflow-hidden bg-black/20">
      <div className="absolute top-2 left-2 text-xs text-white z-10 bg-black/50 p-1 rounded">
        Points: {data.length}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          points={points}
        />
      </svg>
    </div>
  );
}
