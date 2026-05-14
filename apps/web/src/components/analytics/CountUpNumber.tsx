'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface CountUpNumberProps {
  end: number;
  duration?: number;
  format?: (value: number) => string;
}

export function CountUpNumber({ end, duration = 1500, format }: CountUpNumberProps) {
  const value = useCountUp({ end, duration });

  return <span>{format ? format(value) : value}</span>;
}
