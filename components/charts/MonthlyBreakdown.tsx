// components/charts/MonthlyBreakdown.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { type ThemeColors } from '@/constants/Colors';
import { MonthlySnapshot } from '@/hooks/useChartData';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonMonthlyBreakdown } from '@/components/skeletons/SkeletonMonthlyBreakdown';

type Props = {
  month: MonthlySnapshot;
  isLoading?: boolean;
};

export function MonthlyBreakdown({ month, isLoading = false }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (isLoading) {
    return <SkeletonMonthlyBreakdown />;
  }

  const isPositive = month.netCashFlow >= 0;
  const earnedMore = month.totalIncome > month.totalExpenses;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthLabel}>{month.monthLabel}</Text>
        {month.isPartial && (
          <View style={styles.partialBadge}>
            <Text style={styles.partialText}>In Progress</Text>
          </View>
        )}
      </View>

      {/* End Balance */}
      <View style={styles.mainStat}>
        <Text style={styles.statLabel}>Month End Balance</Text>
        <Text style={[styles.statValue, { color: month.endBalance >= 0 ? colors.green : colors.red }]}>
          ${month.endBalance.toFixed(2)}
        </Text>
      </View>

      {/* Change from previous month */}
      {month.changeFromPrevious !== 0 && (
        <View style={styles.changeBadge}>
          <Text style={[styles.changeText, { color: month.changeFromPrevious >= 0 ? colors.green : colors.red }]}>
            {month.changeFromPrevious >= 0 ? '+' : ''}${Math.abs(month.changeFromPrevious).toFixed(2)} vs previous month
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      {/* Income & Expenses Breakdown */}
      <View style={styles.breakdown}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>💰 Total Income</Text>
          <Text style={[styles.breakdownValue, { color: colors.green }]}>
            +${month.totalIncome.toFixed(2)}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>💸 Total Expenses</Text>
          <Text style={[styles.breakdownValue, { color: colors.red }]}>
            -${month.totalExpenses.toFixed(2)}
          </Text>
        </View>

        <View style={[styles.breakdownRow, { marginTop: 8 }]}>
          <Text style={[styles.breakdownLabel, { fontWeight: '800' }]}>Net Cash Flow</Text>
          <Text style={[styles.breakdownValue, { 
            fontWeight: '800',
            color: isPositive ? colors.green : colors.red 
          }]}>
            {isPositive ? '+' : ''}${month.netCashFlow.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Verdict */}
      
      <View style={[styles.verdict, { backgroundColor: earnedMore ? colors.pillBg : 'rgba(239, 68, 68, 0.1)' }]}>
        <Text style={styles.verdictIcon}>{earnedMore ? '✅' : '⚠️'}</Text>
        <Text style={[styles.verdictText, { color: earnedMore ? colors.green : colors.red }]}>
          {earnedMore 
            ? 'You earned more than you spent!' 
            : 'You spent more than you earned'}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {month.transactionCount} transaction{month.transactionCount !== 1 ? 's' : ''} this month
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  monthLabel: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  partialBadge: {
    backgroundColor: colors.pillBg,
    borderColor: colors.pillBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  partialText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '700',
  },
  mainStat: {
    gap: 4,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  changeBadge: {
    alignSelf: 'flex-start',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 4,
  },
  breakdown: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  verdict: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  verdictIcon: {
    fontSize: 20,
  },
  verdictText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  stats: {
    alignItems: 'center',
  },
  statsText: {
    color: colors.muted,
    fontSize: 12,
  },
});
