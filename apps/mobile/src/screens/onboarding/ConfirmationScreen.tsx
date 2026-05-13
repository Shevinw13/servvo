/**
 * ConfirmationScreen — Success state shown after onboarding is complete.
 * Displays a green checkmark and welcome message.
 *
 * Validates: Requirements 2.1, 2.5
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Button, Typography } from '@/components/ui';

export interface ConfirmationScreenProps {
  businessName?: string;
  onGoToDashboard: () => void;
}

export function ConfirmationScreen({
  businessName = 'Servvo',
  onGoToDashboard,
}: ConfirmationScreenProps) {
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <View style={styles.content}>
        {/* Green checkmark circle */}
        <View
          style={[
            styles.checkmarkCircle,
            { backgroundColor: tokens.colors.success },
          ]}
        >
          <Typography variant="h1" color="#FFFFFF" style={styles.checkmarkIcon}>
            ✓
          </Typography>
        </View>

        {/* Header */}
        <Typography variant="h2" style={styles.header}>
          You're all set!
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body"
          color={tokens.colors.textSecondary}
          style={styles.subtitle}
        >
          Welcome to {businessName}. We're excited to keep your lawn looking its
          best.
        </Typography>

        {/* Go to Dashboard button */}
        <Button
          title="Go to Dashboard"
          onPress={onGoToDashboard}
          variant="primary"
          style={styles.dashboardButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkmarkIcon: {
    textAlign: 'center',
  },
  header: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  dashboardButton: {
    width: '100%',
  },
});
