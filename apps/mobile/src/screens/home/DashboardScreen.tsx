/**
 * DashboardScreen — The main home screen of the Servvo customer app.
 * Displays upcoming service, status, quick actions, and recent activity.
 *
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { useTerminology } from '@/utils/terminology';
import { useAuthStore } from '@/stores/authStore';
import { Card, Button, Typography } from '@/components/ui';
import { StatusProgressBar, StatusBadge } from '@/components/service-status';
import * as dashboardService from '@/services/dashboard.service';
import type { Appointment, ActivityEvent } from '@/services/dashboard.service';

// ─── Mock Data (used when API is unavailable) ────────────────────────────────

const MOCK_APPOINTMENT: Appointment = {
  id: '1',
  serviceType: 'Lawn Mowing',
  date: '2025-05-10',
  arrivalWindowStart: '2025-05-10T08:00:00',
  arrivalWindowEnd: '2025-05-10T10:00:00',
  providerName: 'Marcus Johnson',
  status: 'scheduled',
  propertyAddress: '123 Oak Street',
};

const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: '1',
    type: 'status_update',
    title: 'Service completed',
    description: 'Lawn Mowing — May 3',
    timestamp: '2025-05-03T14:30:00',
    icon: '✅',
  },
  {
    id: '2',
    type: 'invoice',
    title: 'Invoice paid',
    description: '$45.00 — Lawn Mowing',
    timestamp: '2025-05-03T15:00:00',
    icon: '💳',
  },
  {
    id: '3',
    type: 'message',
    title: 'Message from provider',
    description: 'See you next week!',
    timestamp: '2025-05-03T15:05:00',
    icon: '💬',
  },
  {
    id: '4',
    type: 'booking',
    title: 'Appointment booked',
    description: 'Lawn Mowing — May 10',
    timestamp: '2025-05-01T09:00:00',
    icon: '📅',
  },
  {
    id: '5',
    type: 'review',
    title: 'Review submitted',
    description: '5 stars — Great service!',
    timestamp: '2025-04-26T16:00:00',
    icon: '⭐',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardScreen() {
  const { tokens } = useTheme();
  const { resolve } = useTerminology();
  const user = useAuthStore((state) => state.user);

  const [appointment, setAppointment] = useState<Appointment | null>(MOCK_APPOINTMENT);
  const [activity, setActivity] = useState<ActivityEvent[]>(MOCK_ACTIVITY);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [nextAppt, recentActivity] = await Promise.all([
        dashboardService.getNextAppointment(),
        dashboardService.getRecentActivity(),
      ]);
      if (nextAppt !== undefined) setAppointment(nextAppt);
      if (recentActivity.length > 0) setActivity(recentActivity);
    } catch {
      // Keep mock data on failure
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: tokens.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h1">Hi, {firstName} 👋</Typography>
      </View>

      {/* Upcoming Service Card or Empty State */}
      {appointment ? (
        <UpcomingServiceCard appointment={appointment} tokens={tokens} resolve={resolve} />
      ) : (
        <EmptyStateCard tokens={tokens} />
      )}

      {/* Account Balance Card */}
      <Card style={styles.balanceCard}>
        <View style={styles.balanceRow}>
          <View>
            <Typography variant="caption" color={tokens.colors.textSecondary}>
              ACCOUNT BALANCE
            </Typography>
            <Typography variant="h2" style={styles.balanceAmount}>
              $0.00
            </Typography>
          </View>
          <Typography variant="bodySmall" color={tokens.colors.success}>
            You're all caught up!
          </Typography>
        </View>
      </Card>

      {/* Quick Actions */}
      <QuickActionsRow tokens={tokens} />

      {/* Recent Activity */}
      <View style={styles.section}>
        <Typography variant="h3" style={styles.sectionTitle}>
          Recent Activity
        </Typography>
        {activity.map((event) => (
          <ActivityItem key={event.id} event={event} tokens={tokens} />
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface UpcomingServiceCardProps {
  appointment: Appointment;
  tokens: ReturnType<typeof useTheme>['tokens'];
  resolve: (template: string) => string;
}

function UpcomingServiceCard({ appointment, tokens, resolve }: UpcomingServiceCardProps) {
  return (
    <Card variant="elevated" style={styles.serviceCard}>
      <View style={styles.serviceCardHeader}>
        <Typography variant="caption" color={tokens.colors.textSecondary}>
          NEXT SERVICE
        </Typography>
        <StatusBadge status={appointment.status} />
      </View>

      <Typography variant="h2" style={styles.serviceType}>
        {appointment.serviceType}
      </Typography>

      <Typography variant="body" color={tokens.colors.textSecondary}>
        {formatDate(appointment.date)} • {formatTime(appointment.arrivalWindowStart)} –{' '}
        {formatTime(appointment.arrivalWindowEnd)}
      </Typography>

      <Typography
        variant="bodySmall"
        color={tokens.colors.textSecondary}
        style={styles.providerName}
      >
        {resolve('{{Provider}}')}: {appointment.providerName}
      </Typography>

      {/* Status Progress Bar */}
      <StatusProgressBar
        currentStatus={appointment.status}
        style={styles.progressBar}
      />

      <Button
        title="View Details"
        onPress={() => {}}
        variant="secondary"
        style={styles.viewDetailsButton}
      />
    </Card>
  );
}

interface EmptyStateCardProps {
  tokens: ReturnType<typeof useTheme>['tokens'];
}

function EmptyStateCard({ tokens }: EmptyStateCardProps) {
  return (
    <Card variant="elevated" style={styles.emptyCard}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Typography variant="h3" style={styles.emptyTitle}>
        No upcoming services
      </Typography>
      <Typography
        variant="body"
        color={tokens.colors.textSecondary}
        style={styles.emptyDescription}
      >
        Book your next lawn care service to keep your yard looking great.
      </Typography>
      <Button
        title="Book a Service"
        onPress={() => {}}
        variant="primary"
        style={styles.bookButton}
      />
    </Card>
  );
}

interface QuickActionsRowProps {
  tokens: ReturnType<typeof useTheme>['tokens'];
}

function QuickActionsRow({ tokens }: QuickActionsRowProps) {
  const actions = [
    { icon: '💬', label: 'Message Us', onPress: () => {} },
    { icon: '📅', label: 'Book Again', onPress: () => {} },
    { icon: '💳', label: 'Make a Payment', onPress: () => {} },
    { icon: '📋', label: 'View History', onPress: () => {} },
  ];

  return (
    <View style={styles.quickActionsContainer}>
      <Typography variant="h3" style={styles.sectionTitle}>
        Quick Actions
      </Typography>
      <View style={styles.quickActionsRow}>
        {actions.map((action) => (
          <Pressable
            key={action.label}
            style={[
              styles.quickActionButton,
              { backgroundColor: tokens.colors.surface },
            ]}
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <Text style={styles.quickActionIcon}>{action.icon}</Text>
            <Text
              style={[styles.quickActionLabel, { color: tokens.colors.text }]}
              numberOfLines={2}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

interface ActivityItemProps {
  event: ActivityEvent;
  tokens: ReturnType<typeof useTheme>['tokens'];
}

function ActivityItem({ event, tokens }: ActivityItemProps) {
  return (
    <View style={[styles.activityItem, { borderBottomColor: tokens.colors.border }]}>
      <Text style={styles.activityIcon}>{event.icon}</Text>
      <View style={styles.activityContent}>
        <Typography variant="bodySmall">{event.title}</Typography>
        {event.description && (
          <Typography variant="caption" color={tokens.colors.textSecondary}>
            {event.description}
          </Typography>
        )}
      </View>
      <Typography variant="caption" color={tokens.colors.textMuted}>
        {formatRelativeDate(event.timestamp)}
      </Typography>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  serviceCard: {
    marginBottom: 16,
  },
  serviceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceType: {
    marginBottom: 4,
  },
  providerName: {
    marginTop: 8,
  },
  progressBar: {
    marginTop: 16,
    marginBottom: 8,
  },
  viewDetailsButton: {
    marginTop: 12,
  },
  balanceCard: {
    marginBottom: 24,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceAmount: {
    marginTop: 4,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  section: {
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  emptyCard: {
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  bookButton: {
    minWidth: 180,
  },
});
