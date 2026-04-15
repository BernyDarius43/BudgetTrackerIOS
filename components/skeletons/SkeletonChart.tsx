import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonBlock } from './SkeletonBlock';

type Props = {
  compact?: boolean;
};

function SkeletonChartBase({ compact = false }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonBlock width={110} height={14} borderRadius={6} />
        <SkeletonBlock width={72} height={11} borderRadius={6} />
      </View>

      <View style={[styles.chartWrap, compact && styles.chartWrapCompact]}>
        <View style={styles.gridLine} />
        <View style={[styles.gridLine, styles.gridLineMid]} />
        <View style={[styles.gridLine, styles.gridLineLower]} />

        <View style={styles.chartBars}>
          {[36, 56, 42, 72, 50, 64].map((barHeight, index) => (
            <SkeletonBlock
              key={`bar-${index}`}
              width={16}
              height={barHeight}
              borderRadius={999}
              style={styles.bar}
            />
          ))}
        </View>

        <View style={styles.axis}>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, index) => (
            <SkeletonBlock
              key={label}
              width={index === 0 || index === 5 ? 22 : 28}
              height={9}
              borderRadius={4}
              style={styles.axisLabel}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    chartWrap: {
      backgroundColor: colors.panel2,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 18,
      padding: 14,
      height: 200,
      overflow: 'hidden',
      justifyContent: 'space-between',
    },
    chartWrapCompact: {
      height: 176,
    },
    gridLine: {
      position: 'absolute',
      left: 14,
      right: 14,
      top: '25%',
      height: 1,
      backgroundColor: colors.line,
      opacity: 0.35,
    },
    gridLineMid: {
      top: '50%',
    },
    gridLineLower: {
      top: '75%',
    },
    chartBars: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingBottom: 24,
      paddingHorizontal: 6,
    },
    bar: {
      flexShrink: 0,
    },
    axis: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    axisLabel: {
      opacity: 0.7,
    },
  });

export const SkeletonChart = memo(SkeletonChartBase);

