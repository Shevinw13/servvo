/**
 * RootNavigator — Top-level navigator that switches between
 * the auth flow, onboarding, and the main app based on
 * authentication and onboarding state.
 *
 * Flow: Loading → Auth → Onboarding → Main
 *
 * Validates: Requirements 1.2, 2.1, 2.5, 13.1
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/theme/BrandThemeProvider';
import { AuthStack } from './AuthStack';
import { OnboardingStack } from './OnboardingStack';
import { MainTabNavigator } from './MainTabNavigator';

/**
 * Loading screen shown while restoring the session on app launch.
 */
function LoadingScreen() {
  const { tokens } = useTheme();

  return (
    <View style={[styles.loadingContainer, { backgroundColor: tokens.colors.background }]}>
      <ActivityIndicator size="large" color={tokens.colors.primary} />
    </View>
  );
}

export function RootNavigator() {
  const { isAuthenticated, isLoading, user, restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Determine which flow to show based on auth + onboarding state
  const isOnboarded = user?.onboarding_complete ?? false;

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : !isOnboarded ? (
        <OnboardingStack />
      ) : (
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
