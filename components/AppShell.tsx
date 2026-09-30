'use client';

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar دسکتاپ */}
      <Sidebar />

      {/* محتوا */}
      <div className="flex-1 flex flex-col min-w-0 pb-28 lg:pb-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {children}
      </div>

      {/* MobileSidebar موبایل */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* BottomNav موبایل */}
      <BottomNav />
    </div>
  );
}
