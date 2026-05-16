/**
 * IndustrySwitcher — Dev-only pill toggle for switching between industry verticals.
 * Displays emoji + short label for each vertical with active state highlighting.
 */

import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { useIndustryStore } from '@/stores/industryStore';
import { getAvailableVerticals } from '@/config/industryConfigs';
import { IndustryVertical } from '@/config/industry.types';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/theme/BrandThemeProvider';

export function IndustrySwitcher() {
  const { tokens } = useTheme();
  const { currentVertical, setIndustry } = useIndustryStore();
  const verticals = getAvailableVerticals();

  const LABELS: Record<IndustryVertical, string> = {
    lawn_care: '🌿 Lawn',
    hvac: '❄️ HVAC',
    pest_control: '🛡️ Pest',
  };

  return (
    <View style={containerStyle}>
      {verticals.map((v) => (
        <Pressable
          key={v}
          onPress={() => setIndustry(v)}
          style={[
            pillStyle,
            v === currentVertical && { backgroundColor: tokens.colors.primary },
          ]}
        >
          <Typography
            variant="caption"
            color={v === currentVertical ? '#FFFFFF' : tokens.colors.textSecondary}
          >
            {LABELS[v]}
          </Typography>
        </Pressable>
      ))}
    </View>
  );
}

const containerStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 8,
  paddingVertical: 8,
  paddingHorizontal: 16,
};

const pillStyle: ViewStyle = {
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 16,
  backgroundColor: 'rgba(0,0,0,0.05)',
};
