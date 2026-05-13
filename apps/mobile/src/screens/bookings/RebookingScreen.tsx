/**
 * RebookingScreen — Book a new service with service type, date, and time selection.
 * Pre-populates service type if rebooking from a past service.
 *
 * Validates: Requirements 7.2
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography, Card, Button } from '@/components/ui';
import {
  getAvailableDates,
  getAvailableWindows,
  createBooking,
  type AvailableDate,
  type TimeWindow,
} from '@/services/bookings.service';

const SERVICE_TYPES = [
  'Lawn Mowing',
  'Landscaping',
  'Fertilization',
  'Aeration',
  'Leaf Removal',
  'Snow Removal',
];

interface RebookingScreenProps {
  route: { params?: { serviceType?: string } };
  navigation: { goBack: () => void };
}

export function RebookingScreen({ route, navigation }: RebookingScreenProps) {
  const { tokens } = useTheme();
  const preSelectedService = route.params?.serviceType;

  const [selectedService, setSelectedService] = useState(
    preSelectedService || '',
  );
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeWindows, setTimeWindows] = useState<TimeWindow[]>([]);
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingWindows, setLoadingWindows] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLoadingDates(true);
    getAvailableDates()
      .then((dates) => setAvailableDates(dates.filter((d) => d.available)))
      .catch(() => setAvailableDates([]))
      .finally(() => setLoadingDates(false));
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingWindows(true);
    setSelectedWindow(null);
    getAvailableWindows(selectedDate)
      .then((windows) => setTimeWindows(windows.filter((w) => w.available)))
      .catch(() => setTimeWindows([]))
      .finally(() => setLoadingWindows(false));
  }, [selectedDate]);

  const handleConfirm = useCallback(async () => {
    const window = timeWindows.find((w) => w.id === selectedWindow);
    if (!window) return;

    setSubmitting(true);
    try {
      await createBooking({
        serviceType: selectedService,
        date: selectedDate,
        windowStart: window.start,
        windowEnd: window.end,
      });
      setSubmitted(true);
    } catch {
      // Could show error toast
    } finally {
      setSubmitting(false);
    }
  }, [selectedService, selectedDate, selectedWindow, timeWindows]);

  const isFormValid =
    selectedService.length > 0 &&
    selectedDate.length > 0 &&
    selectedWindow !== null;

  if (submitted) {
    return (
      <View
        style={[
          styles.container,
          styles.centeredContainer,
          { backgroundColor: tokens.colors.background },
        ]}
      >
        <Feather name="check-circle" size={64} color={tokens.colors.success} />
        <Typography variant="h2" style={styles.successTitle}>
          Booking Confirmed!
        </Typography>
        <Typography
          variant="body"
          color={tokens.colors.textSecondary}
          style={styles.successSubtitle}
        >
          Your service has been scheduled. You'll receive a confirmation shortly.
        </Typography>
        <Button
          title="Done"
          onPress={() => navigation.goBack()}
          style={styles.doneButton}
        />
      </View>
    );
  }

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
          <Typography variant="h1">Book a Service</Typography>
          <Typography
            variant="body"
            color={tokens.colors.textSecondary}
            style={styles.subtitle}
          >
            Select your service, date, and time
          </Typography>
        </View>

        {/* Service Type Selection */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Service Type
          </Typography>
          <View style={styles.serviceGrid}>
            {SERVICE_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => setSelectedService(type)}
                style={[
                  styles.serviceChip,
                  {
                    backgroundColor:
                      selectedService === type
                        ? tokens.colors.primary
                        : tokens.colors.surface,
                    borderColor:
                      selectedService === type
                        ? tokens.colors.primary
                        : tokens.colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedService === type }}
              >
                <Typography
                  variant="bodySmall"
                  color={
                    selectedService === type
                      ? '#FFFFFF'
                      : tokens.colors.text
                  }
                >
                  {type}
                </Typography>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Date Selection */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Select Date
          </Typography>
          {loadingDates ? (
            <ActivityIndicator color={tokens.colors.primary} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateScroll}
            >
              {availableDates.slice(0, 14).map((d) => {
                const dateObj = new Date(d.date + 'T12:00:00');
                const dayNum = dateObj.getDate();
                const dayName = dateObj.toLocaleDateString('en-US', {
                  weekday: 'short',
                });
                const isSelected = selectedDate === d.date;

                return (
                  <Pressable
                    key={d.date}
                    onPress={() => setSelectedDate(d.date)}
                    style={[
                      styles.dateItem,
                      {
                        backgroundColor: isSelected
                          ? tokens.colors.primary
                          : tokens.colors.surface,
                        borderColor: isSelected
                          ? tokens.colors.primary
                          : tokens.colors.border,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Typography
                      variant="caption"
                      color={
                        isSelected ? '#FFFFFF' : tokens.colors.textMuted
                      }
                    >
                      {dayName}
                    </Typography>
                    <Typography
                      variant="h3"
                      color={
                        isSelected ? '#FFFFFF' : tokens.colors.text
                      }
                    >
                      {dayNum}
                    </Typography>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </Card>

        {/* Time Window Selection */}
        {selectedDate && (
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Select Time
            </Typography>
            {loadingWindows ? (
              <ActivityIndicator color={tokens.colors.primary} />
            ) : (
              timeWindows.map((window) => {
                const isSelected = selectedWindow === window.id;
                return (
                  <Pressable
                    key={window.id}
                    onPress={() => setSelectedWindow(window.id)}
                    style={[
                      styles.timeOption,
                      {
                        borderColor: isSelected
                          ? tokens.colors.primary
                          : tokens.colors.border,
                        backgroundColor: isSelected
                          ? tokens.colors.primary + '10'
                          : tokens.colors.surface,
                      },
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View
                      style={[
                        styles.radio,
                        {
                          borderColor: isSelected
                            ? tokens.colors.primary
                            : tokens.colors.textMuted,
                        },
                      ]}
                    >
                      {isSelected && (
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
                      color={
                        isSelected ? tokens.colors.primary : tokens.colors.text
                      }
                    >
                      {window.label}
                    </Typography>
                  </Pressable>
                );
              })
            )}
          </Card>
        )}
      </ScrollView>

      {/* Confirm Button */}
      <View style={[styles.footer, { borderTopColor: tokens.colors.border }]}>
        <Button
          title="Confirm Booking"
          onPress={handleConfirm}
          disabled={!isFormValid}
          loading={submitting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  dateScroll: {
    gap: 8,
  },
  dateItem: {
    width: 56,
    height: 72,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
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
  successTitle: {
    marginTop: 24,
    textAlign: 'center',
  },
  successSubtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  doneButton: {
    marginTop: 32,
    width: '100%',
  },
});
