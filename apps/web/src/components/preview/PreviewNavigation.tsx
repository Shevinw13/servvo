'use client';

import { cn } from '@/lib/utils';

interface PreviewNavigationProps {
  screens: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function PreviewNavigation({ screens, activeIndex, onChange }: PreviewNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {screens.map((screen, i) => (
        <button
          key={screen}
          onClick={() => onChange(i)}
          className={cn(
            'h-2.5 rounded-full transition-all duration-200',
            i === activeIndex
              ? 'w-6 bg-primary'
              : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
          )}
          aria-label={`View ${screen} screen`}
        />
      ))}
    </div>
  );
}
