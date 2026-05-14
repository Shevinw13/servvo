'use client';

import { cn } from '@/lib/utils';

interface ImagerySelectorProps {
  value: string;
  onChange: (style: string) => void;
}

const STYLES = [
  { id: 'natural', label: 'Natural', color: '#4CAF50' },
  { id: 'modern', label: 'Modern', color: '#2196F3' },
  { id: 'premium', label: 'Premium', color: '#9C27B0' },
];

export function ImagerySelector({ value, onChange }: ImagerySelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-foreground">Imagery Style</label>
      <div className="grid grid-cols-3 gap-2">
        {STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onChange(style.id)}
            className={cn(
              'rounded-xl border-2 p-3 text-center transition-all',
              value === style.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30'
            )}
          >
            <div
              className="mx-auto mb-2 h-10 w-10 rounded-lg"
              style={{ backgroundColor: style.color + '20', border: `2px solid ${style.color}40` }}
            />
            <p className="text-xs font-medium text-foreground">{style.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
