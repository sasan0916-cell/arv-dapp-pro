# راهنمای ساخت و نصب ARV DApp

## پیش‌نیاز
- Node.js 20+
- npm 10+

## مراحل Build

### ۱. پاک کردن build قبلی
cd ~/arv-dapp-pro
rm -rf .next

### ۲. بیلد نهایی
npm run build

### ۳. اجرای production
npm start

### ۴. تست در مرورگر
http://localhost:3000

## نصب روی گوشی

### اندروید (Chrome):
۱. سایت رو باز کن
۲. منو (سه نقطه) → Add to Home Screen یا Install app
۳. تأیید کن → آیکون ARV روی صفحه اصلی میاد

### iOS (Safari):
۱. سایت رو باز کن
۲. دکمه Share → Add to Home Screen
۳. تأیید کن

## Deploy روی Vercel

### ۱. نصب Vercel CLI
npm install -g vercel

### ۲. Login
vercel login

### ۳. Deploy
vercel --prod

## رمز ادمین
ARV#sasan@2026!Admin

## لینک‌های مهم
- BscScan Testnet: https://testnet.bscscan.com/token/0x049C66b452f650a0d5F51536f5bC03f249C5163A
- کیف اصلی: https://testnet.bscscan.com/address/0xface68c6507ee71090ddcbbb686f86f69508ccf6
- کیف پاداش: https://testnet.bscscan.com/address/0xf912aea6031de1e6d3446e4a7a8d1166328edbe2

## پشتیبانی
- Developer: ساسان اشکش
- Owner: عسل نوذری
- GitHub: github.com/sasan0916-cell/arv-dapp-pro
