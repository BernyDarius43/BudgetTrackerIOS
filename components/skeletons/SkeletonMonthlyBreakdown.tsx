import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonBlock } from './SkeletonBlock';

function SkeletonMonthlyBreakdownBase() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonBlock width={140} height={20} borderRadius={8} />
        <SkeletonBlock width={92} height={24} borderRadius={999} />
      </View>

      <View style={styles.mainStat}>
        <SkeletonBlock width={96} height={12} borderRadius={6} />
        <SkeletonBlock width={160} height={30} borderRadius={10} />
      </View>

      <SkeletonBlock width={180} height={16} borderRadius={999} />

      <View style={styles.divider} />

      <View style={styles.breakdown}>
        <View style={styles.breakdownRow}>
          <SkeletonBlock width={96} height={12} borderRadius={6} />
          <SkeletonBlock width={86} height={14} borderRadius={6} />
        </View>
        <View style={styles.breakdownRow}>
          <SkeletonBlock width={104} height={12} borderRadius={6} />
          <SkeletonBlock width={86} height={14} borderRadius={6} />
        </View>
        <View style={styles.breakdownRow}>
          <SkeletonBlock width={88} height={12} borderRadius={6} />
          <SkeletonBlock width={92} height={14} borderRadius={6} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.verdict}>
        <SkeletonBlock width={24} height={24} borderRadius={12} />
        <SkeletonBlock width="72%" height={14} borderRadius={6} />
      </View>

      <View style={styles.stats}>
        <SkeletonBlock width={170} height={12} borderRadius={6} />
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.panel,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 18,
      padding: 20,
      gap: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    mainStat: {
      gap: 8,
    },
    divider: {
      height: 1,
      backgroundColor: colors.line,
      marginVertical: 4,
    },
    breakdown: {
      gap: 10,
    },
    breakdownRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    verdict: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 14,
      borderRadius: 12,
      backgroundColor: colors.panel2,
    },
    stats: {
      alignItems: 'center',
    },
  });

export const SkeletonMonthlyBreakdown = memo(SkeletonMonthlyBreakdownBase);
