# دیپلوی توکن ARV (BEP-20) روی BNB Smart Chain

آدرس‌های کیف پول از قبل در `scripts/deploy.js` وارد شده‌اند:
- کیف پول اصلی (Master, ۶۰٪): `0xface68c6507ee71090ddcbbb686f86f69508ccf6`
- کیف پول استخر پاداش (Reward Pool, ۴۰٪): `0xf912aea6031de1e6d3446e4a7a8d1166328edbe2`
- کل عرضه: ۱۰۰,۰۰۰,۰۰۰ ARV — بدون تابع Mint (بعد از دیپلوی هیچ‌کس نمی‌تواند توکن بیشتری بسازد)

## ۱) آماده‌سازی

```bash
cp .env.example .env
```
سپس فایل `.env` را باز کنید و مقداری وارد کنید:
- `PRIVATE_KEY`: کلید خصوصی کیف پولی که کارمزد دیپلوی را می‌پردازد (فقط برای همین کار لازم است، لازم نیست Master یا Reward Pool باشد)
- `BSCSCAN_API_KEY`: از https://bscscan.com/myapikey رایگان بگیرید

⚠️ **هرگز فایل `.env` را جایی عمومی (گیت‌هاب و غیره) قرار ندهید.** فایل `.gitignore` همراه پروژه این را خودکار رعایت می‌کند.

```bash
npm install
npx hardhat compile
```

## ۲) تست روی Testnet (رایگان — همیشه اول این مرحله)

```bash
npm run deploy:test
```
خروجی چیزی شبیه این می‌دهد:
```
✅ ARV deployed to: 0xABCD...
```
این آدرس را در `scripts/verify.js` و `scripts/test.js` به‌جای `PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE` بگذارید، سپس:

```bash
npm run test:test
```
بررسی کنید Total Supply، موجودی دو کیف پول، و پیام `Sum check: OK ✅` درست باشد.

(می‌توانید `verify:test` را هم بزنید تا کد روی BscScan Testnet قابل مشاهده شود، هرچند اختیاری است.)

## ۳) دیپلوی روی Mainnet (هزینه واقعی دارد)

فقط وقتی مرحله ۲ کاملاً درست بود ادامه دهید. مطمئن شوید کیف پول دیپلوی‌کننده مقداری **BNB واقعی** برای کارمزد گس دارد (چند دلار کافی است).

```bash
npm run deploy:main
```
آدرس چاپ‌شده را دوباره در `scripts/verify.js` و `scripts/test.js` جای‌گذاری کنید (این‌بار آدرس Mainnet)، سپس:

```bash
npm run test:main
npm run verify:main
```

`verify:main` کد قرارداد را روی BscScan عمومی می‌کند تا هرکسی بتواند آن را بخواند و بررسی کند — برای اعتماد کاربران این مرحله را حتماً انجام دهید.

## ۴) بعد از دیپلوی روی Mainnet

آدرس نهایی قرارداد Mainnet را در پنل وردپرس وارد کنید:
**ARV Token → تنظیمات → آدرس قرارداد (Mainnet)** و شبکه فعال را از Testnet به Mainnet تغییر دهید.

سپس برای این‌که توکن قابل خرید/فروش باشد، باید در PancakeSwap یک استخر نقدینگی (Liquidity Pool) با BNB واقعی بسازید — این مرحله جداست و به بودجه‌ی خودتان بستگی دارد.
