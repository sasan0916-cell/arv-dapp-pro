'use client';
import { useEffect, useRef, useState } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: 'dark' | 'light';
  height?: number;
}

const SYMBOL_MAP: Record<string, string> = {
  'ARV': 'BINANCE:BNBUSDT',
  'BNB': 'BINANCE:BNBUSDT',
  'BTC': 'BINANCE:BTCUSDT',
  'ETH': 'BINANCE:ETHUSDT',
  'SOL': 'BINANCE:SOLUSDT',
  'XRP': 'BINANCE:XRPUSDT',
  'USDT': 'BINANCE:USDTUSD',
  'USDC': 'BINANCE:USDCUSDT',
  'DOGE': 'BINANCE:DOGEUSDT',
  'ADA': 'BINANCE:ADAUSDT',
  'MATIC': 'BINANCE:MATICUSDT',
  'DOT': 'BINANCE:DOTUSDT',
  'SHIB': 'BINANCE:SHIBUSDT',
  'TRX': 'BINANCE:TRXUSDT',
  'CAKE': 'BINANCE:CAKEUSDT',
  'LINK': 'BINANCE:LINKUSDT',
  'UNI': 'BINANCE:UNIUSDT',
};

export function TradingViewWidget({ symbol = 'BNB', theme = 'dark', height = 400 }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const tvSymbol = SYMBOL_MAP[symbol] || `BINANCE:${symbol}USDT`;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: '60',
      timezone: 'Asia/Tehran',
      theme: theme,
      style: '1',
      locale: 'fa_IR',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      studies: ['STD;RSI', 'STD;MACD'],
    });

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = `${height}px`;
    widgetContainer.style.width = '100%';

    const innerContainer = document.createElement('div');
    innerContainer.className = 'tradingview-widget-container__widget';
    innerContainer.style.height = '100%';
    innerContainer.style.width = '100%';

    widgetContainer.appendChild(innerContainer);
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [symbol, theme, height]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--arv-blue-dark)] z-10">
          <div className="text-xs text-[var(--arv-text-muted)]">در حال بارگذاری TradingView...</div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
