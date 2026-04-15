import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonBlock } from './SkeletonBlock';

type Props = {
  fieldCount?: number;
  buttonCount?: number;
  compact?: boolean;
};

function SkeletonFormBase({ fieldCount = 4, buttonCount = 1, compact = false }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      {[...Array(fieldCount)].map((_, index) => (
        <View key={`field-${index}`} style={styles.field}>
          <SkeletonBlock width={compact ? 88 : 120} height={12} borderRadius={6} />
          <SkeletonBlock width="100%" height={compact ? 42 : 48} borderRadius={14} />
        </View>
      ))}

      {buttonCount > 0 && (
        <View style={styles.actionsRow}>
          {[...Array(buttonCount)].map((_, index) => (
            <SkeletonBlock
              key={`btn-${index}`}
              width={buttonCount === 1 ? '100%' : '48%'}
              height={48}
              borderRadius={14}
            />
          ))}
        </View>
      )}
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
      gap: 14,
    },
    field: {
      gap: 8,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 6,
    },
  });

export const SkeletonForm = memo(SkeletonFormBase);

