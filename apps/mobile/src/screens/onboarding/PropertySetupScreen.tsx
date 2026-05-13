/**
 * PropertySetupScreen — Collects the user's property address
 * during onboarding.
 *
 * Validates: Requirements 2.3, 2.5
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

export interface PropertySetupData {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface PropertySetupScreenProps {
  onContinue: (data: PropertySetupData) => void;
}

interface FieldErrors {
  address_line1?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export function PropertySetupScreen({ onContinue }: PropertySetupScreenProps) {
  const { tokens } = useTheme();
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const clearError = useCallback(
    (field: keyof FieldErrors) => {
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const validate = useCallback((): boolean => {
    const newErrors: FieldErrors = {};

    if (!addressLine1.trim()) {
      newErrors.address_line1 = 'Address is required.';
    }
    if (!city.trim()) {
      newErrors.city = 'City is required.';
    }
    if (!state.trim()) {
      newErrors.state = 'State is required.';
    }
    if (!zip.trim()) {
      newErrors.zip = 'ZIP code is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [addressLine1, city, state, zip]);

  const handleContinue = useCallback(() => {
    if (!validate()) return;

    const data: PropertySetupData = {
      address_line1: addressLine1.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
    };

    const trimmedLine2 = addressLine2.trim();
    if (trimmedLine2) {
      data.address_line2 = trimmedLine2;
    }

    onContinue(data);
  }, [addressLine1, addressLine2, city, state, zip, validate, onContinue]);

  const isFormEmpty =
    !addressLine1.trim() && !city.trim() && !state.trim() && !zip.trim();

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
            Your property
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body"
            color={tokens.colors.textSecondary}
            style={styles.subtitle}
          >
            Where should we provide service?
          </Typography>

          {/* Address Line 1 */}
          <Input
            label="Address Line 1"
            value={addressLine1}
            onChangeText={(text) => {
              setAddressLine1(text);
              clearError('address_line1');
            }}
            placeholder="123 Main Street"
            error={errors.address_line1}
          />

          {/* Address Line 2 */}
          <Input
            label="Address Line 2 (optional)"
            value={addressLine2}
            onChangeText={setAddressLine2}
            placeholder="Apt, Suite, Unit"
          />

          {/* City */}
          <Input
            label="City"
            value={city}
            onChangeText={(text) => {
              setCity(text);
              clearError('city');
            }}
            placeholder="Nashville"
            error={errors.city}
          />

          {/* State and ZIP row */}
          <View style={styles.row}>
            <View style={styles.stateField}>
              <Input
                label="State"
                value={state}
                onChangeText={(text) => {
                  setState(text);
                  clearError('state');
                }}
                placeholder="TN"
                error={errors.state}
              />
            </View>
            <View style={styles.zipField}>
              <Input
                label="ZIP"
                value={zip}
                onChangeText={(text) => {
                  setZip(text);
                  clearError('zip');
                }}
                placeholder="37201"
                keyboardType="number-pad"
                error={errors.zip}
              />
            </View>
          </View>

          {/* Continue button */}
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            disabled={isFormEmpty}
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  stateField: {
    flex: 1,
  },
  zipField: {
    flex: 1,
  },
  continueButton: {
    marginTop: 16,
  },
});
