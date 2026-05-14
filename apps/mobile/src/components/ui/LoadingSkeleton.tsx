import React from 'react';
import { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '@/theme/BrandThemeProvider';
import { useSkeletonAnimation } from '@/hooks/useSkeletonAnimation';

export interface LoadingSkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function LoadingSkeleton({
  width,
  height,
  borderRadius = 12,
  style,
}: LoadingSkeletonProps) {
  const { tokens } = useTheme();
  const { animatedStyle } = useSkeletonAnimation();

  const skeletonStyle: ViewStyle = {
    width: width as number,
    height,
    borderRadius,
    backgroundColor: `${tokens.colors.border}80`, // 50% opacity
  };

  return (
    <Animated.View style={[skeletonStyle, animatedStyle, style]} />
  );
}
