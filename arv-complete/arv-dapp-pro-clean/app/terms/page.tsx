import { LegalLayout } from '@/components/ui/LegalLayout';

export const metadata = {
  title: 'قوانین و مقررات | ARV Super DApp',
  description: 'شرایط استفاده از صرافی غیرمتمرکز و کیف پول ARV',
};

export default function TermsPage() {
  return (
    <LegalLayout title="قوانین و مقررات" icon="terms" lastUpdated="۱۸ اکتبر ۲۰۲۶">
      <h2 className="text-base font-bold text-[var(--arv-gold)]">۱. پذیرش قوانین</h2>
      <p>
        با استفاده از سرویس ARV Super DApp (صرافی غیرمتمرکز و کیف پول توکن ARV)، شما تأیید
        می‌کنید که این قوانین را مطالعه کرده و می‌پذیرید. اگر با هر یک از این شرایط موافق
        نیستید، لطفاً از سرویس استفاده نکنید.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۲. ماهیت غیرمتمرکز سرویس</h2>
      <p>
        ARV Super DApp یک پروتکل غیرمتمرکز (Non-Custodial) است. ما هیچ‌گونه دسترسی به
        کلیدهای خصوصی، دارایی‌ها یا تراکنش‌های شما نداریم. تمام عملیات ارسال، دریافت،
        معامله و استیکینگ مستقیماً روی شبکه BNB Smart Chain انجام می‌شود.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۳. مسئولیت کیف پول</h2>
      <p>
        شما مسئول حفظ و نگهداری امن رمز عبور، عبارت بازیابی (Seed Phrase) و کلیدهای خصوصی
        هستید. در صورت گم شدن این اطلاعات، امکان بازیابی دارایی‌های شما توسط ما وجود ندارد.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۴. ممنوعیت استفاده غیرقانونی</h2>
      <p>
        استفاده از این سرویس برای فعالیت‌های غیرقانونی شامل پولشویی، تأمین مالی تروریسم،
        کلاهبرداری یا هرگونه نقض قوانین محلی و بین‌المللی اکیداً ممنوع است.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۵. کارمزدها</h2>
      <p>
        تمام تراکنش‌ها نیازمند پرداخت کارمزد شبکه (Gas Fee) به ماینرهای شبکه BNB Smart Chain
        هستند. ARV DApp کارمزد اضافی بابت معاملات دریافت نمی‌کند.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۶. تغییرات در قوانین</h2>
      <p>
        ما حق تغییر این قوانین در هر زمان را محفوظ می‌داریم. تغییرات از زمان انتشار در
        همین صفحه معتبر خواهند بود.
      </p>

      <h2 className="text-base font-bold text-[var(--arv-gold)]">۷. تماس</h2>
      <p>
        برای هرگونه سوال یا ابهام، از طریق ایمیل{' '}
        <a href="mailto:info@arvandkhabar.ir" className="text-[var(--arv-gold)] hover:underline">
          info@arvandkhabar.ir
        </a>{' '}
        با ما در ارتباط باشید.
      </p>
    </LegalLayout>
  );
}
