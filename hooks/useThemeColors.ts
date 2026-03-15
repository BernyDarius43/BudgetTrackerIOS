import { useMemo } from 'react';
import { Colors, type ThemeColors } from '@/constants/Colors';
import { useAuth } from '@/context/authContext/authContext';

export function useThemeColors(): ThemeColors {
  const { resolvedTheme } = useAuth();

  return useMemo(() => Colors[resolvedTheme], [resolvedTheme]);
}
