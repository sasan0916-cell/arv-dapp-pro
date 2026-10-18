'use client';

import { LegalLayout } from '@/components/ui/LegalLayout';
import { useLanguage } from '@/lib/i18n';

export default function PrivacyPage() {
  const { language } = useLanguage();
  const en = language === 'en';

  return (
    <LegalLayout 
      title={en ? "Privacy Policy" : "حریم خصوصی"} 
      icon="privacy" 
      lastUpdated={en ? "October 18, 2026" : "۱۸ اکتبر ۲۰۲۶"}
    >
      {en ? (
        <>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">1. Privacy Principle</h2>
          <p>At ARV Super DApp, user privacy is a core principle. Your data belongs to you, and no one should access it without permission.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">2. Data We Store</h2>
          <p>All sensitive data is <strong>encrypted (AES-GCM)</strong> and stored locally on your device:</p>
          <ul className="list-disc list-inside space-y-1 pr-4">
            <li>Wallet private keys (only accessible with your password)</li>
            <li>Seed Phrase</li>
            <li>Custom tokens, price alerts, and watchlist</li>
            <li>Preferences (language, theme, Auto-Lock)</li>
          </ul>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">3. Data We Do NOT Collect</h2>
          <ul className="list-disc list-inside space-y-1 pr-4">
            <li>Name, email, or phone number</li>
            <li>IP address or geolocation</li>
            <li>Full transaction history</li>
            <li>Wallet data to our servers</li>
          </ul>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">4. Blockchain Interaction</h2>
          <p>To fetch live data, the DApp connects to public BNB Smart Chain RPCs. These requests may be logged by the RPC provider, but no personal data is sent by us.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">5. Biometrics (WebAuthn)</h2>
          <p>If you enable fingerprint/face login, WebAuthn PRF is used. Your biometric data never leaves your device and is protected by hardware.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">6. Cookies</h2>
          <p>We do not use tracking or advertising cookies. We only use localStorage for local settings.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">7. Your Rights</h2>
          <p>You can clear all local data at any time via "Clear Data" in settings. This is irreversible.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">8. Contact</h2>
          <p>For privacy questions, email <a href="mailto:info@arvandkhabar.ir" className="text-[var(--arv-gold)] hover:underline">info@arvandkhabar.ir</a>.</p>
        </>
      ) : (
        <>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۱. اصل حریم خصوصی</h2>
          <p>در ARV Super DApp، حفظ حریم خصوصی کاربران یک اصل اساسی است. ما معتقدیم که داده‌های شما متعلق به خودتان است و هیچ‌کس نباید بدون اجازه به آن‌ها دسترسی داشته باشد.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۲. داده‌هایی که ذخیره می‌کنیم</h2>
          <p>تمام اطلاعات حساس شما به صورت <strong>رمزنگاری‌شده (AES-GCM)</strong> و فقط روی دستگاه خودتان ذخیره می‌شوند:</p>
          <ul className="list-disc list-inside space-y-1 pr-4">
            <li>کلیدهای خصوصی کیف پول (فقط با رمز عبور شما قابل دسترسی)</li>
            <li>عبارت بازیابی (Seed Phrase)</li>
            <li>لیست توکن‌های سفارشی، هشدارهای قیمتی و واچ‌لیست</li>
            <li>تنظیمات شخصی (زبان، حالت نمایش، Auto-Lock)</li>
          </ul>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۳. داده‌هایی که جمع‌آوری نمی‌کنیم</h2>
          <ul className="list-disc list-inside space-y-1 pr-4">
            <li>نام، ایمیل یا شماره تلفن</li>
            <li>آدرس IP یا موقعیت مکانی</li>
            <li>تاریخچه کامل تراکنش‌ها</li>
            <li>اطلاعات کیف پول به سرورهای خودمان</li>
          </ul>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۴. ارتباط با بلاکچین</h2>
          <p>برای خواندن اطلاعات زنده، DApp از طریق RPCهای عمومی به شبکه BNB Smart Chain متصل می‌شود. این درخواست‌ها ممکن است توسط ارائه‌دهنده RPC لاگ شوند، اما هیچ اطلاعات شخصی از سمت ما ارسال نمی‌شود.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۵. بیومتریک (WebAuthn)</h2>
          <p>اگر ویژگی ورود با اثر انگشت یا چهره را فعال کنید، از استاندارد WebAuthn PRF استفاده می‌شود. داده‌های بیومتریک شما هرگز از دستگاه شما خارج نمی‌شوند و توسط سخت‌افزار دستگاه محافظت می‌شوند.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۶. کوکی‌ها</h2>
          <p>ما از کوکی‌های تبلیغاتی یا ردیاب (Tracker) استفاده نمی‌کنیم. فقط از localStorage برای ذخیره تنظیمات محلی استفاده می‌شود.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۷. حقوق شما</h2>
          <p>شما در هر زمان می‌توانید تمام داده‌های محلی خود را با گزینه «پاک کردن داده‌ها» در تنظیمات DApp حذف کنید. این عمل غیرقابل بازگشت است.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۸. تماس</h2>
          <p>برای سوالات مربوط به حریم خصوصی، با ایمیل <a href="mailto:info@arvandkhabar.ir" className="text-[var(--arv-gold)] hover:underline">info@arvandkhabar.ir</a> در تماس باشید.</p>
        </>
      )}
    </LegalLayout>
  );
}
