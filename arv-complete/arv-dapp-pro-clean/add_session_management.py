import re

path = 'app/settings/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ۱. اضافه کردن ایمپورت‌های لازم
if "useAccount, useDisconnect" not in content:
    content = content.replace(
        "import { useLanguage } from '@/lib/i18n';",
        "import { useLanguage } from '@/lib/i18n';\nimport { useAccount, useDisconnect } from 'wagmi';\nimport { Laptop, LogOut, ShieldAlert } from 'lucide-react';"
    )
    print("✅ ایمپورت‌های Session Management اضافه شد")

# ۲. اضافه کردن هوک‌های wagmi
if "const { address, isConnected, connector } = useAccount();" not in content:
    content = content.replace(
        "export default function SettingsPage() {",
        "export default function SettingsPage() {\n  const { address, isConnected, connector } = useAccount();\n  const { disconnect } = useDisconnect();"
    )
    print("✅ هوک‌های اتصال به تنظیمات اضافه شد")

# ۳. پیدا کردن محل مناسب برای تزریق UI (بعد از بخش امنیت)
# ما یه بخش جدید قبل از آخرین GlowCard اضافه می‌کنیم
session_ui = """
            {/* 🔗 مدیریت نشست‌ها (Session Management) */}
            <GlowCard glowColor="blue">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <Laptop size={20} className="text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-sm">{en ? 'Session Management' : 'مدیریت نشست‌ها'}</div>
                  <div className="text-xs text-[var(--arv-text-muted)]">
                    {en ? 'Manage connected wallets and sessions' : 'مدیریت کیف پول‌ها و نشست‌های متصل'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--arv-blue)]/20 space-y-3">
                {isConnected ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-[var(--arv-success)] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--arv-success)] animate-pulse"></span>
                        {en ? 'Connected' : 'متصل'}
                      </div>
                      <div className="text-xs text-[var(--arv-text-muted)]">
                        {connector?.name || (en ? 'External Wallet' : 'کیف پول خارجی')}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/20 font-mono text-xs break-all text-center" dir="ltr">
                      {address}
                    </div>
                    <button
                      onClick={() => disconnect()}
                      className="w-full mt-2 py-2 rounded-lg bg-[var(--arv-danger)]/10 text-[var(--arv-danger)] border border-[var(--arv-danger)]/30 hover:bg-[var(--arv-danger)]/20 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                    >
                      <LogOut size={16} />
                      {en ? 'Disconnect Wallet' : 'قطع اتصال کیف پول'}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[var(--arv-text-muted)]">
                    <ShieldAlert size={16} />
                    {en ? 'No external wallet connected.' : 'هیچ کیف پول خارجی متصل نیست.'}
                  </div>
                )}
              </div>
              
              <div className="mt-3 text-[10px] text-[var(--arv-text-muted)] flex items-start gap-1">
                <span>ℹ️</span>
                {en 
                  ? 'Internal wallets are automatically locked after a period of inactivity based on your Auto-Lock setting.' 
                  : 'کیف پول‌های داخلی بر اساس تنظیمات «قفل خودکار»، پس از مدت زمان مشخصی قفل می‌شوند.'}
              </div>
            </GlowCard>
"""

# پیدا کردن آخرین GlowCard و اضافه کردن این بخش قبل از اون
# به دنبال آخرین بسته شدن </GlowCard> می‌گردیم
last_glow_card_idx = content.rfind("</GlowCard>")
if last_glow_card_idx != -1:
    content = content[:last_glow_card_idx] + session_ui + "\n          " + content[last_glow_card_idx:]
    print("✅ بخش مدیریت نشست‌ها به UI اضافه شد")
else:
    print("⚠️ محل مناسبی برای تزریق پیدا نشد")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ فایل تنظیمات ذخیره شد")
