import re

path = 'app/market/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ۱. رفع حلقه بی‌نهایت با اضافه کردن [] به useEffect
old_effect = """  useEffect(() => {
    load(true);
    const id = window.setInterval(() => load(true), 60000);
    return () => window.clearInterval(id);
  });"""
new_effect = """  useEffect(() => {
    load(true);
    const id = window.setInterval(() => load(true), 60000);
    return () => window.clearInterval(id);
  }, [load]); // 👈 اضافه کردن dependency array"""
if old_effect in content:
    content = content.replace(old_effect, new_effect)
    print("✅ حلقه بی‌نهایت useEffect رفع شد")

# ۲. حذف State مربوط به chartMode (چون دیگه کامپوننت تریدینگ‌ویو وجود نداره)
content = re.sub(r"  const \[chartMode, setChartMode\] = useState<.*?\(.*?\);\n", "", content)
print("✅ State مربوط به TradingView حذف شد")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ تغییرات اعمال شد")
