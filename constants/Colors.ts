// constants/Colors.ts

export const Colors = {
  light: {
    bg: '#F6F7F9',
    panel: '#FFFFFF',
    panel2: '#F1F3F6',
    text: '#0C1116',
    muted: '#5A6675',
    line: '#E2E6EC',
    green: '#1F8A4C',
    green2: '#2ECC71',
    blue: '#1E88E5',
    white: '#FFFFFF',
    red: '#D32F2F',
    gridLine: '#E3E7ED',
    pillBg: '#E8F5E9',
    pillBorder: '#C8E6C9',
    txBorder: '#E6E9EF',
    icon: '#667085',
    background: '#F6F7F9',
  },
  dark: {
    bg: '#0B0D10',
    panel: '#12151B',
    panel2: '#0F1217',
    text: '#E9EEF7',
    muted: '#A9B3C6',
    line: '#1E2430',
    green: '#B9FF4D',
    green2: '#7CFF3A',
    blue: '#78D7FF',
    white: '#FFFFFF',
    red: '#FF6B6B',
    gridLine: '#161B24',
    pillBg: '#173015',
    pillBorder: '#2B5C25',
    txBorder: '#141923',
    icon: '#A9B3C6',
    background: '#0B0D10',
  },
} as const;

export type ThemeColors = typeof Colors.dark;
export type ColorKey = keyof ThemeColors;

// Backwards-compatible default (dark theme)
export const COLORS: ThemeColors = Colors.dark;
