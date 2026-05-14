'use client';

import { cn } from '@/lib/utils';

interface FontPairing {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
}

interface TypographySelectorProps {
  value: string;
  onChange: (fontId: string) => void;
}

const FONT_PAIRINGS: FontPairing[] = [
  { id: 'classic', name: 'Classic', headingFont: 'Georgia, serif', bodyFont: 'Inter, sans-serif' },
  { id: 'modern', name: 'Modern', headingFont: 'Inter, sans-serif', bodyFont: 'Inter, sans-serif' },
  { id: 'elegant', name: 'Elegant', headingFont: 'Playfair Display, serif', bodyFont: 'Lato, sans-serif' },
];

export function TypographySelector({ value, onChange }: TypographySelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-foreground">Typography</label>
      <div className="space-y-2">
        {FONT_PAIRINGS.map((font) => (
          <button
            key={font.id}
            onClick={() => onChange(font.id)}
            className={cn(
              'w-full rounded-xl border-2 p-4 text-left transition-all',
              value === font.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30'
            )}
          >
            <p className="text-sm font-semibold text-foreground" style={{ fontFamily: font.headingFont }}>
              {font.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground" style={{ fontFamily: font.bodyFont }}>
              The quick brown fox jumps over the lazy dog
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
