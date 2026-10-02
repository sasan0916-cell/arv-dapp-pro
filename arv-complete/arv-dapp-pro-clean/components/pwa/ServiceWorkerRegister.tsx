'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('[PWA] Service Worker registered', registration.scope);
      } catch (error) {
        console.error('[PWA] Service Worker registration failed', error);
      }
    };

    window.addEventListener('load', registerSW);

    return () => {
      window.removeEventListener('load', registerSW);
    };
  }, []);

  return null;
}
