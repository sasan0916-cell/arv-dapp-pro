'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { BottomNav } from './BottomNav';
import { SplashScreen } from './SplashScreen';
import { ServiceWorkerRegister } from './pwa/ServiceWorkerRegister';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const splashShown = sessionStorage.getItem('arv_splash_shown');
      if (splashShown) {
        // قبلاً دیده شده
        setShowSplash(false);
      } else {
        // بار اول، نمایش بده
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

  // ===== قبل از mount: splash یا هیچی =====
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--arv-blue-dark)]">
        {/* اسکلتون خالی - جلوگیری از پرش */}
      </div>
    );
  }

  // ===== بعد از mount =====
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
          {children}
        </div>

        <MobileSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <BottomNav />
        <ServiceWorkerRegister />
      </div>
    </>
  );
}
