import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonBlock } from './SkeletonBlock';
import { SkeletonCard } from './SkeletonCard';

function AuthBootstrapSkeletonBase() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.safe, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.hero}>
        <SkeletonBlock width={110} height={14} borderRadius={6} />
        <SkeletonBlock width="72%" height={32} borderRadius={10} />
        <SkeletonBlock width="88%" height={44} borderRadius={12} />
      </View>

      <SkeletonCard />
      <SkeletonBlock width="100%" height={52} borderRadius={14} />
      <SkeletonBlock width="100%" height={52} borderRadius={14} />
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: 18,
      justifyContent: 'center',
      gap: 16,
    },
    hero: {
      gap: 10,
    },
  });

export const AuthBootstrapSkeleton = memo(AuthBootstrapSkeletonBase);
