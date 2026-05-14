import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface SkeletonAnimationReturn {
  animatedStyle: { opacity: number };
}

/**
 * Skeleton loading animation hook.
 * Loops opacity between 0.3 and 0.7 over 1200ms using withRepeat + withTiming.
 */
export function useSkeletonAnimation(): SkeletonAnimationReturn {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1, // infinite repeat
      true // reverse (ping-pong)
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { animatedStyle };
}
