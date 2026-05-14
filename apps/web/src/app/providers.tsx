'use client';

import { BrandConfigProvider } from '@/contexts/BrandConfigContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { CRMProvider } from '@/contexts/CRMContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BrandConfigProvider>
      <OnboardingProvider>
        <CRMProvider>{children}</CRMProvider>
      </OnboardingProvider>
    </BrandConfigProvider>
  );
}
