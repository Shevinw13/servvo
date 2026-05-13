/**
 * ServiceHistoryScreen — Chronological list of past services with filtering.
 * Shows date, service type, provider name, and a small photo placeholder.
 * Filter by service type via horizontal chip scroll.
 *
 * Validates: Requirements 5.1
 */

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography, Card } from '@/components/ui';
import {
  getAppointments,
  type Appointment,
} from '@/services/appointments.service';

const ALL_FILTER = 'All';

export function ServiceHistoryScreen() {
  const { tokens } = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(ALL_FILTER);

  const fetchPastAppointments = useCallback(async () => {
    try {
      const response = await getAppointments('past', 1, 50);
      setAppointments(response.data);
    } catch {
      setAppointments([]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPastAppointments().finally(() => setLoading(false));
  }, [fetchPastAppointments]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPastAppointments();
    setRefreshing(false);
  }, [fetchPastAppointments]);

  // Extract unique service types for filter chips
  const serviceTypes = useMemo(() => {
    const types = new Set(appointments.map((a) => a.serviceType));
    return [ALL_FILTER, ...Array.from(types)];
  }, [appointments]);

  // Filter appointments by selected service type
  const filteredAppointments = useMemo(() => {
    if (selectedFilter === ALL_FILTER) return appointments;
    return appointments.filter((a) => a.serviceType === selectedFilter);
  }, [appointments, selectedFilter]);

  const renderItem = useCallback(
    ({ item }: { item: Appointment }) => (
      <ServiceHistoryItem appointment={item} tokens={tokens} />
    ),
    [tokens],
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="clock" size={48} color={tokens.colors.textMuted} />
      <Typography variant="h3" style={styles.emptyTitle}>
        No service history
      </Typography>
      <Typography
        variant="body"
        color={tokens.colors.textSecondary}
        style={styles.emptySubtitle}
      >
        Your completed services will appear here
      </Typography>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: tokens.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h1">Service History</Typography>
      </View>

      {/* Filter Chips */}
      {serviceTypes.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {serviceTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => setSelectedFilter(type)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    selectedFilter === type
                      ? tokens.colors.primary
                      : tokens.colors.surface,
                  borderColor:
                    selectedFilter === type
                      ? tokens.colors.primary
                      : tokens.colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedFilter === type }}
            >
              <Typography
                variant="bodySmall"
                color={
                  selectedFilter === type
                    ? '#FFFFFF'
                    : tokens.colors.text
                }
              >
                {type}
              </Typography>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
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

interface ServiceHistoryItemProps {
  appointment: Appointment;
  tokens: ReturnType<typeof import('@/theme/BrandThemeProvider').useTheme>['tokens'];
}

function ServiceHistoryItem({ appointment, tokens }: ServiceHistoryItemProps) {
  const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card style={styles.itemCard}>
      <View style={styles.itemRow}>
        {/* Photo placeholder */}
        <View
          style={[
            styles.photoPlaceholder,
            { backgroundColor: tokens.colors.accent + '20' },
          ]}
        >
          <Feather name="image" size={20} color={tokens.colors.accent} />
        </View>

        {/* Details */}
        <View style={styles.itemDetails}>
          <Typography variant="h3">{appointment.serviceType}</Typography>
          <Typography
            variant="bodySmall"
            color={tokens.colors.textSecondary}
            style={styles.itemDate}
          >
            {formattedDate}
          </Typography>
          <View style={styles.providerRow}>
            <Feather
              name="user"
              size={12}
              color={tokens.colors.textMuted}
            />
            <Typography
              variant="bodySmall"
              color={tokens.colors.textSecondary}
              style={styles.providerName}
            >
              {appointment.providerName}
            </Typography>
          </View>
        </View>
      </View>
    </Card>
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
  chipContainer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  itemCard: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemDate: {
    marginTop: 2,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  providerName: {
    marginLeft: 4,
  },
});
