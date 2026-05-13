/**
 * ProfileScreen — User info, property details, and navigation links.
 * Links to: Notification Preferences, Payment Methods, Help & Support, About.
 * Log Out button at bottom clears auth store.
 *
 * Validates: Requirements 9.1
 */

import React, { useCallback } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography, Card } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

interface ProfileScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  tokens: ReturnType<typeof import('@/theme/BrandThemeProvider').useTheme>['tokens'];
}

function MenuItem({ icon, label, onPress, tokens }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.menuItem, { borderBottomColor: tokens.colors.border }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.menuItemLeft}>
        <Feather
          name={icon as any}
          size={20}
          color={tokens.colors.textSecondary}
        />
        <Typography variant="body" style={styles.menuItemLabel}>
          {label}
        </Typography>
      </View>
      <Feather name="chevron-right" size={20} color={tokens.colors.textMuted} />
    </Pressable>
  );
}

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { tokens } = useTheme();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = useCallback(() => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => clearAuth(),
      },
    ]);
  }, [clearAuth]);

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
          <Typography variant="h1">Profile</Typography>
        </View>

        {/* User Info */}
        <Card style={styles.section}>
          <View style={styles.avatarRow}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: tokens.colors.primary + '20' },
              ]}
            >
              <Feather name="user" size={28} color={tokens.colors.primary} />
            </View>
            <View style={styles.userInfo}>
              <Typography variant="h3">
                {user?.name || 'User'}
              </Typography>
              {user?.phone && (
                <Typography
                  variant="bodySmall"
                  color={tokens.colors.textSecondary}
                >
                  {user.phone}
                </Typography>
              )}
              {user?.email && (
                <Typography
                  variant="bodySmall"
                  color={tokens.colors.textSecondary}
                >
                  {user.email}
                </Typography>
              )}
            </View>
          </View>
        </Card>

        {/* Property Details */}
        <Card style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Property
          </Typography>
          <View style={styles.propertyRow}>
            <Feather name="home" size={16} color={tokens.colors.accent} />
            <Typography
              variant="body"
              color={tokens.colors.textSecondary}
              style={styles.propertyText}
            >
              Manage your property details in settings
            </Typography>
          </View>
        </Card>

        {/* Menu Links */}
        <Card style={styles.section}>
          <MenuItem
            icon="bell"
            label="Notification Preferences"
            onPress={() => navigation.navigate('NotificationPrefs')}
            tokens={tokens}
          />
          <MenuItem
            icon="credit-card"
            label="Billing"
            onPress={() => navigation.navigate('BillingHome')}
            tokens={tokens}
          />
          <MenuItem
            icon="help-circle"
            label="Help & Support"
            onPress={() => {}}
            tokens={tokens}
          />
          <MenuItem
            icon="info"
            label="About"
            onPress={() => {}}
            tokens={tokens}
          />
        </Card>

        {/* Log Out */}
        <Pressable
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: tokens.colors.error }]}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Feather name="log-out" size={18} color={tokens.colors.error} />
          <Typography
            variant="body"
            color={tokens.colors.error}
            style={styles.logoutText}
          >
            Log Out
          </Typography>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  section: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyText: {
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    marginLeft: 8,
  },
});
