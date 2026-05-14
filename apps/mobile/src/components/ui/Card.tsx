import React from 'react';
import { View, ViewStyle, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '@/theme/BrandThemeProvider';
import { usePressAnimation } from '@/hooks/usePressAnimation';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated';
  onPress?: () => void;
}

export function Card({ children, style, variant = 'default', onPress }: CardProps) {
  const { tokens } = useTheme();

  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation({
    scalePressed: 0.98,
    disabled: !onPress,
  });

  const cardStyle: ViewStyle = {
    backgroundColor: tokens.colors.surfaceElevated,
    borderRadius: 16,
    padding: tokens.spacing.lg,
    borderWidth: 0,
    shadowColor: '#000',
  };

  if (variant === 'default') {
    cardStyle.shadowOffset = { width: 0, height: 4 };
    cardStyle.shadowRadius = 12;
    cardStyle.shadowOpacity = 0.08;
    cardStyle.elevation = 4;
  } else {
    // elevated
    cardStyle.shadowOffset = { width: 0, height: 8 };
    cardStyle.shadowRadius = 24;
    cardStyle.shadowOpacity = 0.12;
    cardStyle.elevation = 8;
  }

  const cardContent = (
    <>
      {variant === 'elevated' && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 0,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.5)',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
      )}
      {children}
    </>
  );

  if (onPress) {
    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[cardStyle, style]}
          accessibilityRole="button"
        >
          {cardContent}
        </Pressable>
      </Animated.View>
    );
  }

  return <View style={[cardStyle, style]}>{cardContent}</View>;
}
