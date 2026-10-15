'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, rgba(20, 42, 74, 0.95), rgba(10, 18, 32, 0.98))',
          color: '#ffffff',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '14px',
          padding: '12px 18px',
          fontSize: '13px',
          fontWeight: 600,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(212, 175, 55, 0.15)',
        },
        success: { iconTheme: { primary: '#10b981', secondary: '#050912' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#050912' } },
      }}
    />
  );
}
