'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { BottomNav } from './BottomNav';
import { SplashScreen } from './SplashScreen';
import { ServiceWorkerRegister } from './pwa/ServiceWorkerRegister';
import { InstallPrompt } from './pwa/InstallPrompt';
import PageTransition from './ui/PageTransition';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const en = language === 'en';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const splashShown = sessionStorage.getItem('arv_splash_shown');
      if (splashShown) {
        setShowSplash(false);
      } else {
        setShowSplash(true);
      }
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('arv_splash_shown', 'true');
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--arv-blue-dark)]">
      </div>
    );
  }

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-[9999]">
          <SplashScreen onFinish={handleSplashFinish} />
        </div>
      )}

      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 pb-28 lg:pb-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <PageTransition>
            {children}
          </PageTransition>

          {/* ⚖️ Footer - لینک‌های حقوقی */}
          <footer className="mt-auto py-6 px-4 text-center text-[11px] text-[var(--arv-text-muted)] flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-[var(--arv-gold)]/10">
            <Link href="/terms" className="hover:text-[var(--arv-gold)] transition-colors">
              {en ? 'Terms' : 'قوانین و مقررات'}
            </Link>
            <span className="opacity-50">•</span>
            <Link href="/privacy" className="hover:text-[var(--arv-gold)] transition-colors">
              {en ? 'Privacy' : 'حریم خصوصی'}
            </Link>
            <span className="opacity-50">•</span>
            <Link href="/disclaimer" className="hover:text-[var(--arv-gold)] transition-colors">
              {en ? 'Disclaimer' : 'سلب مسئولیت'}
            </Link>
          </footer>
        </div>

        <MobileSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <BottomNav />
        <ServiceWorkerRegister />
        <InstallPrompt />
      </div>
    </>
  );
}
