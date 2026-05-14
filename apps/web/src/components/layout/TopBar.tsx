'use client';

import { Bell } from 'lucide-react';
import { useBrandConfig } from '@/hooks/useBrandConfig';

export function TopBar() {
  const { config } = useBrandConfig();
  const businessName = config.businessName || 'My Business';
  const initials = businessName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
      <div>
        <h2 className="text-sm font-medium text-muted-foreground">Welcome back</h2>
        <p className="text-base font-semibold text-foreground">{businessName}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initials}
        </div>
      </div>
    </header>
  );
}
