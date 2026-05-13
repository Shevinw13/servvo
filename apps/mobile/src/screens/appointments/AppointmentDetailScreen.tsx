/**
 * AppointmentDetailScreen — Full appointment details with status, notes, and actions.
 * Shows service type, date, time, address, provider, status progress bar,
 * and provides Reschedule/Cancel actions.
 *
 * Validates: Requirements 5.2, 5.4
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { useTerminology } from '@/utils/terminology';
import { Typography, Card, Button } from '@/components/ui';
import { StatusProgressBar } from '@/components/service-status';
import {
  getAppointmentById,
  cancelAppointment,
  type Appointment,
} from '@/services/appointments.service';
import type { AppointmentDetailScreenNavigationProps } from '@/navigation/types';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimeWindow(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  const endTime = endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${startTime} – ${endTime}`;
}

export function AppointmentDetailScreen({
  route,
  navigation,
}: AppointmentDetailScreenNavigationProps) {
  const { tokens } = useTheme();
  const { resolve } = useTerminology();
  const { appointmentId } = route.params;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const data = await getAppointmentById(appointmentId);
        setAppointment(data);
      } catch {
        // Handle error silently — could show error state
      } finally {
        setLoading(false);
      }
    }
    fetchAppointment();
  }, [appointmentId]);

  const handleReschedule = useCallback(() => {
    navigation.navigate('Reschedule', { appointmentId });
  }, [navigation, appointmentId]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? This action cannot be undone.',
      [
        { text: 'Keep Appointment', style: 'cancel' },
        {
          text: 'Cancel Appointment',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await cancelAppointment(appointmentId);
              Alert.alert(
                'Appointment Cancelled',
                'Your appointment has been successfully cancelled.',
                [{ text: 'OK', onPress: () => navigation.goBack() }],
              );
            } catch {
              Alert.alert(
                'Error',
                'Failed to cancel appointment. Please try again.',
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  }, [appointmentId, navigation]);

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: tokens.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={tokens.colors.primary} />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: tokens.colors.background },
        ]}
      >
        <Typography variant="body" color={tokens.colors.textSecondary}>
          Appointment not found
        </Typography>
      </View>
    );
  }

  const isUpcoming = appointment.status !== 'completed';

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
          <Typography variant="h1">{appointment.serviceType}</Typography>
        </View>

        {/* Status Progress */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Service Status
          </Typography>
          <StatusProgressBar currentStatus={appointment.status} />
        </Card>

        {/* Appointment Details */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Details
          </Typography>

          <View style={styles.detailRow}>
            <Typography
              variant="bodySmall"
              color={tokens.colors.textSecondary}
            >
              Date
            </Typography>
            <Typography variant="body">
              {formatDate(appointment.date)}
            </Typography>
          </View>

          <View style={styles.detailRow}>
            <Typography
              variant="bodySmall"
              color={tokens.colors.textSecondary}
            >
              Time Window
            </Typography>
            <Typography variant="body">
              {formatTimeWindow(
                appointment.arrivalWindowStart,
                appointment.arrivalWindowEnd,
              )}
            </Typography>
          </View>

          {appointment.propertyAddress && (
            <View style={styles.detailRow}>
              <Typography
                variant="bodySmall"
                color={tokens.colors.textSecondary}
              >
                Address
              </Typography>
              <Typography variant="body">
                {appointment.propertyAddress}
              </Typography>
            </View>
          )}

          <View style={styles.detailRow}>
            <Typography
              variant="bodySmall"
              color={tokens.colors.textSecondary}
            >
              {resolve('{{Provider}}')}
            </Typography>
            <Typography variant="body">
              {appointment.providerName}
            </Typography>
          </View>
        </Card>

        {/* Provider Notes */}
        {appointment.providerNotes && (
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              {resolve('{{Provider}}')} Notes
            </Typography>
            <Typography
              variant="body"
              color={tokens.colors.textSecondary}
            >
              {appointment.providerNotes}
            </Typography>
          </Card>
        )}

        {/* Before Your Service Notes */}
        {appointment.beforeServiceNotes && (
          <Card style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Before Your Service
            </Typography>
            <Typography
              variant="body"
              color={tokens.colors.textSecondary}
            >
              {appointment.beforeServiceNotes}
            </Typography>
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {isUpcoming && (
        <View
          style={[
            styles.actionBar,
            { borderTopColor: tokens.colors.border },
          ]}
        >
          <Button
            title="Reschedule"
            variant="secondary"
            onPress={handleReschedule}
            style={styles.actionButton}
          />
          <Button
            title="Cancel"
            variant="ghost"
            onPress={handleCancel}
            loading={cancelling}
            style={styles.actionButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  section: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  detailRow: {
    marginBottom: 12,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
