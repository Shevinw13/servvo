/**
 * ServiceSelector — Premium dropdown-style service selector.
 * Replaces the pill tabs with a subtle, elegant property service picker.
 */

import React, { useState } from 'react';
import { View, Pressable, ViewStyle, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useIndustryStore } from '@/stores/industryStore';
import { getAvailableVerticals } from '@/config/industryConfigs';
import { IndustryVertical } from '@/config/industry.types';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/theme/BrandThemeProvider';

const SERVICE_LABELS: Record<IndustryVertical, string> = {
  lawn_care: 'GreenScape Lawn',
  hvac: 'Elite Air HVAC',
  pest_control: 'Shield Pest Control',
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

  return (
    <View style={styles.container}>
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
        <Feather name="chevron-down" size={16} color={tokens.colors.textMuted} style={styles.chevron} />
      </Pressable>

      {/* Dropdown Modal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.dropdown, { backgroundColor: tokens.colors.surfaceElevated, borderColor: tokens.colors.border }]}>
            {verticals.map((v) => (
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
                {v === currentVertical && (
                  <Feather name="check" size={16} color={tokens.colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles: Record<string, ViewStyle> = {
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.04,
    elevation: 1,
  },
  prefix: {
    marginRight: 6,
  },
  chevron: {
    marginLeft: 'auto',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdown: {
    width: 260,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.15,
    elevation: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
};
