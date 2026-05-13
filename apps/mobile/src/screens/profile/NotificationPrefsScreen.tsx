/**
 * NotificationPrefsScreen — Toggle switches for notification preferences.
 * Manages: status changes, new messages, invoice reminders,
 * review requests, appointment confirmations.
 *
 * Validates: Requirements 8.1
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography, Card } from '@/components/ui';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from '@/services/notifications.service';

interface PreferenceItem {
  key: keyof Omit<NotificationPreferences, 'id' | 'user_id' | 'updated_at'>;
  label: string;
  description: string;
}

const PREFERENCE_ITEMS: PreferenceItem[] = [
  {
    key: 'status_changes',
    label: 'Status Changes',
    description: 'When your service status is updated',
  },
  {
    key: 'new_messages',
    label: 'New Messages',
    description: 'When you receive a new message',
  },
  {
    key: 'invoice_reminders',
    label: 'Invoice Reminders',
    description: 'Reminders about pending invoices',
  },
  {
    key: 'review_requests',
    label: 'Review Requests',
    description: 'Requests to review completed services',
  },
  {
    key: 'appointment_confirmations',
    label: 'Appointment Confirmations',
    description: 'Confirmations for scheduled appointments',
  },
];

export function NotificationPrefsScreen() {
  const { tokens } = useTheme();
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getNotificationPreferences()
      .then(setPrefs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = useCallback(
    async (key: PreferenceItem['key'], value: boolean) => {
      if (!prefs) return;

      // Optimistic update
      setPrefs({ ...prefs, [key]: value });

      try {
        const updated = await updateNotificationPreferences({ [key]: value });
        setPrefs(updated);
      } catch {
        // Revert on failure
        setPrefs({ ...prefs, [key]: !value });
      }
    },
    [prefs],
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { backgroundColor: tokens.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={tokens.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: tokens.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h1">Notifications</Typography>
        <Typography
          variant="body"
          color={tokens.colors.textSecondary}
          style={styles.subtitle}
        >
          Choose what notifications you'd like to receive
        </Typography>
      </View>

      {/* Preference Toggles */}
      <Card style={styles.card}>
        {PREFERENCE_ITEMS.map((item, index) => (
          <View
            key={item.key}
            style={[
              styles.prefItem,
              index < PREFERENCE_ITEMS.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: tokens.colors.border,
              },
            ]}
          >
            <View style={styles.prefText}>
              <Typography variant="body">{item.label}</Typography>
              <Typography
                variant="bodySmall"
                color={tokens.colors.textSecondary}
              >
                {item.description}
              </Typography>
            </View>
            <Switch
              value={prefs?.[item.key] ?? true}
              onValueChange={(value) => handleToggle(item.key, value)}
              trackColor={{
                false: tokens.colors.border,
                true: tokens.colors.accent,
              }}
              thumbColor="#FFFFFF"
              accessibilityLabel={item.label}
            />
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  subtitle: {
    marginTop: 8,
  },
  card: {
    marginHorizontal: 24,
  },
  prefItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  prefText: {
    flex: 1,
    marginRight: 16,
  },
});
