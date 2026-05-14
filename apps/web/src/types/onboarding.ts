import { BrandConfig } from './brand';

export interface OnboardingState {
  isComplete: boolean;
  currentStep: number;
  data: Partial<BrandConfig>;
  crmSelections: string[];
}
