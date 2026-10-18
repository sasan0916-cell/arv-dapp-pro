import re

path = 'app/referral/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ۱. اضافه کردن ایمپورت‌ها
if 'registerMyCodeOnChain' not in content:
    content = content.replace(
        "import { useEffect, useState } from 'react';",
        "import { useEffect, useState } from 'react';\nimport { registerMyCodeOnChain } from '@/lib/services/referral-service';\nimport { loadWallet } from '@/lib/services/wallet-service';\nimport { Lock, CheckCircle, AlertCircle } from 'lucide-react';"
    )
    print("✅ ایمپورت‌ها اضافه شدند")

# ۲. اضافه کردن State ها
if 'const [isRegistering' not in content:
    content = content.replace(
        "const [copied, setCopied] = useState<'code' | 'link' | null>(null);",
        """const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [txMessage, setTxMessage] = useState('');
  const [txStatus, setTxStatus] = useState<'idle' | 'success' | 'error'>('idle');"""
    )
    print("✅ State ها اضافه شدند")

# ۳. اضافه کردن تابع ثبت روی بلاکچین
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

# درج تابع قبل از `return (`
if 'handleRegisterOnChain' not in content:
    content = content.replace("  return (", handler_code + "\n  return (", 1)
    print("✅ تابع ثبت روی بلاکچین اضافه شد")

# ۴. اضافه کردن UI (بعد از دکمه اشتراک‌گذاری)
old_share_btn = """            <GradientButton variant="gold" size="md" fullWidth onClick={handleShare} icon={<Share2 size={16} />}>
              {language === 'en' ? 'Share Invite Link' : 'اشتراک‌گذاری لینک دعوت'}
            </GradientButton>"""

new_share_btn = old_share_btn + """

            {/* 🛡️ بخش ثبت روی بلاکچین */}
            <div className="mt-6 p-4 rounded-2xl bg-[var(--arv-blue)]/20 border border-[var(--arv-gold)]/30 space-y-3">
              <div className="text-sm font-bold text-[var(--arv-gold)] flex items-center gap-2">
                <Lock size={16} />
                {language === 'en' ? 'Sync to Blockchain' : 'ثبت روی بلاکچین'}
              </div>
              <p className="text-[11px] text-[var(--arv-text-muted)] leading-5">
                {language === 'en' 
                  ? 'Register your invite code on the smart contract to make it verifiable by others.' 
                  : 'کد دعوت خود را روی قرارداد هوشمند ثبت کنید تا برای دیگران قابل تایید باشد.'}
              </p>
              
              <div className="flex gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'en' ? 'Wallet Password' : 'رمز عبور کیف پول'}
                  className="arv-input flex-1 text-sm"
                  dir="ltr"
                />
                <GradientButton
                  variant="gold"
                  size="sm"
                  onClick={handleRegisterOnChain}
                  disabled={isRegistering}
                >
                  {isRegistering ? '...' : (language === 'en' ? 'Sync' : 'ثبت')}
                </GradientButton>
              </div>

              {txMessage && (
                <div className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
                  txStatus === 'success' ? 'bg-[var(--arv-success)]/10 text-[var(--arv-success)]' : 
                  txStatus === 'error' ? 'bg-[var(--arv-danger)]/10 text-[var(--arv-danger)]' : 
                  'bg-[var(--arv-gold)]/10 text-[var(--arv-gold)]'
                }`}>
                  {txStatus === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {txMessage}
                </div>
              )}
            </div>"""

if old_share_btn in content:
    content = content.replace(old_share_btn, new_share_btn)
    print("✅ بخش UI ثبت روی بلاکچین اضافه شد")
else:
    print("⚠️ دکمه اشتراک‌گذاری پیدا نشد — بررسی دستی")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ فایل ذخیره شد")
