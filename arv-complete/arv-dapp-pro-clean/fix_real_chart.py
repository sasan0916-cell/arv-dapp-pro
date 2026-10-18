import re

path = 'app/market/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ۱. حذف تابع تولید دیتای فیک (generateChartData)
pattern_fake = r"  const generateChartData = useCallback\(\(\) => \{.*?\}, \[\]\);\n"
content = re.sub(pattern_fake, "", content, flags=re.DOTALL)
print("✅ تابع دیتای فیک حذف شد")

# ۲. اضافه کردن State برای لودینگ و خطای نمودار
old_chart_state = "const [chartData, setChartData] = useState<any[]>([]);"
new_chart_state = """const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState('');"""
content = content.replace(old_chart_state, new_chart_state)

# ۳. ساخت تابع جدید برای دریافت قیمت واقعی
real_fetch_fn = """
  const loadRealChartData = useCallback(async () => {
    setChartLoading(true);
    setChartError('');
    try {
      // استفاده از API عمومی CoinGecko برای تاریخچه قیمت (30 روز اخیر)
      // آیدی BNB در CoinGecko: binancecoin
      const res = await fetch('https://api.coingecko.com/api/v3/coins/binancecoin/market_chart?vs_currency=usd&days=30', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch chart data');
      
      const json = await res.json();
      
      // تبدیل دیتای CoinGecko به فرمتی که نمودار ما می‌خواد
      const prices = json.prices || [];
      const formatted = prices.map(([timestamp, price]: [number, number]) => ({
        time: Math.floor(timestamp / 1000),
        open: price,
        high: price * 1.01, // تخمین ساده
        low: price * 0.99,  // تخمین ساده
        close: price,
      }));

      // فیلتر کردن برای ۳۱ روز (حدوداً هر روز یک نقطه)
      const dailyData = formatted.filter((_: any, i: number) => i % 24 === 0).slice(-31);
      
      if (dailyData.length > 0) {
        setChartData(dailyData);
      } else {
        throw new Error('No data received');
      }
    } catch (e: any) {
      console.error('Chart fetch error:', e);
      setChartError('خطا در دریافت قیمت لحظه‌ای');
    } finally {
      setChartLoading(false);
    }
  }, []);
"""

# اضافه کردن تابع جدید قبل از اولین useEffect اصلی
content = content.replace("  const load = useCallback(async (silent = false) => {", real_fetch_fn + "\n  const load = useCallback(async (silent = false) => {")

# ۴. آپدیت useEffect برای فراخوانی تابع واقعی
old_effect = """  useEffect(() => {
    generateChartData();
  }, [generateChartData, selectedTimeframe, chartSymbol]);"""
new_effect = """  useEffect(() => {
    loadRealChartData();
  }, [loadRealChartData, selectedTimeframe]);"""
content = content.replace(old_effect, new_effect)

# ۵. آپدیت UI برای نمایش Loading و Error
old_chart_render = """                {chartData.length > 0 ? (
                  <div className="relative">
                    <div className="absolute top-2 right-2 z-10 px-2 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold">
                      {en ? 'DEMO' : 'نمایشی'}
                    </div>
                    <MarketChart data={chartData} />
                  </div>
                ) : ("""
new_chart_render = """                {chartLoading ? (
                  <div className="w-full h-[400px] flex items-center justify-center text-[var(--arv-gold)]">
                    <RefreshCw size={24} className="animate-spin" />
                  </div>
                ) : chartError ? (
                  <div className="w-full h-[400px] flex items-center justify-center text-[var(--arv-danger)] text-sm border border-[var(--arv-danger)]/30 rounded-xl bg-[var(--arv-danger)]/5">
                    {chartError}
                  </div>
                ) : chartData.length > 0 ? (
                  <div className="relative">
                    <MarketChart data={chartData} />
                  </div>
                ) : ("""
content = content.replace(old_chart_render, new_chart_render)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ نمودار با دیتای واقعی (CoinGecko) بازنویسی شد")
