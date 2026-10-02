'use client';

import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'arv_install_dismissed';
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    try {
      const t = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (t && Date.now() - t < DISMISS_MS) return;
    } catch {}

    const ua = navigator.userAgent;
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    if (ios) {
      setIsIOS(true);
      setVisible(true);
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-24 lg:bottom-4 lg:left-auto lg:right-4 lg:w-96 z-50 rounded-2xl border border-[var(--arv-gold)]/40 bg-[var(--arv-blue-dark)]/95 backdrop-blur p-4 shadow-xl">
      <button
        onClick={dismiss}
        aria-label="بستن"
        className="absolute left-3 top-3 text-[var(--arv-text-muted)] hover:text-[var(--arv-gold)]"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-3">
        <Download size={22} className="text-[var(--arv-gold)] flex-shrink-0 mt-0.5" />
        <div className="text-sm space-y-2">
          <p className="font-bold">نصب اپ ARV روی گوشی</p>
          {isIOS && !deferred ? (
            <p className="text-xs text-[var(--arv-text-muted)] leading-6">
              در Safari دکمهٔ اشتراک‌گذاری (<Share size={12} className="inline" />) را بزنید و
              «Add to Home Screen» را انتخاب کنید.
            </p>
          ) : (
            <>
              <p className="text-xs text-[var(--arv-text-muted)]">
                برای دسترسی سریع‌تر، اپ را روی صفحهٔ اصلی نصب کنید.
              </p>
              <button
                onClick={install}
                className="px-4 py-1.5 rounded-lg bg-[var(--arv-gold)] text-[var(--arv-blue-dark)] text-xs font-bold"
              >
                نصب اپ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
