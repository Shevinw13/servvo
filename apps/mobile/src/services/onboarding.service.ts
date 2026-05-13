/**
 * Onboarding service for completing the user onboarding flow.
 * Calls POST /users/me/onboarding with combined profile and property data.
 *
 * Validates: Requirements 2.1, 2.5
 */

import api from './api';
import { User } from '../stores/authStore';

export interface OnboardingPayload {
  name: string;
  email?: string;
  property: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface OnboardingResponse {
  user: User;
}

/**
 * Submit onboarding data (profile + property) to the backend.
 * Returns the updated user with onboarding_complete = true.
 */
export async function completeOnboarding(
  payload: OnboardingPayload,
): Promise<OnboardingResponse> {
  const response = await api.post<OnboardingResponse>(
    '/users/me/onboarding',
    payload,
  );
  return response.data;
}
