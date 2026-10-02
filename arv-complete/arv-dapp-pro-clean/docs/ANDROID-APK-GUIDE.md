# ساخت APK / AAB برای ARV Super DApp

نسخه فعلی با **Capacitor Android** بسته‌بندی می‌شود. DApp در زمان Build به صورت static export داخل اپ قرار می‌گیرد و ارتباط Web3 مستقیماً از WebView/کیف پول خارجی و RPCهای BNB Chain انجام می‌شود.

## GitHub Actions (پیشنهادی)

1. پروژه را در GitHub قرار دهید.
2. در **Settings → Secrets and variables → Actions** در صورت نیاز این Secrets را اضافه کنید:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_ARV_MAINNET_ADDRESS` — فعلاً خالی بماند؛ بعد از Deploy قرارداد نهایی ARV وارد شود.
   - `NEXT_PUBLIC_BSCSCAN_API_KEY` — اختیاری.
3. وارد **Actions → Build ARV Super DApp Android** شوید.
4. روی **Run workflow** بزنید.
5. Artifact با نام `ARV-Super-DApp-Android` را دانلود کنید.

خروجی‌های Workflow:

- `app-debug.apk` — قابل نصب مستقیم روی Android برای تست.
- `app-release.aab` — AAB برای انتشار؛ برای انتشار عمومی باید با کلید امضای خود پروژه Sign شود.

## Build محلی

```bash
npm ci
npm run build:mobile
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
./gradlew bundleRelease
```

## شناسه برنامه

- App name: **ARV Super DApp**
- Application ID: `ir.arvandkhabar.arvsuperdapp`
- Official logo: `public/arv-logo.png`

## نکات امنیتی انتشار

- کلید signing را در GitHub Secret/keystore امن نگه دارید و داخل Repository قرار ندهید.
- قرارداد ARV Mainnet را قبل از واردکردن آدرس در محیط Production بررسی و Verify کنید.
- قبل از انتشار عمومی، Swap، Approval، Liquidity، Remove Liquidity و اتصال کیف پول خارجی را با مبالغ بسیار کوچک روی شبکه واقعی تست کنید.
- هیچ‌وقت عبارت بازیابی یا private key کیف پول خارجی را داخل DApp وارد نکنید.
