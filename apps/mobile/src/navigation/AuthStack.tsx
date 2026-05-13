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
import { useAuth } from '@/hooks/useAuth';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const { login } = useAuth();

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
            onVerify={async (code) => {
              // In production, this would verify the OTP with Firebase
              // and get an ID token, then call login(idToken).
              // For now, we use the code as a placeholder token.
              await login(code);
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
