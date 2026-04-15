import React, { memo, useEffect, useMemo, useState } from 'react';
import { DimensionValue, LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/useThemeColors';

type SkeletonBlockProps = {
  width?: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

function SkeletonBlockBase({
  width = '100%',
  height,
  borderRadius = 12,
  style,
}: SkeletonBlockProps) {
  const colors = useThemeColors();
  const progress = useSharedValue(0);
  const [layoutWidth, setLayoutWidth] = useState(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1250,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => {
    const travel = Math.max(layoutWidth * 1.2, 140);
    const translateX = interpolate(progress.value, [0, 1], [-travel, travel], Extrapolation.CLAMP);

    return {
      transform: [
        { translateX },
        { rotate: '18deg' },
      ],
    };
  }, [layoutWidth]);

  const onLayout = (event: LayoutChangeEvent) => {
    const measured = event.nativeEvent.layout.width;
    if (measured > 0 && measured !== layoutWidth) {
      setLayoutWidth(measured);
    }
  };

  const shimmerTint = useMemo(
    () => (colors.bg === '#0B0D10' ? 'rgba(255,255,255,0.12)' : 'rgba(12,17,22,0.10)'),
    [colors.bg]
  );

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.panel2,
        },
        style,
      ]}
      pointerEvents="none"
      accessibilityRole="none"
      accessible={false}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmer,
          {
            width: Math.max(layoutWidth * 0.45, 56),
            backgroundColor: shimmerTint,
            opacity: 0.9,
          },
          shimmerStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: -24,
    bottom: -24,
    left: -20,
  },
});

export const SkeletonBlock = memo(SkeletonBlockBase);
