import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonBlock } from './SkeletonBlock';

type Props = {
  compact?: boolean;
};

function SkeletonListItemBase({ compact = false }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <SkeletonBlock width={44} height={44} borderRadius={12} />
      <View style={styles.body}>
        <SkeletonBlock width={compact ? '54%' : '68%'} height={13} borderRadius={6} />
        <SkeletonBlock width={compact ? '38%' : '48%'} height={10} borderRadius={6} style={styles.subline} />
      </View>
      <SkeletonBlock width={compact ? 64 : 78} height={14} borderRadius={6} />
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    body: {
      flex: 1,
      gap: 6,
    },
    subline: {
      opacity: 0.88,
    },
  });

export const SkeletonListItem = memo(SkeletonListItemBase);

