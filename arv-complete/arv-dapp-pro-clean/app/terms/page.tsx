'use client';

import { LegalLayout } from '@/components/ui/LegalLayout';
import { useLanguage } from '@/lib/i18n';

export default function TermsPage() {
  const { language } = useLanguage();
  const en = language === 'en';

  return (
    <LegalLayout 
      title={en ? "Terms of Service" : "قوانین و مقررات"} 
      icon="terms" 
      lastUpdated={en ? "October 18, 2026" : "۱۸ اکتبر ۲۰۲۶"}
    >
      {en ? (
        <>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">1. Acceptance of Terms</h2>
          <p>By using ARV Super DApp (Decentralized Exchange and ARV Token Wallet), you confirm that you have read and accepted these terms. If you do not agree, please do not use the service.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">2. Decentralized Nature</h2>
          <p>ARV Super DApp is a Non-Custodial protocol. We do not have access to your private keys, assets, or transactions. All actions happen directly on the BNB Smart Chain.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">3. Wallet Responsibility</h2>
          <p>You are solely responsible for keeping your password, Seed Phrase, and private keys secure. We cannot recover your assets if this information is lost.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">4. Prohibited Use</h2>
          <p>Using this service for illegal activities including money laundering, terrorism financing, fraud, or violating local/international laws is strictly prohibited.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">5. Fees</h2>
          <p>All transactions require network Gas Fees on BNB Smart Chain. ARV DApp does not charge extra fees for trades.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">6. Changes to Terms</h2>
          <p>We reserve the right to change these terms at any time. Changes are effective immediately upon posting.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">7. Contact</h2>
          <p>For questions, contact us at <a href="mailto:info@arvandkhabar.ir" className="text-[var(--arv-gold)] hover:underline">info@arvandkhabar.ir</a>.</p>
        </>
      ) : (
        <>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۱. پذیرش قوانین</h2>
          <p>با استفاده از سرویس ARV Super DApp (صرافی غیرمتمرکز و کیف پول توکن ARV)، شما تأیید می‌کنید که این قوانین را مطالعه کرده و می‌پذیرید. اگر با هر یک از این شرایط موافق نیستید، لطفاً از سرویس استفاده نکنید.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۲. ماهیت غیرمتمرکز سرویس</h2>
          <p>ARV Super DApp یک پروتکل غیرمتمرکز (Non-Custodial) است. ما هیچ‌گونه دسترسی به کلیدهای خصوصی، دارایی‌ها یا تراکنش‌های شما نداریم. تمام عملیات ارسال، دریافت، معامله و استیکینگ مستقیماً روی شبکه BNB Smart Chain انجام می‌شود.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۳. مسئولیت کیف پول</h2>
          <p>شما مسئول حفظ و نگهداری امن رمز عبور، عبارت بازیابی (Seed Phrase) و کلیدهای خصوصی هستید. در صورت گم شدن این اطلاعات، امکان بازیابی دارایی‌های شما توسط ما وجود ندارد.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۴. ممنوعیت استفاده غیرقانونی</h2>
          <p>استفاده از این سرویس برای فعالیت‌های غیرقانونی شامل پولشویی، تأمین مالی تروریسم، کلاهبرداری یا هرگونه نقض قوانین محلی و بین‌المللی اکیداً ممنوع است.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۵. کارمزدها</h2>
          <p>تمام تراکنش‌ها نیازمند پرداخت کارمزد شبکه (Gas Fee) به ماینرهای شبکه BNB Smart Chain هستند. ARV DApp کارمزد اضافی بابت معاملات دریافت نمی‌کند.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۶. تغییرات در قوانین</h2>
          <p>ما حق تغییر این قوانین در هر زمان را محفوظ می‌داریم. تغییرات از زمان انتشار در همین صفحه معتبر خواهند بود.</p>
          <h2 className="text-base font-bold text-[var(--arv-gold)]">۷. تماس</h2>
          <p>برای هرگونه سوال یا ابهام، از طریق ایمیل <a href="mailto:info@arvandkhabar.ir" className="text-[var(--arv-gold)] hover:underline">info@arvandkhabar.ir</a> با ما در ارتباط باشید.</p>
        </>
      )}
    </LegalLayout>
  );
}
