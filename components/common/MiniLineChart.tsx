// components/common/MiniLineChart.tsx - Weekly Version (FIXED)
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { type ThemeColors } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useThemeColors';

type MiniLineChartProps = {
  values: number[];
};

export function MiniLineChart({ values }: MiniLineChartProps) {
  const [innerSize, setInnerSize] = useState({ w: 0, h: 0 });
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Always compute safely (no early return before hooks)
  const domain = useMemo(() => {
    if (!values.length) return { min: 0, max: 0, range: 1 };

    const rawMin = Math.min(...values, 0);
    const rawMax = Math.max(...values, 0);

    const rawRange = rawMax - rawMin || 1;
    const pad = rawRange * 0.12;

    const min = rawMin - pad;
    const max = rawMax + pad;
    const range = max - min || 1;

    return { min, max, range };
  }, [values]);

  const { min, max, range } = domain;

  const plot = useMemo(() => {
    const { w, h } = innerSize;
    const n = values.length;

    if (!w || !h || n === 0) {
      return { pxPoints: [] as { x: number; y: number }[], d: '' };
    }

    // padding so dots/stroke never clip
    const DOT_R = 4;
    const PAD_X = DOT_R + 4;
    const PAD_Y = DOT_R + 6;

    const usableW = Math.max(1, w - PAD_X * 2);
    const usableH = Math.max(1, h - PAD_Y * 2);

    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

    const pxPoints = values.map((v, i) => {
      const x = n === 1 ? PAD_X + usableW / 2 : PAD_X + (i * usableW) / (n - 1);
      const t = (v - min) / range; // ideally 0..1
      const y = PAD_Y + (1 - t) * usableH;

      return {
        x: clamp(x, PAD_X, PAD_X + usableW),
        y: clamp(y, PAD_Y, PAD_Y + usableH),
      };
    });

    const d =
      pxPoints.length > 0
        ? pxPoints
            .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
            .join(' ')
        : '';

    return { pxPoints, d };
  }, [values, innerSize, min, range]);

  const { pxPoints, d } = plot;

  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>This Month</Text>
        <Text style={styles.range}>
          ${min.toFixed(0)} - ${max.toFixed(0)}
        </Text>
      </View>

      <View style={styles.chartWrap}>
        {/* Zero line if we have negative values */}
        {min < 0 && max > 0 && (
          <View
            style={[
              styles.zeroLine,
              { bottom: `${((0 - min) / (max - min)) * 100}%` },
            ]}
          >
            <Text style={styles.zeroLabel}>$0</Text>
          </View>
        )}

        {/* Grid lines */}
        <View style={[styles.gridLine, { top: '25%' }]} />
        <View style={[styles.gridLine, { top: '50%' }]} />
        <View style={[styles.gridLine, { top: '75%' }]} />

        {/* Chart */}
        <View
          style={styles.chartInner}
          onLayout={(e) =>
            setInnerSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })
          }
        >
          {!!innerSize.w && !!innerSize.h && d.length > 0 && (
            <Svg width={innerSize.w} height={innerSize.h} style={StyleSheet.absoluteFill}>
              <Path
                d={d}
                stroke={colors.green2}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.95}
              />
            </Svg>
          )}

          {/* Dots (same coordinates as the path) */}
          {pxPoints.map((p, idx) => (
            <View key={`dot-${idx}`} style={[styles.dot, { left: p.x, top: p.y }]} />
          ))}
        </View>

        {/* Week labels */}
        <View style={styles.xAxis}>
          {weekLabels.map((label, idx) => (
            <Text key={idx} style={styles.xLabel}>
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { gap: 8 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  label: { color: colors.text, fontSize: 14, fontWeight: '700' },
  range: { color: colors.muted, fontSize: 11, fontWeight: '700' },

  chartWrap: {
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 14,
    paddingBottom: 32,
    height: 140,
    overflow: 'hidden',
  },

  zeroLine: {
    position: 'absolute',
    left: 14,
    right: 14,
    height: 1.5,
    backgroundColor: colors.red,
    opacity: 0.5,
  },
  zeroLabel: {
    position: 'absolute',
    left: 0,
    top: -10,
    color: colors.red,
    fontSize: 9,
    fontWeight: '700',
  },

  chartInner: { position: 'relative', flex: 1 },

  gridLine: {
    position: 'absolute',
    left: 14,
    right: 14,
    height: 1,
    backgroundColor: colors.line,
    opacity: 0.3,
  },

  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginTop: -4,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.panel2,
  },

  xAxis: {
    position: 'absolute',
    bottom: 8,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xLabel: { color: colors.muted, fontSize: 10, fontWeight: '600' },
});
