import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { type ThemeColors } from '@/constants/Colors';
import { MonthlySnapshot } from '@/hooks/useChartData';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonChart } from '@/components/skeletons/SkeletonChart';

type Props = {
  data: MonthlySnapshot[];
  onSelectMonth?: (month: MonthlySnapshot) => void;
  isLoading?: boolean;
};

export function FullLineChart({ data, onSelectMonth, isLoading = false }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [innerSize, setInnerSize] = useState({ w: 0, h: 0 });
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handlePointPress = (index: number) => {
    setSelectedIndex(index);
    onSelectMonth?.(data[index]);
  };

  /**
   * IMPORTANT:
   * All hooks must run on every render.
   * So we compute safely even when data is empty or only 1 item.
   */
  const computed = useMemo(() => {
    const values = data.map(d => d.endBalance);

    // Safe defaults when empty
    if (values.length === 0) {
      return {
        min: 0,
        max: 0,
        range: 1,
        monthLabels: [] as string[],
      };
    }

    // Include 0 in domain so negative/positive charts behave nicely.
    const rawMin = Math.min(...values, 0);
    const rawMax = Math.max(...values, 0);

    const rawRange = rawMax - rawMin || 1;
    const pad = rawRange * 0.12; // headroom/footroom

    const min = rawMin - pad;
    const max = rawMax + pad;
    const range = max - min || 1;

    // If the range spans multiple years, show year in label to avoid "Jan ... Dec ... Jan" confusion
    const years = new Set(data.map(d => d.month.split('-')[0]));
    const showYear = years.size > 1;

    const monthLabels = data.map(d => {
      const [y, m] = d.month.split('-');
      const date = new Date(parseInt(y), parseInt(m) - 1, 1);
      const mon = date.toLocaleDateString('en-US', { month: 'short' });
      return showYear ? `${mon} '${y.slice(2)}` : mon;
    });

    return { min, max, range, monthLabels };
  }, [data]);

  const { min, max, range, monthLabels } = computed;

  const plot = useMemo(() => {
    const { w, h } = innerSize;
    const n = data.length;

    if (!w || !h || n === 0) {
      return { pxPoints: [] as { x: number; y: number }[], d: '' };
    }

    // Keep dots inside chart area
    const DOT_R = 6;
    const PAD_X = DOT_R + 4;
    const PAD_Y = DOT_R + 6;

    const usableW = Math.max(1, w - PAD_X * 2);
    const usableH = Math.max(1, h - PAD_Y * 2);

    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

    const pxPoints = data.map((d, i) => {
      const x = n === 1 ? PAD_X + usableW / 2 : PAD_X + (i * usableW) / (n - 1);

      const t = (d.endBalance - min) / range; // ideally 0..1
      const y = PAD_Y + (1 - t) * usableH;

      return {
        x: clamp(x, PAD_X, PAD_X + usableW),
        y: clamp(y, PAD_Y, PAD_Y + usableH),
      };
    });

    const dPath =
      pxPoints.length > 0
        ? pxPoints
            .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
            .join(' ')
        : '';

    return { pxPoints, d: dPath };
  }, [data, innerSize, min, range]);

  const { pxPoints, d } = plot;

  /**
   * Early returns AFTER hooks (safe)
   */
  if (isLoading) {
    return <SkeletonChart />;
  }

  if (!data.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📊</Text>
        <Text style={styles.emptyTitle}>No Data Available</Text>
        <Text style={styles.emptySubtitle}>Add transactions to see your balance trend</Text>
      </View>
    );
  }

  if (data.length === 1 && data[0].isPartial) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📈</Text>
        <Text style={styles.emptyTitle}>This Month So Far</Text>
        <Text style={styles.emptySubtitle}>Balance: ${data[0].endBalance.toFixed(2)}</Text>
        <Text style={[styles.emptySubtitle, { marginTop: 8 }]}>
          Keep adding transactions to see your trend!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>Balance Trend</Text>
        <Text style={styles.range}>
          ${min.toFixed(0)} - ${max.toFixed(0)}
        </Text>
      </View>

      <View style={styles.chartWrap}>
        {/* Zero line */}
        {min < 0 && max > 0 && (
          <View style={[styles.zeroLine, { bottom: `${((0 - min) / (max - min)) * 100}%` }]}>
            <Text style={styles.zeroLabel}>$0</Text>
          </View>
        )}

        {/* Grid lines */}
        <View style={[styles.gridLine, { top: '25%' }]} />
        <View style={[styles.gridLine, { top: '50%' }]} />
        <View style={[styles.gridLine, { top: '75%' }]} />

        <View
          style={styles.chartInner}
          onLayout={(e) => setInnerSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
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

          {pxPoints.map((p, idx) => {
            const isSelected = selectedIndex === idx;
            const isIncomplete = data[idx].isPartial;

            return (
              <Pressable
                key={`dot-${idx}`}
                onPress={() => handlePointPress(idx)}
                style={[styles.dotTouchable, { left: p.x, top: p.y }]}
                hitSlop={12}
              >
                <View style={[styles.dot, isSelected && styles.dotSelected, isIncomplete && styles.dotIncomplete]} />
                {isSelected && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>${data[idx].endBalance.toFixed(0)}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* X-axis */}
        <View style={styles.xAxis}>
          {monthLabels.map((label, idx) => (
            <Text
              key={idx}
              style={[styles.xLabel, selectedIndex === idx && styles.xLabelSelected]}
              numberOfLines={1}
            >
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
    height: 200,
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
    right: 0,
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

  dotTouchable: {
    position: 'absolute',
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.panel2,
  },
  dotSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
  },
  dotIncomplete: { opacity: 0.6 },

  tooltip: {
    position: 'absolute',
    top: -32,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  tooltipText: { color: colors.text, fontSize: 12, fontWeight: '800' },

  xAxis: {
    position: 'absolute',
    bottom: 8,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xLabel: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  xLabelSelected: { color: colors.green, fontWeight: '800' },

  emptyContainer: {
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  emptySubtitle: { color: colors.muted, fontSize: 14, textAlign: 'center' },
});
