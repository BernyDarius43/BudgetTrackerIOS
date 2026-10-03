import { useMemo } from 'react';
import { Colors, type ColorKey } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorKey
) {
  const colorScheme = useColorScheme() ?? 'light';

  return useMemo(() => {
    const override = props[colorScheme];
    if (override) return override;
    return Colors[colorScheme][colorName];
  }, [colorName, colorScheme, props.dark, props.light]);
}
