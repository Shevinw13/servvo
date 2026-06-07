import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { Typography } from '@/components/ui/Typography';
import { IndustryConfig } from '@/config/industry.types';
import { getIndustrySeasonalTip } from '@/utils/seasonalTips';

export interface PropertySnapshotProps {
  config: IndustryConfig;
  currentMonth: number;
}

export function PropertySnapshot({ config, currentMonth }: PropertySnapshotProps) {
  const { tokens } = useTheme();
  const tip = getIndustrySeasonalTip(config, currentMonth);

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

  // Build display cards — third card shows seasonal tip
  const cards = config.insightCards.map((card, index) => {
    const displayValue = index === 2 ? tip : card.value;
    return { ...card, displayValue };
  });

  return (
    <View style={rowStyle}>
      {cards.map((card, index) => {
        // First card gets stronger presence
        const isFirst = index === 0;
        const cardShadowOpacity = isFirst ? 0.09 : 0.05;
        const cardTint = card.backgroundTint
          ? isFirst
            ? card.backgroundTint.replace(/[\d.]+\)$/, (match: string) => {
                const val = Math.min(parseFloat(match) * 1.5, 1);
                return `${val})`;
              })
            : card.backgroundTint
          : undefined;

        return (
          <View
            key={card.id}
            style={[
              cardStyle,
              { shadowOpacity: cardShadowOpacity },
              cardTint ? { backgroundColor: cardTint } : undefined,
            ]}
          >
            <View style={iconStyle}>
              <Feather name={card.icon as any} size={18} color={card.iconColor} />
            </View>
            {/* For the third card (seasonal tip), show as caption with 2 lines */}
            {card.id === config.insightCards[2].id ? (
              <>
                <Typography variant="caption" style={{ marginBottom: 2 }}>
                  {card.displayValue}
                </Typography>
                <Typography variant="caption" color={tokens.colors.textSecondary}>
                  {card.label}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant={isFirst ? 'h3' : 'bodyEmphasis'} color={card.iconColor} style={{ marginBottom: 2 }}>
                  {card.displayValue}
                </Typography>
                <Typography variant="caption" color={tokens.colors.textSecondary}>
                  {card.label}
                </Typography>
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}
