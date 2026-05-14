'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { StepProgressBar } from './StepProgressBar';
import { StepTransition } from './StepTransition';
import { WelcomeStep } from './WelcomeStep';
import { BusinessInfoStep } from './BusinessInfoStep';
import { LogoUploadStep } from './LogoUploadStep';
import { BrandColorsStep } from './BrandColorsStep';
import { TerminologyStep } from './TerminologyStep';
import { ImageryStyleStep } from './ImageryStyleStep';
import { CRMConnectionStep } from './CRMConnectionStep';
import { AppPreviewStep } from './AppPreviewStep';
import { CompletionStep } from './CompletionStep';

const TOTAL_STEPS = 9;

export function OnboardingWizard() {
  const router = useRouter();
  const { currentStep, nextStep, prevStep, complete } = useOnboarding();
  const { setOnboarded } = useBrandConfig();
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const handleNext = () => {
    setDirection('forward');
    nextStep();
  };

  const handleBack = () => {
    setDirection('backward');
    prevStep();
  };

  const handleComplete = () => {
    complete();
    setOnboarded(true);
    router.push('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <BusinessInfoStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <LogoUploadStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <BrandColorsStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <TerminologyStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <ImageryStyleStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <CRMConnectionStep onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <AppPreviewStep onNext={handleNext} onBack={handleBack} />;
      case 8:
        return <CompletionStep onComplete={handleComplete} />;
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {currentStep > 0 && currentStep < TOTAL_STEPS - 1 && (
          <div className="mb-8 flex justify-center">
            <StepProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </div>
        )}

        <StepTransition direction={direction} stepKey={`step-${currentStep}`}>
          {renderStep()}
        </StepTransition>
      </div>
    </div>
  );
}
