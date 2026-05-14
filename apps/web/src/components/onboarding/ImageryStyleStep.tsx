'use client';

import { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { cn } from '@/lib/utils';

interface ImageryStyleStepProps {
  onNext: () => void;
  onBack: () => void;
}

const STYLES = [
  { id: 'natural', label: 'Natural', description: 'Organic textures, earthy tones, real photography', color: '#4CAF50' },
  { id: 'modern', label: 'Modern', description: 'Clean lines, minimal, geometric patterns', color: '#2196F3' },
  { id: 'premium', label: 'Premium', description: 'Rich textures, gold accents, luxury feel', color: '#9C27B0' },
];

export function ImageryStyleStep({ onNext, onBack }: ImageryStyleStepProps) {
  const { data, setStepData } = useOnboarding();
  const { setImageryStyle } = useBrandConfig();
  const [selected, setSelected] = useState(data.imageryStyle || 'natural');

  const handleNext = () => {
    setStepData({ imageryStyle: selected });
    setImageryStyle(selected);
    onNext();
  };

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-2 text-2xl font-bold text-foreground">Choose your imagery style</h2>
      <p className="mb-6 text-muted-foreground">
        This defines the visual mood of your customer app.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelected(style.id)}
            className={cn(
              'rounded-xl border-2 p-4 text-center transition-all',
              selected === style.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/30'
            )}
          >
            <div
              className="mx-auto mb-3 h-16 w-16 rounded-lg"
              style={{ backgroundColor: style.color + '20', border: `2px solid ${style.color}40` }}
            />
            <p className="text-sm font-semibold text-foreground">{style.label}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{style.description}</p>
          </button>
        ))}
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
