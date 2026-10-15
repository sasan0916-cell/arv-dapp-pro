'use client';

import { useEffect, useState } from 'react';
import { useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  separator?: boolean;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  duration = 1.5,
  prefix = '',
  suffix = '',
  className = '',
  separator = true,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { duration: duration * 1000 });
  const rounded = useTransform(spring, (latest) => {
    return Number(latest.toFixed(decimals));
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplay(latest);
    });
    return () => unsubscribe();
  }, [rounded]);

  const formatted = separator
    ? display.toLocaleString('fa-IR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : display.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
