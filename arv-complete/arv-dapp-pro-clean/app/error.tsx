'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--arv-blue-dark)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-[var(--arv-blue)]/40 border border-[var(--arv-gold)]/20 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--arv-danger)]/15 flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-[var(--arv-danger)]" />
          </div>
          <h2 className="text-xl font-bold mb-2 gold-gradient">
            خطایی رخ داد
          </h2>
          <p className="text-sm text-[var(--arv-text-muted)] mb-6">
            {error.message || 'مشکلی پیش آمد. لطفاً دوباره امتحان کنید.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--arv-gold)] text-[var(--arv-blue-dark)] font-bold"
            >
              <RefreshCw size={16} />
              تلاش دوباره
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--arv-blue)]/40 text-white font-bold"
            >
              <Home size={16} />
              خانه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
