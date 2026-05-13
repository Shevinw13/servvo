/**
 * OTPScreen — OTP verification screen with 6-digit code input.
 * Includes a 5-minute countdown timer and resend logic.
 *
 * Validates: Requirements 1.4, 1.5
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Button, Typography } from '@/components/ui';

export interface OTPScreenProps {
  phoneNumber: string;
  onVerify: (code: string) => void;
  onResend: () => void;
}

const OTP_LENGTH = 6;
const TIMER_DURATION_SECONDS = 5 * 60; // 5 minutes

/**
 * Formats seconds into MM:SS display string.
 */
export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats a raw phone number string for display.
 */
function formatPhoneForDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
  return phone;
}

export function OTPScreen({ phoneNumber, onVerify, onResend }: OTPScreenProps) {
  const { tokens } = useTheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (code.length === OTP_LENGTH) {
      handleVerify(code);
    }
  }, [code]);

  const handleCodeChange = useCallback((text: string) => {
    // Only allow digits, max 6
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
    if (error) setError(undefined);
  }, [error]);

  const handleVerify = useCallback((verificationCode: string) => {
    if (verificationCode.length !== OTP_LENGTH) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    onVerify(verificationCode);
  }, [onVerify]);

  const handleResend = useCallback(() => {
    setCanResend(false);
    setTimeRemaining(TIMER_DURATION_SECONDS);
    setCode('');
    setError(undefined);
    onResend();
  }, [onResend]);

  const displayPhone = formatPhoneForDisplay(phoneNumber);

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <Typography variant="h2" style={styles.header}>
          Enter the 6-digit code we sent you
        </Typography>

        {/* Subtitle with phone number */}
        <Typography
          variant="body"
          color={tokens.colors.textSecondary}
          style={styles.subtitle}
        >
          Sent to {displayPhone}
        </Typography>

        {/* OTP Input — single TextInput styled as individual boxes */}
        <Pressable
          style={styles.otpContainer}
          onPress={() => inputRef.current?.focus()}
          accessibilityLabel="OTP code input"
        >
          {Array.from({ length: OTP_LENGTH }).map((_, index) => {
            const digit = code[index] || '';
            const isActive = index === code.length;

            return (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  {
                    borderColor: error
                      ? tokens.colors.error
                      : isActive
                        ? tokens.colors.primary
                        : tokens.colors.border,
                    backgroundColor: tokens.colors.surface,
                    borderRadius: tokens.borderRadius.md,
                  },
                ]}
              >
                <Typography variant="h2" style={styles.otpDigit}>
                  {digit}
                </Typography>
              </View>
            );
          })}
        </Pressable>

        {/* Hidden TextInput for keyboard */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleCodeChange}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          style={styles.hiddenInput}
          autoFocus
          accessibilityLabel="Enter verification code"
        />

        {/* Error message */}
        {error && (
          <Typography
            variant="bodySmall"
            color={tokens.colors.error}
            style={styles.errorText}
          >
            {error}
          </Typography>
        )}

        {/* Timer / Resend */}
        <View style={styles.timerContainer}>
          {canResend ? (
            <Button
              title="Resend Code"
              onPress={handleResend}
              variant="ghost"
            />
          ) : (
            <Typography
              variant="bodySmall"
              color={tokens.colors.textMuted}
              style={styles.timerText}
            >
              Resend code in {formatTimer(timeRemaining)}
            </Typography>
          )}
        </View>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    textAlign: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
  timerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  timerText: {
    textAlign: 'center',
  },
});
