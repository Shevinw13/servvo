'use client';

import { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { ProviderTerminology } from '@/types/brand';
import { cn } from '@/lib/utils';

interface TerminologyStepProps {
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS: { value: ProviderTerminology; label: string; description: string }[] = [
  { value: 'Provider', label: 'Provider', description: 'Professional and neutral' },
  { value: 'Crew', label: 'Crew', description: 'Casual and team-oriented' },
  { value: 'Team', label: 'Team', description: 'Collaborative and friendly' },
  { value: 'Service Professional', label: 'Service Professional', description: 'Formal and premium' },
];

export function TerminologyStep({ onNext, onBack }: TerminologyStepProps) {
  const { data, setStepData } = useOnboarding();
  const { setTerminology } = useBrandConfig();
  const [selected, setSelected] = useState<ProviderTerminology>(data.terminology || 'Provider');

  const handleNext = () => {
    setStepData({ terminology: selected });
    setTerminology(selected);
    onNext();
  };

  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-2 text-2xl font-bold text-foreground">How do you refer to your team?</h2>
      <p className="mb-6 text-muted-foreground">
        This term will be used throughout the customer app.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelected(opt.value)}
            className={cn(
              'rounded-xl border-2 p-4 text-left transition-all',
              selected === opt.value
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/30'
            )}
          >
            <p className="font-semibold text-foreground">{opt.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{opt.description}</p>
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
