import React from 'react';
import { View, ViewStyle, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/BrandThemeProvider';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { withOpacity } from '@/utils/colorUtils';
import { Typography } from '@/components/ui/Typography';

export interface QuickActionItem {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}

export interface QuickActionsProps {
  actions: QuickActionItem[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const displayedActions = actions.slice(0, 4);

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  return (
    <View style={rowStyle}>
      {displayedActions.map((action) => (
        <QuickActionButton key={action.id} action={action} />
      ))}
    </View>
  );
}

interface QuickActionButtonProps {
  action: QuickActionItem;
}

function QuickActionButton({ action }: QuickActionButtonProps) {
  const { tokens } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation({
    scalePressed: 0.92,
    duration: 100,
  });

  const containerStyle: ViewStyle = {
    alignItems: 'center',
    width: 72,
  };

  const circleStyle: ViewStyle = {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: withOpacity(tokens.colors.primary, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={action.onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={containerStyle}
        accessibilityRole="button"
        accessibilityLabel={action.label}
      >
        <View style={circleStyle}>
          <Feather name={action.icon} size={24} color={tokens.colors.primary} />
        </View>
        <Typography
          variant="caption"
          color={tokens.colors.textSecondary}
          style={{ textAlign: 'center' }}
          numberOfLines={2}
        >
          {action.label}
        </Typography>
      </Pressable>
    </Animated.View>
  );
}
