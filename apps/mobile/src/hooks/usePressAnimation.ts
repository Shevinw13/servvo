import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useCallback } from 'react';

interface PressAnimationConfig {
  scalePressed?: number;
  opacityPressed?: number;
  duration?: number;
  disabled?: boolean;
  springConfig?: { damping: number; stiffness: number };
}

interface PressAnimationReturn {
  animatedStyle: { transform: { scale: number }[]; opacity: number };
  onPressIn: () => void;
  onPressOut: () => void;
}

/**
 * Shared press animation hook for tactile feedback on interactive elements.
 * Uses Reanimated v3 worklets for 60fps UI-thread animations.
 *
 * - onPressIn: withTiming to scalePressed/opacityPressed
 * - onPressOut: withSpring back to 1.0/1.0
 * - When disabled=true, handlers are no-ops and style stays at scale 1.0, opacity 1.0
 */
export function usePressAnimation(config?: PressAnimationConfig): PressAnimationReturn {
  const {
    scalePressed = 0.98,
    opacityPressed = 0.7,
    duration = 100,
    disabled = false,
    springConfig = { damping: 0.6, stiffness: 300 },
  } = config ?? {};

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const onPressIn = useCallback(() => {
    if (disabled) return;
    scale.value = withTiming(scalePressed, { duration });
    opacity.value = withTiming(opacityPressed, { duration });
  }, [disabled, scalePressed, opacityPressed, duration, scale, opacity]);

  const onPressOut = useCallback(() => {
    if (disabled) return;
    scale.value = withSpring(1, {
      damping: springConfig.damping,
      stiffness: springConfig.stiffness,
    });
    opacity.value = withSpring(1, {
      damping: springConfig.damping,
      stiffness: springConfig.stiffness,
    });
  }, [disabled, springConfig, scale, opacity]);

  return { animatedStyle, onPressIn, onPressOut };
}
