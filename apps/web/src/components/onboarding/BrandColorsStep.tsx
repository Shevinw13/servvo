'use client';

import { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { isValidHex } from '@/lib/colorUtils';
import { cn } from '@/lib/utils';

interface BrandColorsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PRESET_COLORS = [
  '#2D4A2D', '#1B5E20', '#0D47A1', '#4A148C',
  '#BF360C', '#E65100', '#F57F17', '#1A237E',
  '#004D40', '#263238', '#3E2723', '#880E4F',
];

export function BrandColorsStep({ onNext, onBack }: BrandColorsStepProps) {
  const { data, setStepData } = useOnboarding();
  const { setColors } = useBrandConfig();

  const [primary, setPrimary] = useState(data.colors?.primary || '#2D4A2D');
  const [accent, setAccent] = useState(data.colors?.accent || '#5C8A4D');

  const handleNext = () => {
    if (isValidHex(primary) && isValidHex(accent)) {
      setStepData({ colors: { primary, accent } });
      setColors(primary, accent);
      onNext();
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-2 text-2xl font-bold text-foreground">Choose your brand colors</h2>
      <p className="mb-6 text-muted-foreground">
        These colors will define your app&apos;s look and feel.
      </p>

      <div className="space-y-6">
        {/* Primary Color */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Primary Color</label>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg border border-border"
              style={{ backgroundColor: isValidHex(primary) ? primary : '#ccc' }}
            />
            <input
              type="text"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              placeholder="#2D4A2D"
              className="w-32 rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setPrimary(color)}
                className={cn(
                  'h-8 w-8 rounded-lg border-2 transition-all',
                  primary === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Accent Color</label>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg border border-border"
              style={{ backgroundColor: isValidHex(accent) ? accent : '#ccc' }}
            />
            <input
              type="text"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              placeholder="#5C8A4D"
              className="w-32 rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
