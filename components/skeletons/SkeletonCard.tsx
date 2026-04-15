import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonBlock } from './SkeletonBlock';

type Props = {
  compact?: boolean;
};

function SkeletonCardBase({ compact = false }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <SkeletonBlock width={compact ? 92 : 120} height={12} borderRadius={6} />
      <SkeletonBlock width={compact ? '72%' : '88%'} height={compact ? 22 : 30} borderRadius={10} style={styles.value} />
      <SkeletonBlock width={compact ? 84 : 110} height={compact ? 18 : 22} borderRadius={999} style={styles.pill} />
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.panel,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 18,
      padding: 16,
      gap: 12,
      minHeight: 120,
    },
    value: {
      marginTop: 2,
    },
    pill: {
      marginTop: 2,
      alignSelf: 'flex-start',
    },
  });

export const SkeletonCard = memo(SkeletonCardBase);

