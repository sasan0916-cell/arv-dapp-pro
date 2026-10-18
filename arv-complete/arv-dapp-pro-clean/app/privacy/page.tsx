import { LegalLayout } from '@/components/ui/LegalLayout';

export const metadata = {
  title: 'حریم خصوصی | ARV Super DApp',
  description: 'سیاست حفظ حریم خصوصی کاربران ARV DApp',
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="حریم خصوصی" icon="privacy" lastUpdated="۱۸ اکتبر ۲۰۲۶">
      <h2 className="text-base font-bold text-[var(--arv-gold)]">۱. اصل حریم خصوصی</h2>
      <p>
        در ARV Super DApp، حفظ حریم خصوصی کاربران یک اصل اساسی است. ما معتقدیم که
        داده‌های شما متعلق به خودتان است و هیچ‌کس نباید بدون اجازه به آن‌ها دسترسی داشته باشد.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۲. داده‌هایی که ذخیره می‌کنیم</h2>
      <p>تمام اطلاعات حساس شما به صورت <strong>رمزنگاری‌شده (AES-GCM)</strong> و فقط روی دستگاه خودتان ذخیره می‌شوند:</p>
      <ul className="list-disc list-inside space-y-1 pr-4">
        <li>کلیدهای خصوصی کیف پول (فقط با رمز عبور شما قابل دسترسی)</li>
        <li>عبارت بازیابی (Seed Phrase)</li>
        <li>لیست توکن‌های سفارشی، هشدارهای قیمتی و واچ‌لیست</li>
        <li>تنظیمات شخصی (زبان، حالت نمایش، Auto-Lock)</li>
      </ul>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۳. داده‌هایی که جمع‌آوری نمی‌کنیم</h2>
      <p>ما به هیچ عنوان موارد زیر را جمع‌آوری، ذخیره یا به اشتراک نمی‌گذاریم:</p>
      <ul className="list-disc list-inside space-y-1 pr-4">
        <li>نام، ایمیل یا شماره تلفن</li>
        <li>آدرس IP یا موقعیت مکانی</li>
        <li>تاریخچه کامل تراکنش‌ها</li>
        <li>اطلاعات کیف پول به سرورهای خودمان</li>
      </ul>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۴. ارتباط با بلاکچین</h2>
      <p>
        برای خواندن اطلاعات زنده (مانند قیمت‌ها و موجودی)، DApp از طریق RPCهای عمومی به
        شبکه BNB Smart Chain متصل می‌شود. این درخواست‌ها ممکن است توسط ارائه‌دهنده RPC
        لاگ شوند، اما هیچ اطلاعات شخصی از سمت ما ارسال نمی‌شود.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۵. بیومتریک (WebAuthn)</h2>
      <p>
        اگر ویژگی ورود با اثر انگشت یا چهره را فعال کنید، از استاندارد WebAuthn PRF استفاده
        می‌شود. داده‌های بیومتریک شما هرگز از دستگاه شما خارج نمی‌شوند و توسط سخت‌افزار
        دستگاه محافظت می‌شوند.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۶. کوکی‌ها</h2>
      <p>
        ما از کوکی‌های تبلیغاتی یا ردیاب (Tracker) استفاده نمی‌کنیم. فقط از localStorage
        برای ذخیره تنظیمات محلی استفاده می‌شود.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۷. حقوق شما</h2>
      <p>
        شما در هر زمان می‌توانید تمام داده‌های محلی خود را با گزینه «پاک کردن داده‌ها» در
        تنظیمات DApp حذف کنید. این عمل غیرقابل بازگشت است.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۸. تماس</h2>
      <p>
        برای سوالات مربوط به حریم خصوصی، با ایمیل{' '}
        <a href="mailto:info@arvandkhabar.ir" className="text-[var(--arv-gold)] hover:underline">
          info@arvandkhabar.ir
        </a>{' '}
        در تماس باشید.
      </p>
    </LegalLayout>
  );
}
