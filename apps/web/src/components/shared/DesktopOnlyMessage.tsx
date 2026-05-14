'use client';

import { Monitor } from 'lucide-react';

export function DesktopOnlyMessage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center lg:hidden">
      <Monitor className="mb-4 h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-semibold text-foreground">Desktop Required</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The Servvo Business Platform is optimized for desktop screens. Please use a device with a screen width of at least 1024px.
      </p>
    </div>
  );
}
