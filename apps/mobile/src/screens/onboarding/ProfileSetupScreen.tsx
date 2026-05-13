/**
 * ProfileSetupScreen — Collects the user's name and optional email
 * during onboarding.
 *
 * Validates: Requirements 2.1, 2.2
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Button, Input, Typography } from '@/components/ui';

export interface ProfileSetupData {
  name: string;
  email?: string;
}

export interface ProfileSetupScreenProps {
  onContinue: (data: ProfileSetupData) => void;
}

export function ProfileSetupScreen({ onContinue }: ProfileSetupScreenProps) {
  const { tokens } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  const handleNameChange = useCallback(
    (text: string) => {
      setName(text);
      if (nameError) setNameError(undefined);
    },
    [nameError],
  );

  const handleContinue = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Full name is required.');
      return;
    }

    const data: ProfileSetupData = { name: trimmedName };
    const trimmedEmail = email.trim();
    if (trimmedEmail) {
      data.email = trimmedEmail;
    }

    onContinue(data);
  }, [name, email, onContinue]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: tokens.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <Typography variant="h2" style={styles.header}>
            Tell us about you
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body"
            color={tokens.colors.textSecondary}
            style={styles.subtitle}
          >
            We'll use this to personalize your experience.
          </Typography>

          {/* Name input */}
          <Input
            label="Full Name"
            value={name}
            onChangeText={handleNameChange}
            placeholder="John Smith"
            error={nameError}
          />

          {/* Email input */}
          <Input
            label="Email (optional)"
            value={email}
            onChangeText={setEmail}
            placeholder="john@example.com"
            keyboardType="email-address"
          />

          {/* Continue button */}
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            disabled={name.trim().length === 0}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  continueButton: {
    marginTop: 16,
  },
});
