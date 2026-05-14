'use client';

import { PageTransition } from '@/components/shared/PageTransition';
import { BrandingStudio } from '@/components/branding/BrandingStudio';

export default function BrandingPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Branding Studio</h1>
          <p className="mt-1 text-muted-foreground">
            Customize your brand identity and see changes in real-time
          </p>
        </div>
        <BrandingStudio />
      </div>
    </PageTransition>
  );
}
