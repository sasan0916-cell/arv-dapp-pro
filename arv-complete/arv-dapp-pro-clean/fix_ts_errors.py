import re

path = 'app/referral/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ۱. حذف ایمپورت تکراری که اسکریپت قبلی اضافه کرده بود
content = content.replace("import { Lock, CheckCircle, AlertCircle } from 'lucide-react';\n", "")

# ۲. اضافه کردن آیکون‌های جدید به ایمپورت اصلی lucide-react
# پیدا کردن خط ایمپورت اصلی lucide-react
lucide_match = re.search(r"import\s+\{([^}]+)\}\s+from\s+['\"]lucide-react['\"];", content)
if lucide_match:
    existing_icons = lucide_match.group(1)
    # اضافه کردن آیکون‌های جدید اگر وجود ندارند
    new_icons = []
    if 'Lock' not in existing_icons: new_icons.append('Lock')
    if 'CheckCircle' not in existing_icons: new_icons.append('CheckCircle')
    if 'AlertCircle' not in existing_icons: new_icons.append('AlertCircle')
    
    if new_icons:
        replacement = f"import {{ {existing_icons.strip()}, {', '.join(new_icons)} }} from 'lucide-react';"
        content = content.replace(lucide_match.group(0), replacement)
        print(f"✅ آیکون‌های {new_icons} به ایمپورت اصلی اضافه شدند.")

# ۳. تزریق تابع handleRegisterOnChain بعد از handleShare
handler_code = """
  const handleRegisterOnChain = async () => {
    if (!referralData) return;
    if (!password) {
      setTxMessage('لطفاً رمز عبور کیف پول را وارد کنید');
      setTxStatus('error');
      return;
    }
    setIsRegistering(true);
    setTxMessage('در حال ارسال تراکنش...');
    setTxStatus('idle');
    try {
      const wallet = await loadWallet('user', password);
      if (!wallet || !wallet.privateKey) {
        throw new Error('رمز عبور اشتباه است یا کیف پول یافت نشد');
      }
      await registerMyCodeOnChain(wallet.privateKey, referralData.code);
      setTxMessage('✅ کد شما با موفقیت روی بلاکچین ثبت شد!');
      setTxStatus('success');
      setPassword('');
    } catch (e: any) {
      setTxMessage('❌ خطا: ' + (e.message || 'تراکنش ناموفق بود'));
      setTxStatus('error');
    } finally {
      setIsRegistering(false);
    }
  };
"""

if 'handleRegisterOnChain' not in content:
    # پیدا کردن محل بسته شدن تابع handleShare
    share_pattern = r"(const handleShare = async \(\) => \{.*?\n  \};)"
    match = re.search(share_pattern, content, re.DOTALL)
    if match:
        content = content.replace(match.group(1), match.group(1) + "\n" + handler_code)
        print("✅ تابع handleRegisterOnChain به درستی تزریق شد.")
    else:
        # روش جایگزین: قبل از return اول
        content = content.replace("  return (", handler_code + "\n  return (", 1)
        print("✅ تابع با روش جایگزین تزریق شد.")
else:
    print("ℹ️ تابع از قبل وجود داشت.")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ فایل ذخیره شد.")
