path = 'app/referral/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# این دقیقاً همون بلوکی هست که توی فایل شماست
old_block = """          <div className="mt-4">
            <GradientButton variant="gold" size="md" fullWidth onClick={handleShare} icon={<Share2 size={16} />}>
              {en ? 'Share with friends' : 'ارسال به دوستان'}
            </GradientButton>
          </div>"""

new_block = old_block + """

          {/* 🛡️ بخش ثبت روی بلاکچین */}
          <div className="mt-6 p-4 rounded-2xl bg-[var(--arv-blue)]/20 border border-[var(--arv-gold)]/30 space-y-3">
            <div className="text-sm font-bold text-[var(--arv-gold)] flex items-center gap-2">
              <Lock size={16} />
              {en ? 'Sync to Blockchain' : 'ثبت روی بلاکچین'}
            </div>
            <p className="text-[11px] text-[var(--arv-text-muted)] leading-5">
              {en
                ? 'Register your invite code on the smart contract to make it verifiable by others.'
                : 'کد دعوت خود را روی قرارداد هوشمند ثبت کنید تا برای دیگران قابل تایید باشد.'}
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
              <GradientButton
                variant="gold"
                size="sm"
                onClick={handleRegisterOnChain}
                disabled={isRegistering}
              >
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

if old_block in content:
    content = content.replace(old_block, new_block)
    print("✅ بخش UI ثبت روی بلاکچین با موفقیت اضافه شد.")
else:
    print("⚠️ هنوز پیدا نشد! لطفاً بررسی کن.")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
