import { LegalLayout } from '@/components/ui/LegalLayout';

export const metadata = {
  title: 'سلب مسئولیت | ARV Super DApp',
  description: 'سلب مسئولیت حقوقی و مالی ARV DApp',
};

export default function DisclaimerPage() {
  return (
    <LegalLayout title="سلب مسئولیت" icon="disclaimer" lastUpdated="۱۸ اکتبر ۲۰۲۶">
      <h2 className="text-base font-bold text-[var(--arv-gold)]">۱. هشدار خطر سرمایه‌گذاری</h2>
      <p className="p-3 rounded-lg bg-[var(--arv-danger)]/10 border border-[var(--arv-danger)]/30">
        ⚠️ <strong>هشدار جدی:</strong> سرمایه‌گذاری در ارزهای دیجیتال و توکن‌های DeFi
        ریسک بسیار بالایی دارد و ممکن است منجر به از دست دادن کل سرمایه شما شود. تنها
        با سرمایه‌ای وارد شوید که توانایی از دست دادن آن را دارید.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۲. وضعیت توسعه</h2>
      <p>
        ARV در حال حاضر در مرحله توسعه و آزمایش (Testnet / Beta) قرار دارد. عملکرد،
        قابلیت‌ها و قراردادهای هوشمند ممکن است بدون اطلاع قبلی تغییر کنند.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۳. عدم مشاوره مالی</h2>
      <p>
        هیچ‌یک از مطالب، اطلاعات یا ابزارهای این DApp به عنوان مشاوره مالی، سرمایه‌گذاری،
        حقوقی یا مالیاتی تلقی نمی‌شود. تصمیم‌گیری نهایی بر عهده خود شماست.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۴. مسئولیت قراردادهای هوشمند</h2>
      <p>
        اگرچه قراردادهای هوشمند ARV با دقت طراحی و تست شده‌اند، اما هیچ تضمینی مبنی بر
        بدون باگ بودن کامل آن‌ها وجود ندارد. ARV هیچ‌گونه مسئولیتی در قبال ضرر ناشی از
        آسیب‌پذیری قراردادها نمی‌پذیرد.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۵. مسئولیت کیف پول شخصی</h2>
      <p>
        شما به تنهایی مسئول حفظ امنیت دستگاه، رمز عبور و عبارت بازیابی خود هستید. ARV
        هیچ‌گونه دسترسی به دارایی‌های شما ندارد و در صورت سرقت یا گم شدن، قادر به
        بازگرداندن آن‌ها نیست.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۶. تغییرات بدون اطلاع</h2>
      <p>
        ما حق توقف، تعلیق یا تغییر سرویس DApp را در هر زمان و بدون اطلاع قبلی محفوظ
        می‌داریم.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۷. قوانین محلی</h2>
      <p>
        استفاده از ارزهای دیجیتال در برخی کشورها ممکن است غیرقانونی یا محدود باشد. مسئولیت
        بررسی و رعایت قوانین محلی کشور خود، بر عهده شماست.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۸. تماس</h2>
      <p>
        برای هرگونه سوال، با ایمیل{' '}
        <a href="mailto:info@arvandkhabar.ir" className="text-[var(--arv-gold)] hover:underline">
          info@arvandkhabar.ir
        </a>{' '}
        در تماس باشید.
      </p>
    </LegalLayout>
  );
}
