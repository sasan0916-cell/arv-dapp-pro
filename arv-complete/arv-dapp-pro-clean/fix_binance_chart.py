import re

path = 'app/market/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# پیدا کردن تابع loadRealChartData و جایگزینی آن
pattern = r"  const loadRealChartData = useCallback\(async \(\) => \{.*?\}, \[\]\);\n"
new_fn = """  const loadRealChartData = useCallback(async () => {
    setChartLoading(true);
    setChartError('');
    try {
      // استفاده از API بایننس برای دریافت تاریخچه قیمت BNB/USDT (روزانه)
      const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BNBUSDT&interval=1d&limit=30', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      
      const json = await res.json();
      const formatted = json.map((k: any) => ({
        time: Math.floor(k[0] / 1000),
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
      }));
      
      setChartData(formatted);
    } catch (e: any) {
      console.error(e);
      setChartError('خطا در دریافت قیمت لحظه‌ای');
    } finally {
      setChartLoading(false);
    }
  }, []);
"""
content = re.sub(pattern, new_fn, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ تابع دیتای نمودار به API بایننس تغییر کرد")
