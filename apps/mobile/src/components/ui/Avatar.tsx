import React from 'react';
import { Image, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/theme/BrandThemeProvider';

export interface AvatarProps {
  uri?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
} as const;

export function Avatar({ uri, initials, size = 'md', style }: AvatarProps) {
  const { tokens } = useTheme();
  const dimension = SIZES[size];

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const initialsStyle: TextStyle = {
    color: '#FFFFFF',
    fontSize: dimension * 0.4,
    fontWeight: '600',
  };

  return (
    <View style={[containerStyle, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dimension, height: dimension }}
          accessibilityLabel={initials ? `Avatar for ${initials}` : 'Avatar'}
        />
      ) : (
        <Text style={initialsStyle} accessibilityLabel={initials ?? 'Avatar'}>
          {initials ?? ''}
        </Text>
      )}
    </View>
  );
}
