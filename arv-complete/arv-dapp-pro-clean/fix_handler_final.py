import re

path = 'app/referral/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ۱. حذف هر نسخه خراب یا تکراری از تابع (اگر وجود داره)
content = re.sub(r"const handleRegisterOnChain = async \(\) => \{.*?\n  \};\n", "", content, flags=re.DOTALL)

# ۲. کد کامل و تمیز تابع
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

# ۳. پیدا کردن اولین "return (" در کامپوننت و تزریق تابع قبل از آن
idx = content.find("  return (")
if idx != -1:
    content = content[:idx] + handler_code + content[idx:]
    print("✅ تابع handleRegisterOnChain با موفقیت تزریق شد.")
else:
    print("⚠️ خطای عجیب: return پیدا نشد!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
