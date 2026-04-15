import React, { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonBlock } from './SkeletonBlock';
import { SkeletonChart } from './SkeletonChart';
import { SkeletonListItem } from './SkeletonListItem';

function DashboardSkeletonBase() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={{ flex: 1, gap: 10 }}>
            <SkeletonBlock width={96} height={12} borderRadius={6} />
            <SkeletonBlock width="58%" height={28} borderRadius={10} />
            <SkeletonBlock width={124} height={18} borderRadius={999} />
          </View>
        </View>

        <SkeletonChart />

        <View style={styles.sectionHeader}>
          <SkeletonBlock width={138} height={16} borderRadius={6} />
          <SkeletonBlock width={56} height={14} borderRadius={6} />
        </View>

        <View style={styles.txPanel}>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonListItem key={`dash-tx-${index}`} />
          ))}
        </View>

        <View style={styles.actionsRow}>
          <SkeletonBlock width="48%" height={52} borderRadius={14} />
          <SkeletonBlock width="48%" height={52} borderRadius={14} />
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    container: { padding: 18, gap: 16 },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    sectionHeader: {
      marginTop: 6,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    txPanel: {
      backgroundColor: colors.panel2,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 18,
      overflow: 'hidden',
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 12,
    },
  });

export const DashboardSkeleton = memo(DashboardSkeletonBase);
