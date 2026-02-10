// constants/Colors.ts

export const COLORS = {
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
} as const;

export type ColorKey = keyof typeof COLORS;