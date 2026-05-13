/**
 * WelcomeScreen — Premium branded splash screen.
 * Displays the business logo, tagline, and a "Get Started" CTA.
 *
 * Validates: Requirements 1.1
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Button, Typography } from '@/components/ui';

export interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      {/* Hero imagery placeholder */}
      <View
        style={[
          styles.heroImage,
          {
            backgroundColor: tokens.colors.accent,
            borderRadius: tokens.borderRadius.xl,
          },
        ]}
        accessibilityLabel="Lawn care imagery"
      />

      {/* Branded logo placeholder */}
      <View style={styles.logoContainer}>
        <Typography variant="h1" style={styles.logoText}>
          Servvo
        </Typography>
      </View>

      {/* Tagline */}
      <Typography
        variant="body"
        color={tokens.colors.textSecondary}
        style={styles.tagline}
      >
        Your trusted partner for a beautiful, healthy lawn.
      </Typography>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Get Started CTA */}
      <Button
        title="Get Started"
        onPress={onGetStarted}
        variant="primary"
        style={styles.ctaButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 48,
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 220,
    opacity: 0.15,
  },
  logoContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  logoText: {
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  spacer: {
    flex: 1,
  },
  ctaButton: {
    width: '100%',
  },
});
