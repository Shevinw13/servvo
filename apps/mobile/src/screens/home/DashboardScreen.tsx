/**
 * DashboardScreen — Matches the reference mockup exactly.
 * Warm cream background, editorial typography, real lawn photo,
 * outlined circular quick actions, referral row with leaf icon.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import { Typography } from '@/components/ui';

export function DashboardScreen() {
  const { tokens } = useTheme();
  const user = useAuthStore((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  const firstName = user?.name?.split(' ')[0] ?? 'Alex';

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: tokens.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with notification bell */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Typography variant="body" color={tokens.colors.textSecondary}>
            Hi, {firstName},
          </Typography>
          <Typography variant="h1" style={styles.headline}>
            Your lawn{'\n'}looks amazing. 🌿
          </Typography>
          <Typography
            variant="body"
            color={tokens.colors.textSecondary}
            style={styles.subheadline}
          >
            We're here whenever you need us.
          </Typography>
        </View>
        <Pressable style={styles.bellButton} accessibilityLabel="Notifications">
          <Feather name="bell" size={22} color={tokens.colors.text} />
        </Pressable>
      </View>

      {/* Next Service Card */}
      <View style={[styles.nextServiceCard, { borderColor: tokens.colors.border }]}>
        <View style={styles.nextServiceRow}>
          <Feather name="calendar" size={16} color={tokens.colors.text} />
          <Typography variant="bodySmall" style={styles.nextServiceLabel}>
            Next Service
          </Typography>
        </View>
        <Typography variant="h3" style={styles.nextServiceDate}>
          Wed, May 22 · 8:00 AM
        </Typography>
        <Typography variant="body" style={styles.nextServiceType}>
          Weekly Lawn Mowing
        </Typography>
        <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
          Front & Back Yard
        </Typography>
      </View>

      {/* Lawn Photo with overlay */}
      <View style={styles.lawnSection}>
        <View style={styles.lawnPhotoWrapper}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80' }}
            style={styles.lawnPhoto}
            resizeMode="cover"
          />
          {/* Badge overlay */}
          <View style={styles.lawnBadgeContainer}>
            <View style={styles.lawnBadge}>
              <Typography variant="caption" color="#FFFFFF">
                Last service — May 15
              </Typography>
            </View>
          </View>
        </View>
        <Typography variant="body" style={styles.lawnStatusTitle}>
          Your lawn is in great shape.
        </Typography>
        <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
          We'll keep it that way.
        </Typography>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Typography variant="h3" style={styles.sectionTitle}>
          Quick Actions
        </Typography>
        <View style={styles.quickActionsRow}>
          <QuickAction icon="file-text" label={'Request\nService'} tokens={tokens} />
          <QuickAction icon="clipboard" label={'View\nPlan'} tokens={tokens} />
          <QuickAction icon="credit-card" label={'Make\nPayment'} tokens={tokens} />
          <QuickAction icon="users" label={'Refer &\nSave'} tokens={tokens} />
        </View>
      </View>

      {/* Refer a neighbor row */}
      <Pressable
        style={[styles.referralRow, { borderColor: tokens.colors.border }]}
        onPress={() => {}}
        accessibilityRole="button"
      >
        <Feather name="heart" size={16} color={tokens.colors.primary} style={styles.referralIcon} />
        <View style={styles.referralContent}>
          <Typography variant="body" style={styles.referralTitle}>
            Refer a neighbor
          </Typography>
          <Typography variant="bodySmall" color={tokens.colors.textSecondary}>
            You both get $25 off
          </Typography>
        </View>
        <Feather name="chevron-right" size={18} color={tokens.colors.textMuted} />
      </Pressable>
    </ScrollView>
  );
}

// ─── Quick Action ────────────────────────────────────────────────────────────

interface QuickActionProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  tokens: ReturnType<typeof useTheme>['tokens'];
}

function QuickAction({ icon, label, tokens }: QuickActionProps) {
  return (
    <Pressable style={styles.quickAction} onPress={() => {}} accessibilityRole="button">
      <View style={[styles.quickActionCircle, { borderColor: tokens.colors.border }]}>
        <Feather name={icon} size={20} color={tokens.colors.text} />
      </View>
      <Typography
        variant="caption"
        color={tokens.colors.textSecondary}
        style={styles.quickActionLabel}
        numberOfLines={2}
      >
        {label}
      </Typography>
    </Pressable>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: { flex: 1 },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  headline: { marginTop: 2 },
  subheadline: { marginTop: 8 },

  // Next Service
  nextServiceCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  nextServiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nextServiceLabel: {
    marginLeft: 6,
    fontWeight: '500',
  },
  nextServiceDate: { marginBottom: 2 },
  nextServiceType: { marginBottom: 2 },

  // Lawn Photo
  lawnSection: { marginBottom: 24 },
  lawnPhotoWrapper: {
    width: '100%',
    height: 190,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  lawnPhoto: {
    width: '100%',
    height: '100%',
  },
  lawnBadgeContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  lawnBadge: {
    backgroundColor: 'rgba(45, 74, 45, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  lawnStatusTitle: { fontWeight: '600', marginBottom: 2 },

  // Quick Actions
  quickActionsSection: { marginBottom: 20 },
  sectionTitle: { marginBottom: 14 },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    width: 72,
  },
  quickActionCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  quickActionLabel: {
    textAlign: 'center',
    lineHeight: 14,
  },

  // Referral
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  referralIcon: { marginRight: 12 },
  referralContent: { flex: 1 },
  referralTitle: { fontWeight: '500', marginBottom: 1 },
});
