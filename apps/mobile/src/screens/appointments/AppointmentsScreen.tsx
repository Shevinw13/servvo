/**
 * AppointmentsScreen — Displays appointments in Upcoming/Past tabs.
 * Uses pull-to-refresh and shows empty state when no appointments exist.
 *
 * Validates: Requirements 5.1
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography } from '@/components/ui';
import { AppointmentCard } from '@/components/appointments';
import {
  getAppointments,
  type Appointment,
} from '@/services/appointments.service';
import type { AppointmentsListScreenNavigationProps } from '@/navigation/types';

type TabFilter = 'upcoming' | 'past';

export function AppointmentsScreen({
  navigation,
}: AppointmentsListScreenNavigationProps) {
  const { tokens } = useTheme();
  const [activeTab, setActiveTab] = useState<TabFilter>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = useCallback(async (filter: TabFilter) => {
    try {
      const response = await getAppointments(filter);
      setAppointments(response.data);
    } catch {
      // Silently handle errors — show empty state
      setAppointments([]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAppointments(activeTab).finally(() => setLoading(false));
  }, [activeTab, fetchAppointments]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAppointments(activeTab);
    setRefreshing(false);
  }, [activeTab, fetchAppointments]);

  const handleAppointmentPress = useCallback(
    (appointment: Appointment) => {
      navigation.navigate('AppointmentDetail', {
        appointmentId: appointment.id,
      });
    },
    [navigation],
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Typography variant="h3" style={styles.emptyTitle}>
        {activeTab === 'upcoming'
          ? 'No upcoming appointments'
          : 'No past appointments'}
      </Typography>
      <Typography
        variant="body"
        color={tokens.colors.textSecondary}
        style={styles.emptySubtitle}
      >
        {activeTab === 'upcoming'
          ? 'Your scheduled services will appear here'
          : 'Your completed services will appear here'}
      </Typography>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: tokens.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h1">Appointments</Typography>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => setActiveTab('upcoming')}
          style={[
            styles.tab,
            activeTab === 'upcoming' && {
              borderBottomColor: tokens.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'upcoming' }}
        >
          <Typography
            variant="body"
            color={
              activeTab === 'upcoming'
                ? tokens.colors.primary
                : tokens.colors.textMuted
            }
            style={styles.tabText}
          >
            Upcoming
          </Typography>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('past')}
          style={[
            styles.tab,
            activeTab === 'past' && {
              borderBottomColor: tokens.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'past' }}
        >
          <Typography
            variant="body"
            color={
              activeTab === 'past'
                ? tokens.colors.primary
                : tokens.colors.textMuted
            }
            style={styles.tabText}
          >
            Past
          </Typography>
        </Pressable>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onPress={handleAppointmentPress}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={tokens.colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});
