'use client';

import { MessagingTone } from '@/types/brand';
import { cn } from '@/lib/utils';

interface ToneSelectorProps {
  value: MessagingTone;
  onChange: (tone: MessagingTone) => void;
}

const TONES: { value: MessagingTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'modern', label: 'Modern' },
];

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-foreground">Messaging Tone</label>
      <div className="grid grid-cols-2 gap-2">
        {TONES.map((tone) => (
          <button
            key={tone.value}
            onClick={() => onChange(tone.value)}
            className={cn(
              'rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all',
              value === tone.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border text-foreground hover:border-primary/30'
            )}
          >
            {tone.label}
          </button>
        ))}
      </div>
    </div>
  );
}
