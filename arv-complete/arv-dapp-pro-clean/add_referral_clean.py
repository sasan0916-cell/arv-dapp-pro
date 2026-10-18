import re

path = 'app/referral/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ۱. اضافه کردن ایمپورت‌ها
if 'registerMyCodeOnChain' not in content:
    content = content.replace(
        "import { useEffect, useState } from 'react';",
        "import { useEffect, useState } from 'react';\nimport { registerMyCodeOnChain } from '@/lib/services/referral-service';\nimport { loadWallet } from '@/lib/services/wallet-service';"
    )

# ۲. اضافه کردن آیکون‌های جدید
lucide_match = re.search(r"import\s+\{([^}]+)\}\s+from\s+['\"]lucide-react['\"];", content)
if lucide_match:
    existing = lucide_match.group(1)
    new_icons = []
    for icon in ['Lock', 'CheckCircle', 'AlertCircle']:
        if icon not in existing:
            new_icons.append(icon)
    if new_icons:
        content = content.replace(lucide_match.group(0), f"import {{ {existing.strip()}, {', '.join(new_icons)} }} from 'lucide-react';")

# ۳. اضافه کردن State ها
old_state = "const [copied, setCopied] = useState<'code' | 'link' | null>(null);"
new_state = old_state + """
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [txMessage, setTxMessage] = useState('');
  const [txStatus, setTxStatus] = useState<'idle' | 'success' | 'error'>('idle');"""
content = content.replace(old_state, new_state)

# ۴. تزریق تابع handleRegisterOnChain بعد از handleShare
share_end_pattern = r"(const handleShare = async \(\) => \{.*?\n  \};)"
match = re.search(share_end_pattern, content, re.DOTALL)

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

if match:
    content = content.replace(match.group(1), match.group(1) + "\n" + handler_code)
    print("✅ تابع handleRegisterOnChain تزریق شد.")

# ۵. تزریق UI (بعد از دکمه اشتراک‌گذاری)
share_btn_pattern = r"(<GradientButton[^>]*onClick=\{handleShare\}.*?</GradientButton>\s*</div>)"
share_match = re.search(share_btn_pattern, content, re.DOTALL)

ui_code = """
          <div className="mt-6 p-4 rounded-2xl bg-[var(--arv-blue)]/20 border border-[var(--arv-gold)]/30 space-y-3">
            <div className="text-sm font-bold text-[var(--arv-gold)] flex items-center gap-2">
              <Lock size={16} />
              {en ? 'Sync to Blockchain' : 'ثبت روی بلاکچین'}
            </div>
            <p className="text-[11px] text-[var(--arv-text-muted)] leading-5">
              {en ? 'Register your code on the smart contract.' : 'کد خود را روی قرارداد هوشمند ثبت کنید.'}
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={en ? 'Wallet Password' : 'رمز عبور کیف پول'}
                className="arv-input flex-1 text-sm"
                dir="ltr"
              />
              <GradientButton variant="gold" size="sm" onClick={handleRegisterOnChain} disabled={isRegistering}>
                {isRegistering ? '...' : (en ? 'Sync' : 'ثبت')}
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

if share_match:
    content = content.replace(share_match.group(1), share_match.group(1) + ui_code)
    print("✅ UI ثبت روی بلاکچین اضافه شد.")
else:
    print("⚠️ دکمه اشتراک‌گذاری پیدا نشد.")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ فایل ذخیره شد.")
