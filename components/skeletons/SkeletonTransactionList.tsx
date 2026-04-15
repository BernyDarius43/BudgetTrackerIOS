import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonBlock } from './SkeletonBlock';
import { SkeletonListItem } from './SkeletonListItem';

type Props = {
  rowCount?: number;
};

function SkeletonTransactionListBase({ rowCount = 5 }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonBlock width={120} height={16} borderRadius={6} />
        <SkeletonBlock width={64} height={12} borderRadius={6} />
      </View>

      <SkeletonBlock width="100%" height={56} borderRadius={14} />

      <View style={styles.listPanel}>
        {Array.from({ length: rowCount }).map((_, index) => (
          <SkeletonListItem key={`tx-${index}`} />
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      gap: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    listPanel: {
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: colors.panel,
      borderWidth: 1,
      borderColor: colors.line,
    },
  });

export const SkeletonTransactionList = memo(SkeletonTransactionListBase);
