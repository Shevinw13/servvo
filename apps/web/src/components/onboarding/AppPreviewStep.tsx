'use client';

import { MobilePreview } from '@/components/preview/MobilePreview';

interface AppPreviewStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function AppPreviewStep({ onNext, onBack }: AppPreviewStepProps) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Preview your app</h2>
        <p className="text-muted-foreground">
          Here&apos;s how your customers will experience your brand.
        </p>
      </div>

      <MobilePreview />

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
        >
          Looks great!
        </button>
      </div>
    </div>
  );
}
