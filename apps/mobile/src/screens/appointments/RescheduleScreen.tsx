/**
 * RescheduleScreen — Allows the homeowner to pick a new date and time window
 * for an existing appointment and submit the reschedule request.
 *
 * Validates: Requirements 5.3, 5.5
 */

import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography, Card, Button, Input } from '@/components/ui';
import { rescheduleAppointment } from '@/services/appointments.service';
import type { RescheduleScreenNavigationProps } from '@/navigation/types';

const TIME_WINDOWS = [
  { label: '8:00 AM – 10:00 AM', start: '08:00', end: '10:00' },
  { label: '10:00 AM – 12:00 PM', start: '10:00', end: '12:00' },
  { label: '12:00 PM – 2:00 PM', start: '12:00', end: '14:00' },
  { label: '2:00 PM – 4:00 PM', start: '14:00', end: '16:00' },
  { label: '4:00 PM – 6:00 PM', start: '16:00', end: '18:00' },
];

export function RescheduleScreen({
  route,
  navigation,
}: RescheduleScreenNavigationProps) {
  const { tokens } = useTheme();
  const { appointmentId } = route.params;

  const [date, setDate] = useState('');
  const [selectedWindow, setSelectedWindow] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dateError, setDateError] = useState('');

  const validateDate = (value: string): boolean => {
    // Basic YYYY-MM-DD format validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      setDateError('Please enter a date in YYYY-MM-DD format');
      return false;
    }
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      setDateError('Please enter a valid date');
      return false;
    }
    if (parsed < new Date()) {
      setDateError('Please select a future date');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleConfirmReschedule = useCallback(async () => {
    if (!validateDate(date)) return;
    if (selectedWindow === null) {
      Alert.alert('Select Time', 'Please select a time window.');
      return;
    }

    const window = TIME_WINDOWS[selectedWindow];
    const arrivalWindowStart = `${date}T${window.start}:00.000Z`;
    const arrivalWindowEnd = `${date}T${window.end}:00.000Z`;

    setSubmitting(true);
    try {
      await rescheduleAppointment(appointmentId, {
        date,
        arrivalWindowStart,
        arrivalWindowEnd,
      });
      Alert.alert(
        'Rescheduled',
        'Your appointment has been successfully rescheduled.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch {
      Alert.alert(
        'Error',
        'Failed to reschedule appointment. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }, [date, selectedWindow, appointmentId, navigation]);

  const isFormValid = date.length > 0 && selectedWindow !== null && !dateError;

  return (
    <View
      style={[styles.container, { backgroundColor: tokens.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h1">Reschedule</Typography>
          <Typography
            variant="body"
            color={tokens.colors.textSecondary}
            style={styles.subtitle}
          >
            Pick a new date and time for your appointment
          </Typography>
        </View>

        {/* Date Input */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Select Date
          </Typography>
          <Input
            label="Date"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={(text) => {
              setDate(text);
              if (dateError) validateDate(text);
            }}
            error={dateError}
            keyboardType="numbers-and-punctuation"
          />
        </Card>

        {/* Time Window Selection */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Select Time Window
          </Typography>
          {TIME_WINDOWS.map((window, index) => (
            <TimeWindowOption
              key={index}
              label={window.label}
              selected={selectedWindow === index}
              onPress={() => setSelectedWindow(index)}
              tokens={tokens}
            />
          ))}
        </Card>
      </ScrollView>

      {/* Confirm Button */}
      <View
        style={[styles.footer, { borderTopColor: tokens.colors.border }]}
      >
        <Button
          title="Confirm Reschedule"
          onPress={handleConfirmReschedule}
          disabled={!isFormValid}
          loading={submitting}
        />
      </View>
    </View>
  );
}

interface TimeWindowOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  tokens: ReturnType<typeof import('@/theme/BrandThemeProvider').useTheme>['tokens'];
}

import { Pressable } from 'react-native';

function TimeWindowOption({
  label,
  selected,
  onPress,
  tokens,
}: TimeWindowOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.timeOption,
        {
          borderColor: selected ? tokens.colors.primary : tokens.colors.border,
          backgroundColor: selected
            ? tokens.colors.primary + '10'
            : tokens.colors.surface,
        },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View
        style={[
          styles.radio,
          {
            borderColor: selected
              ? tokens.colors.primary
              : tokens.colors.textMuted,
          },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.radioInner,
              { backgroundColor: tokens.colors.primary },
            ]}
          />
        )}
      </View>
      <Typography
        variant="body"
        color={selected ? tokens.colors.primary : tokens.colors.text}
      >
        {label}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 8,
  },
  section: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
});
