/**
 * WelcomeScreen — Premium Servvo branded welcome experience.
 * Navy/teal brand identity with app icon and tagline.
 */

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
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
    title: 'Real-time Updates',
    description: 'Know what\'s happening, every step of the way.',
  },
  {
    title: 'Effortless Payments',
    description: 'Pay securely, right from the app.',
  },
  {
    title: 'Personalized Care',
    description: 'Services tailored to your home\'s unique needs.',
  },
];

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      {/* App Icon */}
      <View style={styles.iconContainer}>
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.appIcon}
          resizeMode="contain"
        />
      </View>

      {/* Brand Name */}
      <View style={styles.brandContainer}>
        <Typography variant="h1" style={styles.brandText}>
          serv<Typography variant="h1" color="#2BA89D" style={styles.brandAccent}>vo</Typography>
        </Typography>
      </View>

      {/* Tagline */}
      <Typography variant="body" color={tokens.colors.textSecondary} style={styles.tagline}>
        Better Service Starts at Home
      </Typography>

      {/* Feature list */}
      <View style={styles.featureList}>
        {FEATURES.map((feature) => (
          <View key={feature.title} style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: '#2BA89D' }]} />
            <View style={styles.featureContent}>
              <Typography variant="body" style={styles.featureTitle}>
                {feature.title}
              </Typography>
              <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 16,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  brandText: {
    letterSpacing: -0.5,
  },
  brandAccent: {
    letterSpacing: -0.5,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 36,
  },
  featureList: {
    gap: 18,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 7,
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
