import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography } from '@/components/ui/Typography';
import { getSeasonalTip } from '@/utils/seasonalTips';

export interface PropertySnapshotProps {
  healthStatus: 'thriving' | 'good' | 'needs_attention';
  lastServiceDate: string;
  currentMonth: number;
}

const HEALTH_COLORS: Record<PropertySnapshotProps['healthStatus'], string> = {
  thriving: '#2D6A2D',
  good: '#B7791F',
  needs_attention: '#C53030',
};

const HEALTH_LABELS: Record<PropertySnapshotProps['healthStatus'], string> = {
  thriving: 'Thriving',
  good: 'Good',
  needs_attention: 'Needs Attention',
};

export function PropertySnapshot({ healthStatus, lastServiceDate, currentMonth }: PropertySnapshotProps) {
  const { tokens } = useTheme();
  const tip = getSeasonalTip(currentMonth);

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    gap: 12,
  };

  const cardStyle: ViewStyle = {
    flex: 1,
    backgroundColor: tokens.colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    shadowOpacity: 0.07,
    elevation: 3,
  };

  const iconStyle: ViewStyle = {
    marginBottom: 8,
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={rowStyle}>
      {/* Health Card */}
      <View style={cardStyle}>
        <View style={iconStyle}>
          <Feather name="feather" size={18} color={HEALTH_COLORS[healthStatus]} />
        </View>
        <Typography
          variant="bodyEmphasis"
          color={HEALTH_COLORS[healthStatus]}
          style={{ marginBottom: 2 }}
        >
          {HEALTH_LABELS[healthStatus]}
        </Typography>
        <Typography variant="caption" color={tokens.colors.textSecondary}>
          Lawn Health
        </Typography>
      </View>

      {/* Last Service Card */}
      <View style={cardStyle}>
        <View style={iconStyle}>
          <Feather name="calendar" size={18} color={tokens.colors.textSecondary} />
        </View>
        <Typography variant="bodyEmphasis" style={{ marginBottom: 2 }}>
          {formatDate(lastServiceDate)}
        </Typography>
        <Typography variant="caption" color={tokens.colors.textSecondary}>
          Last Service
        </Typography>
      </View>

      {/* Seasonal Tip Card */}
      <View style={cardStyle}>
        <View style={iconStyle}>
          <Feather name="sun" size={18} color={tokens.colors.warning} />
        </View>
        <Typography variant="caption" numberOfLines={2} style={{ marginBottom: 2 }}>
          {tip}
        </Typography>
        <Typography variant="caption" color={tokens.colors.textSecondary}>
          Seasonal Tip
        </Typography>
      </View>
    </View>
  );
}
