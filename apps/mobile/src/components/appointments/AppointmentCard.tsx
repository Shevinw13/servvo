/**
 * AppointmentCard — Pressable card displaying appointment summary.
 * Shows service type, date, time window, provider name, and status badge.
 * Navigates to appointment detail on tap.
 *
 * Validates: Requirements 5.1, 5.2
 */

import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, Typography } from '@/components/ui';
import { StatusBadge } from '@/components/service-status';
import { useTheme } from '@/theme/BrandThemeProvider';
import { useTerminology } from '@/utils/terminology';
import type { Appointment } from '@/services/appointments.service';

export interface AppointmentCardProps {
  appointment: Appointment;
  onPress: (appointment: Appointment) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
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

export function AppointmentCard({ appointment, onPress }: AppointmentCardProps) {
  const { tokens } = useTheme();
  const { resolve } = useTerminology();

  return (
    <Pressable
      onPress={() => onPress(appointment)}
      accessibilityRole="button"
      accessibilityLabel={`${appointment.serviceType} on ${formatDate(appointment.date)}`}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Typography variant="h3" style={styles.serviceType}>
            {appointment.serviceType}
          </Typography>
          <StatusBadge status={appointment.status} />
        </View>

        <View style={styles.details}>
          <View style={styles.row}>
            <Feather name="calendar" size={13} color={tokens.colors.textSecondary} style={{ marginRight: 6 }} />
            <Typography
              variant="bodySmall"
              color={tokens.colors.textSecondary}
            >
              {formatDate(appointment.date)}
            </Typography>
          </View>

          <View style={styles.row}>
            <Feather name="clock" size={13} color={tokens.colors.textSecondary} style={{ marginRight: 6 }} />
            <Typography
              variant="bodySmall"
              color={tokens.colors.textSecondary}
            >
              {formatTimeWindow(appointment.arrivalWindowStart, appointment.arrivalWindowEnd)}
            </Typography>
          </View>

          <View style={styles.row}>
            <Feather name="user" size={13} color={tokens.colors.textSecondary} style={{ marginRight: 6 }} />
            <Typography
              variant="bodySmall"
              color={tokens.colors.textSecondary}
            >
              {resolve('{{Provider}}')}: {appointment.providerName}
            </Typography>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceType: {
    flex: 1,
    marginRight: 8,
  },
  details: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
