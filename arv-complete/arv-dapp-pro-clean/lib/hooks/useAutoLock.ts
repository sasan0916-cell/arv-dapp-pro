/**
 * Auto-Lock Hook
 * قفل خودکار کیف پول بعد از بی‌فعالیتی یا رفتن به پس‌زمینه
 */
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoLockOptions {
  timeoutMinutes?: number;
  onLock: () => void;
  enabled?: boolean;
  /** Optional: callback for lock warning (last 30 seconds) */
  onWarning?: (secondsRemaining: number) => void;
}

export function useAutoLock({
  timeoutMinutes = 5,
  onLock,
  enabled = true,
  onWarning,
}: UseAutoLockOptions) {
  const [remaining, setRemaining] = useState(timeoutMinutes * 60);
  const lastActivityRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef<boolean>(false);
  const onLockRef = useRef(onLock);
  const onWarningRef = useRef(onWarning);

  // Update refs when callbacks change (avoid restarting timer)
  useEffect(() => {
    onLockRef.current = onLock;
    onWarningRef.current = onWarning;
  }, [onLock, onWarning]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setRemaining(timeoutMinutes * 60);
    warningShownRef.current = false;
  }, [timeoutMinutes]);

  useEffect(() => {
    if (!enabled) return;

    const timeoutMs = timeoutMinutes * 60 * 1000;

    // Activity events
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'visibilitychange'];
    const handleActivity = () => {
      if (document.visibilityState === 'visible') {
        resetTimer();
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Visibility change - lock immediately when hidden
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Lock immediately when going to background (security)
        onLockRef.current();
      } else {
        resetTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Interval to check idle
    intervalRef.current = setInterval(() => {
      if (!enabled) return;
      
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const left = Math.max(0, Math.floor((timeoutMs - elapsed) / 1000));
      
      setRemaining(left);

      // Warning at 30 seconds remaining
      if (left <= 30 && left > 0 && !warningShownRef.current) {
        warningShownRef.current = true;
        onWarningRef.current?.(left);
      }

      // Lock when time is up
      if (elapsed >= timeoutMs) {
        onLockRef.current();
      }
    }, 1000);

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, timeoutMinutes, resetTimer]);

  return {
    remaining,
    resetTimer,
    warningActive: remaining <= 30 && remaining > 0,
  };
}
