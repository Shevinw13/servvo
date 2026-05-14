'use client';

import { cn } from '@/lib/utils';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgressBar({ currentStep, totalSteps }: StepProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            i === currentStep
              ? 'w-8 bg-primary'
              : i < currentStep
                ? 'w-2 bg-primary/60'
                : 'w-2 bg-muted'
          )}
        />
      ))}
    </div>
  );
}
