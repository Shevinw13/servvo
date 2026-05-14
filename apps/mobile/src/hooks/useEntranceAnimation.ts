import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface EntranceAnimationConfig {
  initialScale?: number;
  duration?: number;
  delay?: number;
}

interface EntranceAnimationReturn {
  animatedStyle: { transform: { scale: number }[]; opacity: number };
}

/**
 * Entrance animation hook for mount transitions.
 * Animates from initialScale/opacity 0 to scale 1.0/opacity 1.0 using withSpring.
 * If delay > 0, uses withDelay.
 */
export function useEntranceAnimation(config?: EntranceAnimationConfig): EntranceAnimationReturn {
  const { initialScale = 0.8, duration = 300, delay = 0 } = config ?? {};

  const scale = useSharedValue(initialScale);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const springConfig = {
      duration,
      dampingRatio: 0.8,
      stiffness: 100,
    };

    if (delay > 0) {
      scale.value = withDelay(delay, withSpring(1, springConfig));
      opacity.value = withDelay(delay, withSpring(1, springConfig));
    } else {
      scale.value = withSpring(1, springConfig);
      opacity.value = withSpring(1, springConfig);
    }
  }, [scale, opacity, initialScale, duration, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle };
}
