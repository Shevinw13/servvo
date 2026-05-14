import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/BrandThemeProvider';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { darken } from '@/utils/colorUtils';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { tokens } = useTheme();

  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation({
    scalePressed: 0.96,
    opacityPressed: 1,
    duration: 150,
    disabled: disabled || loading,
    springConfig: { damping: 0.6, stiffness: 300 },
  });

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: 14,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      minHeight: 52,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          overflow: 'hidden',
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: tokens.colors.primary,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontSize: 17,
      fontWeight: '600',
      letterSpacing: 0.3,
      lineHeight: 20,
    };

    switch (variant) {
      case 'primary':
        return { ...base, color: '#FFFFFF' };
      case 'secondary':
      case 'ghost':
        return { ...base, color: tokens.colors.primary };
    }
  };

  const getIndicatorColor = (): string => {
    return variant === 'primary' ? '#FFFFFF' : tokens.colors.primary;
  };

  const gradientColors: [string, string] = [
    tokens.colors.primary,
    darken(tokens.colors.primary, 0.1),
  ];

  const content = (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || loading}
      style={[
        getContainerStyle(),
        disabled && { opacity: 0.5 },
        variant !== 'primary' ? undefined : undefined,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {variant === 'primary' && (
        <LinearGradient
          colors={gradientColors}
          style={{
            ...({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as ViewStyle),
          }}
        />
      )}
      {loading ? (
        <ActivityIndicator color={getIndicatorColor()} size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  );

  return (
    <Animated.View style={animatedStyle}>
      {content}
    </Animated.View>
  );
}
