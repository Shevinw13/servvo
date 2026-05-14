'use client';

import { MessagingTone } from '@/types/brand';
import { getTemplatesForTone } from '@/data/mockNotificationTemplates';
import { cn } from '@/lib/utils';

interface ToneSelectorProps {
  value: MessagingTone;
  onChange: (tone: MessagingTone) => void;
}

const TONES: { value: MessagingTone; label: string; description: string; example: string }[] = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Clear, concise, and business-appropriate',
    example: 'Your service appointment has been confirmed.',
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm, approachable, and conversational',
    example: "Great news! You're all set! 🌿",
  },
  {
    value: 'luxury',
    label: 'Luxury',
    description: 'Refined, exclusive, and premium',
    example: 'We are pleased to confirm your exclusive service.',
  },
  {
    value: 'modern',
    label: 'Modern',
    description: 'Direct, efficient, and tech-forward',
    example: "Confirmed. You'll get a heads-up when they're en route.",
  },
];

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">Messaging Tone</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Choose how your notifications sound to customers
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TONES.map((tone) => (
          <button
            key={tone.value}
            onClick={() => onChange(tone.value)}
            className={cn(
              'rounded-xl border-2 p-4 text-left transition-all',
              value === tone.value
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/30'
            )}
          >
            <p className="font-semibold text-foreground">{tone.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{tone.description}</p>
            <p className="mt-2 rounded-lg bg-muted/50 px-3 py-2 text-xs italic text-muted-foreground">
              &ldquo;{tone.example}&rdquo;
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
