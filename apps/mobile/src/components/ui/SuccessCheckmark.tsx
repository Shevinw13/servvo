import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

export interface SuccessCheckmarkProps {
  visible: boolean;
  onComplete?: () => void;
}

export function SuccessCheckmark({ visible, onComplete }: SuccessCheckmarkProps) {
  const circleScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      circleScale.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.back(1.2)),
      });
      checkOpacity.value = withDelay(
        200,
        withTiming(1, { duration: 200 }, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        })
      );
    } else {
      circleScale.value = 0;
      checkOpacity.value = 0;
    }
  }, [visible, circleScale, checkOpacity, onComplete]);

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));

  if (!visible) return null;

  const containerStyle: ViewStyle = {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const circleStyle: ViewStyle = {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2D6A2D',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View style={containerStyle}>
      <Animated.View style={[circleStyle, circleAnimatedStyle]}>
        <Animated.View style={checkAnimatedStyle}>
          <Feather name="check" size={32} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
