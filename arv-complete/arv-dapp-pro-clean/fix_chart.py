import json, re

path = 'app/market/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ۱. اصلاح ایمن ارتفاع کانتینر (فقط روی همون div خاص)
content = content.replace(
    '<div ref={chartContainerRef} className="w-full" />',
    '<div ref={chartContainerRef} className="w-full h-[400px]" />'
)

# ۲. خواندن نسخه کتابخانه
try:
    with open('node_modules/lightweight-charts/package.json', encoding='utf-8') as f:
        version = json.load(f)['version']
    major, minor = map(int, version.split('.')[:2])
    print("📦 version:", version)
except Exception as e:
    print("Error reading version:", e)
    version = "0.0.0"
    major, minor = 0, 0

# ۳. اعمال تغییرات بر اساس نسخه
if (major, minor) >= (4, 1):
    content = re.sub(r"[ \t]*width: chartContainerRef\.current\.clientWidth,\n", "", content)
    content = re.sub(r"[ \t]*height: 400,\n", "", content)
    
    if 'autoSize: true' not in content:
        content, n = re.subn(
            r"(createChart\(chartContainerRef\.current,\s*\{\n)",
            r"\1        autoSize: true,\n",
            content,
            count=1
        )
        print("✅ autoSize inserted:", n)
        
    content = re.sub(
        r"\s*const handleResize = \(\) => \{.*?\};\s*window\.addEventListener\('resize', handleResize\);\s*return \(\) => \{\s*window\.removeEventListener\('resize', handleResize\);\s*chart\.remove\(\);\s*\};",
        "\n    return () => {\n      chart.remove();\n    };",
        content,
        flags=re.S
    )
else:
    print("⚠️ version < 4.1: autoSize not supported, keep manual resize")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ saved")
