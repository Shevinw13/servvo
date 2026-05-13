/**
 * AuthStack — Navigation stack for the authentication flow.
 * Routes: Welcome → PhoneInput → OTP
 *
 * Validates: Requirements 1.2, 13.1
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '@/screens/auth/WelcomeScreen';
import { PhoneInputScreen } from '@/screens/auth/PhoneInputScreen';
import { OTPScreen } from '@/screens/auth/OTPScreen';
import { useAuthStore } from '@/stores/authStore';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Welcome"
        options={{ headerShown: false }}
      >
        {({ navigation }) => (
          <WelcomeScreen
            onGetStarted={() => navigation.navigate('PhoneInput')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="PhoneInput"
        options={{ title: '' }}
      >
        {({ navigation }) => (
          <PhoneInputScreen
            onSendCode={(phoneNumber) =>
              navigation.navigate('OTP', { phoneNumber })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="OTP"
        options={{ title: '' }}
      >
        {({ route }) => (
          <OTPScreen
            phoneNumber={route.params.phoneNumber}
            onVerify={async (_code) => {
              // Demo mode: skip real API call, set mock user directly
              setAuth('demo-token', {
                id: 'demo-user-1',
                phone: route.params.phoneNumber,
                name: null,
                email: null,
                onboarding_complete: false,
                business_id: 'demo-business-1',
              });
            }}
            onResend={() => {
              // Re-trigger SMS send — handled by Firebase in production
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
