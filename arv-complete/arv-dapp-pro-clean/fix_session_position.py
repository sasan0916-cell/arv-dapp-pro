import re

path = 'app/settings/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ۱. پیدا کردن بلوک مدیریت نشست‌ها و برش اون
pattern = r"\s*\{\/\* 🔗 مدیریت نشست‌ها \(Session Management\) \*\/\}.*?<\/GlowCard>"
match = re.search(pattern, content, re.DOTALL)

if match:
    session_block = match.group(0)
    # حذف از محل فعلی (داخل مودال)
    content = content.replace(session_block, "")
    
    # ۲. پیدا کردن محل درست برای درج (قبل از بخش Danger Zone)
    danger_idx = content.find("{/* Danger Zone */}")
    if danger_idx == -1:
        # اگر Danger Zone پیدا نشد، قبل از مودال 2FA بذار
        danger_idx = content.find("{show2FAModal && (")
        
    if danger_idx != -1:
        content = content[:danger_idx] + session_block + "\n\n            " + content[danger_idx:]
        print("✅ کارت مدیریت نشست‌ها به بیرون از مودال و جای درست منتقل شد")
    else:
        print("⚠️ محل مناسبی برای درج پیدا نشد")
else:
    print("⚠️ بلوک مدیریت نشست‌ها پیدا نشد")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
