'use client';

import { LegalLayout } from '@/components/ui/LegalLayout';
import { useLanguage } from '@/lib/i18n';

export default function DisclaimerPage() {
  const { language } = useLanguage();
  const en = language === 'en';

  return (
    <LegalLayout 
      title={en ? "Disclaimer" : "سلب مسئولیت"} 
      icon="disclaimer" 
      lastUpdated={en ? "October 18, 2026" : "۱۸ اکتبر ۲۰۲۶"}
    >
      {en ? (
        <>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">1. Investment Risk Warning</h2>
          <p className="p-3 rounded-lg bg-[var(--arv-danger)]/10 border border-[var(--arv-danger)]/30">⚠️ <strong>Serious Warning:</strong> Investing in cryptocurrencies and DeFi tokens carries extremely high risk and may result in total loss of your capital. Only invest what you can afford to lose.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">2. Development Status</h2>
          <p>ARV is currently in Testnet/Beta. Features, performance, and smart contracts may change without prior notice.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">3. No Financial Advice</h2>
          <p>Nothing in this DApp constitutes financial, investment, legal, or tax advice. Final decisions are your responsibility.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">4. Smart Contract Responsibility</h2>
          <p>Although ARV smart contracts are carefully designed and tested, there is no guarantee they are completely bug-free. ARV assumes no liability for losses due to contract vulnerabilities.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">5. Personal Wallet Responsibility</h2>
          <p>You are solely responsible for securing your device, password, and recovery phrase. ARV has no access to your assets and cannot recover them if stolen or lost.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">6. Changes Without Notice</h2>
          <p>We reserve the right to pause, suspend, or modify the DApp at any time without notice.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">7. Local Laws</h2>
          <p>Using cryptocurrencies may be illegal or restricted in some countries. It is your responsibility to comply with local laws.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">8. Contact</h2>
          <p>For questions, email <a href="mailto:info@arvandkhabar.ir" className="text-[var(--arv-gold)] hover:underline">info@arvandkhabar.ir</a>.</p>
        </>
      ) : (
        <>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۱. هشدار خطر سرمایه‌گذاری</h2>
          <p className="p-3 rounded-lg bg-[var(--arv-danger)]/10 border border-[var(--arv-danger)]/30">⚠️ <strong>هشدار جدی:</strong> سرمایه‌گذاری در ارزهای دیجیتال و توکن‌های DeFi ریسک بسیار بالایی دارد و ممکن است منجر به از دست دادن کل سرمایه شما شود. تنها با سرمایه‌ای وارد شوید که توانایی از دست دادن آن را دارید.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۲. وضعیت توسعه</h2>
          <p>ARV در حال حاضر در مرحله توسعه و آزمایش (Testnet / Beta) قرار دارد. عملکرد، قابلیت‌ها و قراردادهای هوشمند ممکن است بدون اطلاع قبلی تغییر کنند.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۳. عدم مشاوره مالی</h2>
          <p>هیچ‌یک از مطالب، اطلاعات یا ابزارهای این DApp به عنوان مشاوره مالی، سرمایه‌گذاری، حقوقی یا مالیاتی تلقی نمی‌شود. تصمیم‌گیری نهایی بر عهده خود شماست.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۴. مسئولیت قراردادهای هوشمند</h2>
          <p>اگرچه قراردادهای هوشمند ARV با دقت طراحی و تست شده‌اند، اما هیچ تضمینی مبنی بر بدون باگ بودن کامل آن‌ها وجود ندارد. ARV هیچ‌گونه مسئولیتی در قبال ضرر ناشی از آسیب‌پذیری قراردادها نمی‌پذیرد.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۵. مسئولیت کیف پول شخصی</h2>
          <p>شما به تنهایی مسئول حفظ امنیت دستگاه، رمز عبور و عبارت بازیابی خود هستید. ARV هیچ‌گونه دسترسی به دارایی‌های شما ندارد و در صورت سرقت یا گم شدن، قادر به بازگرداندن آن‌ها نیست.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۶. تغییرات بدون اطلاع</h2>
          <p>ما حق توقف، تعلیق یا تغییر سرویس DApp را در هر زمان و بدون اطلاع قبلی محفوظ می‌داریم.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۷. قوانین محلی</h2>
          <p>استفاده از ارزهای دیجیتال در برخی کشورها ممکن است غیرقانونی یا محدود باشد. مسئولیت بررسی و رعایت قوانین محلی کشور خود، بر عهده شماست.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۸. تماس</h2>
          <p>برای هرگونه سوال، با ایمیل <a href="mailto:info@arvandkhabar.ir" className="text-[var(--arv-gold)] hover:underline">info@arvandkhabar.ir</a> در تماس باشید.</p>
        </>
      )}
    </LegalLayout>
  );
}
