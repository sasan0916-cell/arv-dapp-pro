'use client';

/**
 * ReferralTracker
 * هر بار که DApp باز می‌شه، چک می‌کنه که ?ref= توی URL هست یا نه.
 * اگه هست، کد رو ذخیره می‌کنه تا بعداً پاداش داده بشه.
 */

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveReferrerCode, loadReferrerCode } from '@/lib/services/referral-service';

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (!ref) return;

    // چک کن قبلاً ذخیره نشده
    (async () => {
      const existing = await loadReferrerCode();
      if (existing === ref) return;

      // ذخیره کد معرف
      await saveReferrerCode(ref);
      console.log('[Referral] Saved referrer code:', ref);
    })();
  }, [searchParams]);

  return null;
}
