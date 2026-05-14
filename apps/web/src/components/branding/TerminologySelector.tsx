'use client';

import { ProviderTerminology } from '@/types/brand';
import { cn } from '@/lib/utils';

interface TerminologySelectorProps {
  value: ProviderTerminology;
  onChange: (term: ProviderTerminology) => void;
}

const OPTIONS: ProviderTerminology[] = ['Provider', 'Crew', 'Team', 'Service Professional'];

export function TerminologySelector({ value, onChange }: TerminologySelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-foreground">Terminology</label>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((term) => (
          <button
            key={term}
            onClick={() => onChange(term)}
            className={cn(
              'rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all',
              value === term
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border text-foreground hover:border-primary/30'
            )}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
