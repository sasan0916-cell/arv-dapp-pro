'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'fa' | 'en';

const PHRASES: Record<string, string> = {
  'کیف پول و DApp غیرمتمرکز توکن ARV روی BNB Smart Chain': 'ARV token wallet and decentralized DApp on BNB Smart Chain',
  'کیف پول': 'Wallet', 'اروند خبر': 'Arvand Khabar', 'ساسان اشکش': 'Sasan Ashkesh',
  'کیف پول شخصی': 'Personal Wallet', 'غیرامانی و مستقل': 'Non-custodial & Independent', 'ورود به کیف پول': 'Open Wallet',
  'عرضه فعلی تست': 'Current Test Supply', 'قرارداد Testnet': 'Testnet Contract', 'قرارداد فعال': 'Active Contract',
  'مشاهده در BscScan': 'View on BscScan', 'هدف عرضه Mainnet': 'Mainnet Supply Target', 'عرضه فعلی Testnet': 'Current Testnet Supply',
  'اعشار': 'Decimals', 'تخصیص Mainnet': 'Mainnet Allocation', 'نام': 'Name', 'نماد': 'Symbol', 'شبکه': 'Network',
  'باز کردن کیف پول': 'Open Wallet', 'بیشتر بدانید': 'Learn More', 'وضعیت فعلی:': 'Current Status:',
  'اطلاعیه مهم': 'Important Notice', 'توجه:': 'Note:', 'چطور با ARV شروع کنیم؟': 'How to get started with ARV?',
  'کیف پول شما': 'Your Wallet', 'اطلاعات توکن ARV': 'ARV Token Information', 'کیف اصلی': 'Main Wallet', 'کیف پاداش': 'Reward Wallet', 'کیف کاربر': 'User Wallet',
  'خطا در بارگذاری تاریخچه': 'Failed to load transaction history', 'همه': 'All', 'ارسال': 'Send', 'دریافت': 'Receive',
  'جستجو در هش یا آدرس...': 'Search by hash or address...', 'هنوز تراکنشی ثبت نشده': 'No transactions recorded yet',
  'تراکنشی با این فیلتر پیدا نشد': 'No transactions found with this filter', 'تاریخچه تراکنش‌ها': 'Transaction History',
  'تراکنش‌های ARV کیف پول': 'ARV wallet transactions', 'کل تراکنش‌ها': 'Total Transactions', 'در حال بارگذاری...': 'Loading...',
  'مشاهده کامل در BscScan': 'View on BscScan', 'همه تراکنش‌های این آدرس': 'All transactions for this address', 'درباره تاریخچه': 'About History',
  'تمام داده‌ها پاک شد!': 'All data has been cleared!', '🌙 تاریک': '🌙 Dark', '☀️ روشن': '☀️ Light', '💻 سیستم': '💻 System',
  'تراکنش‌ها': 'Transactions', 'اعلان تراکنش‌های جدید': 'New transaction alerts', 'اخبار': 'News', 'اخبار اروند خبر': 'Arvand Khabar news',
  'قیمت': 'Price', 'هشدار تغییر قیمت ARV': 'ARV price change alerts', 'تنظیمات': 'Settings', 'پیکربندی DApp ARV': 'ARV DApp configuration',
  'زبان': 'Language', 'زبان رابط کاربری': 'Interface language', '🇮🇷 فارسی': '🇮🇷 Persian', '🇬🇧 English': '🇬🇧 English',
  'تم': 'Theme', 'حالت نمایش': 'Display mode', 'اعلان‌ها': 'Notifications', 'مدیریت اعلان‌ها': 'Notification management',
  'امنیت': 'Security', 'تنظیمات امنیتی': 'Security settings', 'اثر انگشت': 'Fingerprint', 'ورود سریع با اثر انگشت': 'Quick login with fingerprint',
  'تأیید دو مرحله‌ای': 'Two-factor authentication', 'امنیت بیشتر برای تراکنش‌ها': 'Extra security for transactions',
  'پشتیبان‌گیری': 'Backup', 'Export و Import کیف پول': 'Wallet Export & Import', 'درباره': 'About', 'اطلاعات نسخه': 'Version information',
  'نسخه': 'Version', 'استاندارد': 'Standard', 'بررسی بروزرسانی': 'Check for updates', 'راهنمای نصب': 'Installation Guide', 'درباره پروژه': 'About Project',
  'منطقه خطر': 'Danger Zone', 'عملیات غیرقابل بازگشت': 'Irreversible operation', 'پاک کردن تمام داده‌ها': 'Clear all data',
  '⚠️ آیا مطمئن هستید؟ این عمل قابل بازگشت نیست!': '⚠️ Are you sure? This action cannot be undone!', 'انصراف': 'Cancel', 'بله، پاک کن': 'Yes, clear it',
  'رمز عبور را وارد کنید': 'Enter password', 'ورود مدیر روی سرور تنظیم نشده است (متغیرهای محیطی را بررسی کنید)': 'Admin login is not configured on the server (check environment variables)',
  'تلاش‌های ناموفق زیاد بود. چند دقیقه بعد دوباره امتحان کنید': 'Too many failed attempts. Try again in a few minutes', 'ارتباط با سرور برقرار نشد': 'Could not connect to server',
  'رمز عبور اشتباه است': 'Incorrect password', 'ثبت اثر انگشت انجام نشد. می‌توانید بعداً دوباره تلاش کنید.': 'Fingerprint enrollment failed. You can try again later.',
  'تأیید اثر انگشت ناموفق بود': 'Fingerprint verification failed', 'اعتبار این دستگاه تمام شده است؛ یک بار با رمز وارد شوید': 'This device authorization has expired; sign in once with your password',
  'در انتظار تأیید...': 'Waiting for confirmation...', 'فعال‌سازی اثر انگشت': 'Enable fingerprint', 'در حال ورود...': 'Signing in...', 'ورود با رمز': 'Sign in with password',
  'بازگشت به اپ': 'Back to App', 'ورود مدیرکل': 'Admin Login', 'این بخش فقط برای مدیرکل پروژه قابل دسترسی است': 'This section is accessible only to the project administrator',
  'دفعهٔ بعد با اثر انگشت وارد شوید؟': 'Use fingerprint next time?', 'بعداً': 'Later', 'رمز مدیرکل': 'Admin Password', 'یا': 'or', 'ورود با اثر انگشت': 'Sign in with fingerprint',
  'این رمز محرمانه است. آن را با کسی به اشتراک نگذارید.': 'This password is confidential. Do not share it with anyone.',
  'قیمت ARV': 'ARV Price', 'حجم ۲۴ ساعته': '24h Volume', 'ارزش بازار': 'Market Cap', 'تعداد هولدرها': 'Holders',
  '۵ دقیقه پیش': '5 minutes ago', '۱۲ دقیقه پیش': '12 minutes ago', '۲۵ دقیقه پیش': '25 minutes ago', 'خرید': 'Buy', 'فروش': 'Sell',
  'تحلیل بازار': 'Market Analysis', 'داده‌های زنده بازار ARV': 'Live ARV market data', 'نمودار قیمت ARV': 'ARV Price Chart', 'استخرهای نقدینگی': 'Liquidity Pools',
  'حجم': 'Volume', 'تراکنش‌های بزرگ': 'Large Transactions', 'اطلاعات قرارداد': 'Contract Information', 'آدرس': 'Address',
  'اصلی': 'Core', 'استیبل‌کوین': 'Stablecoin', 'ارزهای شناخته‌شده': 'Established Tokens', 'قیمت واحد پایین': 'Low Unit Price',
  'مقدار را وارد کنید': 'Enter amount', 'ابتدا یک کیف پول فعال انتخاب کنید': 'Select an active wallet first',
  'رمز کیف پول را وارد کنید تا تراکنش با کلید رمزگذاری‌شده امضا شود': 'Enter the wallet password to sign the transaction with the encrypted key',
  'ARV فعلاً فقط روی BSC Testnet فعال است؛ برای جفت‌های دیگر از BSC Mainnet استفاده می‌شود.': 'ARV is currently active only on BSC Testnet; other pairs use BSC Mainnet.',
  'این توکن روی شبکه انتخاب‌شده مستقر نیست.': 'This token is not deployed on the selected network.', 'ابتدا Quote واقعی دریافت کنید': 'Get a real quote first',
  'رمز کیف پول صحیح نیست یا کیف پول ذخیره نشده است': 'Incorrect wallet password or wallet not found', 'کیف پول انتخاب‌شده با کلید واردشده مطابقت ندارد': 'Selected wallet does not match the imported key',
  'تراکنش Swap انجام نشد': 'Swap transaction failed', 'BSC Mainnet • معامله توکن‌های BNB Chain فعال': 'BSC Mainnet • BNB Chain token trading enabled',
  'BSC Testnet • معاملات ARV برای تست': 'BSC Testnet • ARV testing trades', 'جستجوی نام یا نماد...': 'Search name or symbol...', 'در حال Quote...': 'Getting Quote...',
  'Quote از Router': 'Quote from Router', 'رمز کیف پول انتخاب‌شده': 'Selected wallet password', 'در حال سواپ...': 'Swapping...', 'تأیید و سواپ': 'Confirm & Swap',
  'سواپ ارزهای دیجیتال': 'Crypto Swap', 'تنظیمات Slippage': 'Slippage Settings', 'از': 'From', 'به': 'To', 'نرخ': 'Rate',
  'کارمزد': 'Fee', 'کارمزد شبکه (وابسته به BSC)': 'Network fee (BSC dependent)', 'سواپ با موفقیت انجام شد!': 'Swap completed successfully!',
  'رمز کیف پول برای امضای Swap': 'Wallet password for Swap signing', 'کلید خصوصی از کیف پول رمزگذاری‌شده خوانده می‌شود و برای سرور ارسال نمی‌شود.': 'The private key is read from the encrypted wallet and is never sent to the server.',
  'در حال دریافت Quote واقعی از Router...': 'Getting a real Quote from the Router...', 'توجه': 'Note', 'کیف پول‌های من': 'My Wallets', 'مدیریت کیف پول‌های مستقل ARV': 'Manage independent ARV wallets',
  'مدیرکل': 'Administrator', 'موجودی اولیه': 'Initial Balance', 'ورود': 'Open', 'ساخت / بازیابی': 'Create / Restore', 'هنوز کیف پولی نساخته‌اید': 'You have not created a wallet yet',
  'ساخت کیف جدید': 'Create New Wallet', 'بازیابی': 'Restore', '۱۲ کلمه بازیابی': '12-word recovery phrase', '۱۲ کلمه یا ۶۴ کاراکتر': '12 words or 64 characters',
  'امنیت کیف پول': 'Wallet Security', 'کلید خصوصی شما فقط روی دستگاه شما ذخیره می‌شود (رمزنگاری‌شده)': 'Your private key is stored only on your device (encrypted)',
  'هرگز کلید خصوصی خود را با کسی به اشتراک نگذارید': 'Never share your private key with anyone', '۱۲ کلمه بازیابی را در جای امن یادداشت کنید': 'Write down your 12-word recovery phrase and keep it safe',
  'اثر انگشت را برای امنیت بیشتر فعال کنید': 'Enable fingerprint for extra security', 'لطفاً ۱۲ کلمه بازیابی یا کلید خصوصی ۶۴ کاراکتری وارد کنید': 'Please enter a 12-word recovery phrase or 64-character private key',
  'رمز عبور باید حداقل ۸ کاراکتر باشد': 'Password must be at least 8 characters', 'رمز عبور و تکرار آن یکسان نیستند': 'Passwords do not match',
  'خطا در بازیابی کیف پول': 'Wallet restore failed', 'رمز قوی وارد کنید': 'Enter a strong password', 'رمز عبور را دوباره وارد کنید': 'Re-enter password',
  'در حال بازیابی...': 'Restoring...', 'بازیابی کیف پول': 'Restore Wallet', 'در حال ثبت...': 'Enrolling...', 'خطا در ساخت کیف پول': 'Wallet creation failed',
  'کپی شد': 'Copied', 'کپی همه': 'Copy All', 'کلمه را وارد کنید': 'Enter the word', 'در حال ساخت...': 'Creating...', 'ساخت کیف پول': 'Create Wallet', 'ساخت کیف پول جدید': 'Create New Wallet',
  'نوع کیف پول را انتخاب کنید': 'Choose wallet type', 'کیف پول شخصی برای هر کاربر': 'Personal wallet for each user', '۶۰٪ عرضه کل (فقط مدیرکل)': '60% of total supply (administrator only)', '۴۰٪ عرضه کل (فقط مدیرکل)': '40% of total supply (administrator only)',
  'هشدار مهم': 'Important Warning', 'تأیید کلمات': 'Confirm Words', 'برای اطمینان، کلمات خواسته‌شده را وارد کنید': 'Enter the requested words to confirm', 'تأیید و ادامه': 'Confirm & Continue',
  'رد کردن': 'Skip', 'کیف پول با موفقیت ساخته شد!': 'Wallet created successfully!', 'کیف پول با موفقیت بازیابی شد!': 'Wallet restored successfully!', 'رفتن به کیف پول‌ها': 'Go to Wallets',
  'نسخهٔ نمایشی: ارسال واقعی پاداش هنوز به بلاکچین وصل نیست.': 'Demo: real reward sending is not yet connected to the blockchain.', 'در حال ارسال...': 'Sending...', 'ارسال پاداش': 'Send Reward',
  'در حال بررسی دسترسی...': 'Checking access...', 'داشبورد مدیریتی': 'Admin Dashboard', 'دسترسی محدود': 'Restricted Access', 'این صفحه فقط برای مدیرکل پروژه است. تمام عملیات اینجا ثبت می‌شود.': 'This page is only for the project administrator. All operations are logged.',
  'موجودی': 'Balance', 'ارسال پاداش به کاربر': 'Send Reward to User', 'از موجودی کیف پاداش کسر می‌شود': 'Deducted from the reward wallet balance', 'آدرس کاربر': 'User Address', 'مقدار (ARV)': 'Amount (ARV)',
  'عرضه کل ARV': 'Total ARV Supply', 'کاربران': 'Users', 'پاداش موجود': 'Available Rewards', 'کاربران اخیر': 'Recent Users', 'مشاهده همه': 'View All', 'درباره داشبورد مدیریتی': 'About Admin Dashboard',
  'نام توکن': 'Token Name', 'عرضه Testnet': 'Testnet Supply', 'عرضه Mainnet': 'Mainnet Supply', 'آزاد شده': 'Unlocked', 'پس از راه‌اندازی': 'After Launch', '۶ ماه بعد': '6 months later', '۱۲ ماه بعد': '12 months later',
  'توکنومیک ARV': 'ARV Tokenomics', 'اقتصاد توکن و توزیع عرضه': 'Token economics and supply distribution', 'توزیع عرضه': 'Supply Distribution', 'کیف پول‌های توزیع': 'Distribution Wallets', 'اطلاعات توکن': 'Token Information', 'آدرس قرارداد': 'Contract Address', 'برنامه آزادسازی (Vesting)': 'Vesting Schedule', 'درباره توکنومیک': 'About Tokenomics',
  'دریافت ARV': 'Receive ARV', 'آدرس کیف پول خود را به اشتراک بگذارید': 'Share your wallet address', 'کد QR برای دریافت ARV': 'QR code for receiving ARV', 'با اپ کیف پول اسکن کنید': 'Scan with a wallet app', 'اشتراک‌گذاری': 'Share', 'تراکنش‌ها و موجودی': 'Transactions & Balance', 'توجه مهم': 'Important Notice',
  'آدرس گیرنده نامعتبر است': 'Invalid recipient address', 'مقدار باید بزرگتر از صفر باشد': 'Amount must be greater than zero', 'رمز عبور اشتباه است یا کیف پول یافت نشد': 'Incorrect password or wallet not found', 'خطا در ارسال تراکنش': 'Transaction failed', 'ساخته نشده': 'Not created', 'رمز عبور': 'Password', 'تأیید و ارسال': 'Confirm & Send', 'کپی': 'Copy',
  'ارسال ARV': 'Send ARV', 'کیف پول مبدأ را انتخاب کنید': 'Select source wallet', 'آدرس گیرنده': 'Recipient Address', 'آدرس نامعتبر': 'Invalid address', 'آدرس معتبر': 'Valid address', 'رمز عبور کیف پول': 'Wallet Password', 'تأیید ارسال': 'Confirm Send', 'لطفاً اطلاعات را بررسی کنید': 'Please review the information', 'مقدار': 'Amount', 'کارمزد تقریبی': 'Estimated fee', 'در حال ارسال تراکنش...': 'Sending transaction...', 'لطفاً صبر کنید': 'Please wait', 'تراکنش با موفقیت ارسال شد!': 'Transaction sent successfully!', 'هش تراکنش': 'Transaction Hash',
  'وضعیت Mainnet': 'Mainnet Status', 'مسیر انتشار رسمی ARV روی BNB Smart Chain Mainnet': 'Official ARV release path on BNB Smart Chain Mainnet', 'فعال': 'Active', 'عرضه': 'Supply', 'قرارداد': 'Contract', 'در انتظار': 'Pending', 'عرضه هدف': 'Target Supply', 'در انتظار Deploy': 'Awaiting Deploy', 'پیشرفت آماده‌سازی Mainnet': 'Mainnet Preparation Progress', 'اطلاعات قرارداد Mainnet': 'Mainnet Contract Information', 'لینک BscScan': 'BscScan Link', 'باز کردن': 'Open', 'گزارش ممیزی امنیتی': 'Security Audit Report', 'مشاهده': 'View',
  'تخصیص توکن در Mainnet': 'Mainnet Token Allocation', 'تعهدات امنیتی': 'Security Commitments', 'قرارداد بدون تابع mint (عرضه ثابت)': 'Contract without a mint function (fixed supply)', 'ممیزی امنیتی توسط شرکت معتبر': 'Security audit by a reputable firm', 'گزارش عمومی از طریق BscScan': 'Public reporting through BscScan',
  'مرحله ۱': 'Phase 1', 'زیرساخت اولیه': 'Initial Infrastructure', 'مرحله ۲': 'Phase 2', 'مستندسازی': 'Documentation', 'مرحله ۳': 'Phase 3', 'بررسی حقوقی': 'Legal Review', 'مرحله ۴': 'Phase 4', 'مرحله ۵': 'Phase 5', 'آماده‌سازی': 'Preparation', 'مرحله ۶': 'Phase 6', 'انتشار رسمی': 'Official Launch',
  'وب‌سایت رسمی': 'Official Website', 'تماس': 'Contact', 'کاربرد واقعی': 'Real Utility', 'شفافیت کامل': 'Full Transparency', 'انطباق قانونی': 'Legal Compliance', 'غیرمتمرکز': 'Decentralized', 'تیم پروژه': 'Project Team', 'نقشه راه پروژه': 'Project Roadmap', 'لینک‌های رسمی': 'Official Links', 'سلب مسئولیت': 'Disclaimer', 'ساخته شده با عشق برای اکوسیستم اروند خبر': 'Made with love for the Arvand Khabar ecosystem',
  'داشبورد': 'Dashboard', 'سواپ ارزها': 'Token Swap', 'تاریخچه': 'History', 'کیف پول‌ها': 'Wallets', 'توکنومیک': 'Tokenomics', 'عملیات اصلی': 'Main Operations', 'مدیریت': 'Management', 'اطلاعات': 'Information', 'بستن': 'Close', 'خانه': 'Home', 'بازار': 'Market', 'سواپ': 'Swap', 'باز کردن منو': 'Open menu', 'جستجو در DApp...': 'Search DApp...', 'در حال اتصال...': 'Connecting...', 'اتصال کیف پول': 'Connect Wallet', 'پنل مدیریت': 'Admin Panel', 'خروج از پنل مدیر': 'Exit Admin Panel', 'پنل مدیر': 'Admin Panel', 'ورود مدیر': 'Admin Login',
  'اتصال کیف پول خارجی': 'Connect an external wallet', 'کلید خصوصی داخل کیف پول شما باقی می‌ماند.': 'Your private key stays inside your wallet.', 'اتصال QR / کیف پول موبایل': 'QR / mobile wallet connection', 'امضای امن داخل کیف پول': 'Sign securely in your wallet', 'کیف پول خارجی': 'External wallet', 'کیف پول خارجی می‌تواند': 'External wallet can',
  'اتصال کیف خارجی': 'Connect external wallet', 'کیف خارجی': 'External wallet', 'کیف پول خارجی متصل است': 'External wallet connected', 'کیف پول خارجی متصل نیست': 'External wallet is not connected', 'امضای Approval و Swap مستقیماً داخل': 'Approval and Swap are signed directly inside',
  'نصب اپ ARV روی گوشی': 'Install ARV App on your phone', 'برای دسترسی سریع‌تر، اپ را روی صفحهٔ اصلی نصب کنید.': 'Install the app on your home screen for faster access.', 'نصب اپ': 'Install App',
  'قرارداد تست‌شده روی Testnet': 'Contract tested on Testnet', 'توکنومیک تأیید شده': 'Tokenomics verified', 'ممیزی امنیتی قرارداد': 'Contract security audit', 'اخذ مجوز قانونی': 'Legal authorization', 'Deploy روی BSC Mainnet': 'Deploy on BSC Mainnet', 'انتشار رسمی و عرضه عمومی': 'Official launch and public release', 'در انتظار Deploy...': 'Awaiting Deploy...', 'در انتظار ممیزی...': 'Awaiting Audit...',
};

const WORDS: Record<string, string> = {
  'کیف':'Wallet','پول':'','تنظیمات':'Settings','زبان':'Language','رابط':'Interface','کاربری':'','تم':'Theme','حالت':'Mode','نمایش':'Display',
  'اعلان':'Alert','اعلان‌ها':'Alerts','مدیریت':'Management','تراکنش':'Transaction','تراکنش‌ها':'Transactions','خبر':'News','اخبار':'News','قیمت':'Price','هشدار':'Warning',
  'اثر':'Fingerprint','انگشت':'Fingerprint','ورود':'Login','رمز':'Password','عبور':'','ارسال':'Send','دریافت':'Receive','آدرس':'Address','موجودی':'Balance',
  'مقدار':'Amount','کارمزد':'Fee','شبکه':'Network','قرارداد':'Contract','عرضه':'Supply','هدف':'Target','اصلی':'Main','پاداش':'Reward','کاربر':'User','کاربران':'Users',
  'نام':'Name','نماد':'Symbol','استاندارد':'Standard','اعشار':'Decimals','بازار':'Market','تحلیل':'Analysis','استخرهای':'Pools','نقدینگی':'Liquidity','خرید':'Buy','فروش':'Sell',
  'تاریخچه':'History','همه':'All','جستجو':'Search','در':'in','حال':'','بارگذاری':'Loading','خطا':'Error','موفقیت':'Success','موفق':'Successful','تأیید':'Confirm','ساخت':'Create','بازیابی':'Restore',
  'درباره':'About','پروژه':'Project','داده‌ها':'Data','داده':'Data','مشاهده':'View','بستن':'Close','خانه':'Home','سواپ':'Swap','توکن':'Token','توکنومیک':'Tokenomics',
  'مرحله':'Phase','زیرساخت':'Infrastructure','مستندسازی':'Documentation','بررسی':'Review','حقوقی':'Legal','آماده‌سازی':'Preparation','انتشار':'Launch','رسمی':'Official',
  'فعال':'Active','انتظار':'Pending','استیبل‌کوین':'Stablecoin','ارزهای':'Tokens','شناخته‌شده':'Established','پایین':'Low','بالا':'High',
  'لطفاً':'Please','دوباره':'Again','وارد':'Enter','کنید':'','شد':'','شده':'','شدن':'','نیست':'Not','است':'is','را':'','با':'with','برای':'for','از':'from','به':'to','روی':'on','فقط':'Only','هنوز':'Still',
};

function translate(text: string): string {
  const exact = PHRASES[text.trim()];
  if (exact) return text === text.trim() ? exact : text.replace(text.trim(), exact);
  let out = text;
  // Long phrases first, preserving dynamic values and punctuation.
  for (const [fa, en] of Object.entries(PHRASES).sort((a,b)=>b[0].length-a[0].length)) {
    if (out.includes(fa)) out = out.split(fa).join(en);
  }
  // Lightweight fallback for remaining Persian fragments.
  for (const [fa, en] of Object.entries(WORDS).sort((a,b)=>b[0].length-a[0].length)) {
    out = out.replace(new RegExp(fa, 'g'), en);
  }
  return out;
}

const textOriginal = new WeakMap<Text, string>();
const textRendered = new WeakMap<Text, string>();
const attrOriginal = new WeakMap<Element, Record<string,string>>();

type Ctx = { language: Language; setLanguage: (language: Language) => void };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fa');

  useEffect(() => {
    const saved = localStorage.getItem('arv_lang');
    if (saved === 'en' || saved === 'fa') setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('arv_lang', lang);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.body.dir = language === 'fa' ? 'rtl' : 'ltr';

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const t = node as Text;
        const current = t.nodeValue ?? '';
        const previous = textRendered.get(t);
        if (previous !== undefined && current !== previous) textOriginal.set(t, current);
        if (!textOriginal.has(t)) textOriginal.set(t, current);
        const original = textOriginal.get(t) ?? current;
        const next = language === 'en' ? translate(original) : original;
        if (current !== next) t.nodeValue = next;
        textRendered.set(t, next);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const el = node as Element;
      const tag = el.tagName.toLowerCase();
      if (['script','style','noscript'].includes(tag)) return;
      for (const child of Array.from(el.childNodes)) translateNode(child);
      const attrs = ['placeholder','aria-label','title','alt'];
      const saved = attrOriginal.get(el) ?? {};
      for (const attr of attrs) {
        const value = el.getAttribute(attr);
        if (value == null) continue;
        if (saved[attr] === undefined) saved[attr] = value;
        const original = saved[attr];
        el.setAttribute(attr, language === 'en' ? translate(original) : original);
      }
      attrOriginal.set(el, saved);
    };

    translateNode(document.body);
    const observer = new MutationObserver((mutations) => mutations.forEach(m => m.addedNodes.forEach(translateNode)));
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
