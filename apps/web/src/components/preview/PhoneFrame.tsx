'use client';

import { cn } from '@/lib/utils';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'relative mx-auto w-[280px] rounded-[40px] border-[8px] border-gray-900 bg-gray-900 shadow-2xl',
        className
      )}
      style={{ aspectRatio: '9 / 19.5' }}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-gray-900" />

      {/* Screen */}
      <div className="h-full w-full overflow-hidden rounded-[32px] bg-white">
        <div className="h-full w-full overflow-y-auto pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
