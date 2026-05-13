/**
 * PhoneInputScreen — Phone number entry for authentication.
 * Validates the phone number and triggers Firebase phone auth (mocked for now).
 *
 * Validates: Requirements 1.2, 1.3
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Button, Input, Typography } from '@/components/ui';

export interface PhoneInputScreenProps {
  onSendCode: (phoneNumber: string) => void;
  onUseEmail?: () => void;
}

/**
 * Validates that a phone number has at least 10 digits.
 */
function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10;
}

/**
 * Formats a phone number string for display (US format).
 */
function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function PhoneInputScreen({ onSendCode, onUseEmail }: PhoneInputScreenProps) {
  const { tokens } = useTheme();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = useCallback((text: string) => {
    // Allow only digits and common phone characters
    const cleaned = text.replace(/[^0-9+\-() ]/g, '');
    setPhone(cleaned);
    if (error) setError(undefined);
  }, [error]);

  const handleSendCode = useCallback(async () => {
    if (!isValidPhone(phone)) {
      setError('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    setLoading(true);
    try {
      // Mock Firebase phone auth — actual integration in Task 3.3
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSendCode(phone);
    } finally {
      setLoading(false);
    }
  }, [phone, onSendCode]);

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <Typography variant="h2" style={styles.header}>
          Let's verify your phone
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body"
          color={tokens.colors.textSecondary}
          style={styles.subtitle}
        >
          We'll send a code to confirm your number.
        </Typography>

        {/* Phone input */}
        <Input
          label="Phone number"
          value={phone}
          onChangeText={handlePhoneChange}
          placeholder="(615) 555-1234"
          keyboardType="phone-pad"
          error={error}
          style={styles.input}
        />

        {/* Send Code button */}
        <Button
          title="Send Code"
          onPress={handleSendCode}
          variant="primary"
          loading={loading}
          disabled={phone.length === 0}
          style={styles.sendButton}
        />

        {/* Use email instead */}
        <Button
          title="Use email instead"
          onPress={onUseEmail ?? (() => {})}
          variant="ghost"
          style={styles.emailButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  input: {
    marginBottom: 8,
  },
  sendButton: {
    marginTop: 16,
  },
  emailButton: {
    marginTop: 12,
  },
});

export { isValidPhone, formatPhoneDisplay };
