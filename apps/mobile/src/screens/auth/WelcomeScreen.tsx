/**
 * WelcomeScreen — Premium editorial welcome experience.
 * Warm cream background, leaf motif, feature list with organic styling.
 *
 * Validates: Requirements 1.1
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Button, Typography } from '@/components/ui';

export interface WelcomeScreenProps {
  onGetStarted: () => void;
}

interface FeatureItem {
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    title: 'Trusted Professionals',
    description: 'Vetted experts who care for your home.',
  },
  {
    title: 'Beautiful Results',
    description: 'We take pride in every detail.',
  },
  {
    title: 'Real-time Updates',
    description: 'Know what\'s happening, every step of the way.',
  },
  {
    title: 'Personalized Care',
    description: 'Plans tailored to your lawn\'s unique needs.',
  },
];

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.leafIcon}>🌿</Text>
        <Text style={[styles.logoText, { color: tokens.colors.primary }]}>
          servvo
        </Text>
      </View>

      {/* Headline */}
      <Typography variant="h1" style={styles.headline}>
        Your home. Our care.
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body"
        color={tokens.colors.textSecondary}
        style={styles.subtitle}
      >
        Premium lawn care. Effortless experience.
      </Typography>

      {/* Feature list */}
      <View style={styles.featureList}>
        {FEATURES.map((feature) => (
          <View key={feature.title} style={styles.featureItem}>
            <Text style={styles.featureBullet}>🌿</Text>
            <View style={styles.featureContent}>
              <Typography variant="body" style={styles.featureTitle}>
                {feature.title}
              </Typography>
              <Typography
                variant="bodySmall"
                color={tokens.colors.textSecondary}
              >
                {feature.description}
              </Typography>
            </View>
          </View>
        ))}
      </View>

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
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  leafIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headline: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  featureList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  spacer: {
    flex: 1,
  },
  ctaButton: {
    width: '100%',
  },
});
