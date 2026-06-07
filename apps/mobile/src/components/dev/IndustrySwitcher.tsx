/**
 * ServiceSelector — "My Services" dropdown with notification badge.
 * Shows at the top of the dashboard. Notification counter indicates
 * activity from other providers.
 */

import React, { useState } from 'react';
import { View, Pressable, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useIndustryStore } from '@/stores/industryStore';
import { getAvailableVerticals } from '@/config/industryConfigs';
import { IndustryVertical } from '@/config/industry.types';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/theme/BrandThemeProvider';

const SERVICE_LABELS: Record<IndustryVertical, string> = {
  lawn_care: 'Green Giant Lawn Service',
  hvac: 'Unique Heating & Air',
  pest_control: 'Quality Pest Control',
};

// Mock notification counts per provider (simulates activity from other providers)
const NOTIFICATION_COUNTS: Record<IndustryVertical, number> = {
  lawn_care: 0,
  hvac: 2,
  pest_control: 1,
};

export function IndustrySwitcher() {
  const { tokens } = useTheme();
  const { currentVertical, setIndustry } = useIndustryStore();
  const verticals = getAvailableVerticals();
  const [open, setOpen] = useState(false);

  const handleSelect = (v: IndustryVertical) => {
    setIndustry(v);
    setOpen(false);
  };

  // Total notifications from OTHER providers (not the current one)
  const otherNotifications = verticals
    .filter(v => v !== currentVertical)
    .reduce((sum, v) => sum + (NOTIFICATION_COUNTS[v] || 0), 0);

  return (
    <View style={styles.container}>
      {/* Section label */}
      <Typography variant="caption" color={tokens.colors.textMuted} style={styles.label}>
        MY SERVICES
      </Typography>

      {/* Selector Button */}
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.selectorButton, { borderColor: tokens.colors.border }]}
        accessibilityRole="button"
        accessibilityLabel="Select service provider"
      >
        <Typography variant="bodyEmphasis" color={tokens.colors.text}>
          {SERVICE_LABELS[currentVertical]}
        </Typography>
        <View style={styles.rightSection}>
          {otherNotifications > 0 && (
            <View style={styles.badge}>
              <Typography variant="caption" color="#FFFFFF" style={styles.badgeText}>
                {otherNotifications}
              </Typography>
            </View>
          )}
          <Feather name="chevron-down" size={16} color={tokens.colors.textMuted} />
        </View>
      </Pressable>

      {/* Dropdown Modal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.dropdown, { backgroundColor: tokens.colors.surfaceElevated, borderColor: tokens.colors.border }]}>
            <Typography variant="caption" color={tokens.colors.textMuted} style={styles.dropdownLabel}>
              MY SERVICES
            </Typography>
            {verticals.map((v) => {
              const notifCount = NOTIFICATION_COUNTS[v] || 0;
              return (
                <Pressable
                  key={v}
                  onPress={() => handleSelect(v)}
                  style={[
                    styles.dropdownItem,
                    v === currentVertical && { backgroundColor: tokens.colors.primary + '08' },
                  ]}
                >
                  <Typography
                    variant="body"
                    color={v === currentVertical ? tokens.colors.primary : tokens.colors.text}
                  >
                    {SERVICE_LABELS[v]}
                  </Typography>
                  <View style={styles.itemRight}>
                    {notifCount > 0 && v !== currentVertical && (
                      <View style={styles.badge}>
                        <Typography variant="caption" color="#FFFFFF" style={styles.badgeText}>
                          {notifCount}
                        </Typography>
                      </View>
                    )}
                    {v === currentVertical && (
                      <Feather name="check" size={16} color={tokens.colors.primary} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.04,
    elevation: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdown: {
    width: 280,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.15,
    elevation: 10,
  },
  dropdownLabel: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    letterSpacing: 0.5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginBottom: 6,
  },
});
