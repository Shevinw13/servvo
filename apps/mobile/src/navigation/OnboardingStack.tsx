/**
 * OnboardingStack — Navigation stack for the onboarding flow.
 * Routes: ProfileSetup → PropertySetup → Confirmation → Dashboard
 *
 * After authentication, new users are guided through profile and property
 * setup before reaching the main app.
 *
 * Validates: Requirements 2.1, 2.5
 */

import React, { useState } from 'react';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileSetupScreen } from '@/screens/onboarding/ProfileSetupScreen';
import { PropertySetupScreen } from '@/screens/onboarding/PropertySetupScreen';
import { ConfirmationScreen } from '@/screens/onboarding/ConfirmationScreen';
import { useAuthStore } from '@/stores/authStore';
import * as onboardingService from '@/services/onboarding.service';
import type { OnboardingStackParamList } from './types';
import type { ProfileSetupData } from '@/screens/onboarding/ProfileSetupScreen';
import type { PropertySetupData } from '@/screens/onboarding/PropertySetupScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingStack() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Stack.Navigator
      initialRouteName="ProfileSetup"
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ProfileSetup"
        options={{ title: '' }}
      >
        {({ navigation }) => (
          <ProfileSetupScreen
            onContinue={(data: ProfileSetupData) => {
              navigation.navigate('PropertySetup', {
                name: data.name,
                email: data.email,
              });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="PropertySetup"
        options={{ title: '' }}
      >
        {({ navigation, route }) => (
          <PropertySetupScreen
            onContinue={async (propertyData: PropertySetupData) => {
              if (isSubmitting) return;
              setIsSubmitting(true);

              try {
                const payload: onboardingService.OnboardingPayload = {
                  name: route.params.name,
                  email: route.params.email,
                  property: propertyData,
                };

                const { user } = await onboardingService.completeOnboarding(payload);

                // Update the auth store with the onboarded user
                if (accessToken) {
                  setAuth(accessToken, user);
                }

                navigation.navigate('Confirmation');
              } catch {
                Alert.alert(
                  'Something went wrong',
                  'We could not save your information. Please try again.',
                );
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Confirmation"
        options={{ headerShown: false }}
      >
        {() => (
          <ConfirmationScreen
            onGoToDashboard={() => {
              // Mark onboarding as complete in the store.
              // The RootNavigator will detect this and switch to the main app.
              const { user } = useAuthStore.getState();
              if (user && accessToken) {
                setAuth(accessToken, { ...user, onboarding_complete: true });
              }
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
