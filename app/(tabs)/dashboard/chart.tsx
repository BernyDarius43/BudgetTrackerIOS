// app/(tabs)/dashboard/chart.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { useChartData, MonthlySnapshot } from '@/hooks/useChartData';
import { FullLineChart } from '@/components/charts/FullLineChart';
import { MonthlyBreakdown } from '@/components/charts/MonthlyBreakdown';

type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'All';

export default function ChartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { monthlyData, getDataForRange, hasData, hasCompleteMonth } = useChartData();

  const [selectedRange, setSelectedRange] = useState<TimeRange>('6M');
  const [selectedMonth, setSelectedMonth] = useState<MonthlySnapshot | null>(null);

  const chartData = useMemo(() => {
    return getDataForRange(selectedRange);
  }, [getDataForRange, selectedRange]);

  const displayMonth = selectedMonth || chartData[chartData.length - 1];

  const ranges: { key: TimeRange; label: string }[] = [
    { key: '1M', label: '1M' },
    { key: '3M', label: '3M' },
    { key: '6M', label: '6M' },
    { key: '1Y', label: '1Y' },
    { key: 'All', label: 'All' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.safe}>
        <ScrollView 
          contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>Balance Trend</Text>
            <Text style={styles.subtitle}>Track your financial journey</Text>
          </View>

          {/* Time Range Selector */}
          {hasCompleteMonth && (
            <View style={styles.rangeSelector}>
              {ranges.map((range) => (
                <Pressable
                  key={range.key}
                  onPress={() => setSelectedRange(range.key)}
                  style={[
                    styles.rangeButton,
                    selectedRange === range.key && styles.rangeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.rangeButtonText,
                      selectedRange === range.key && styles.rangeButtonTextActive,
                    ]}
                  >
                    {range.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Chart */}
          <FullLineChart 
            data={chartData} 
            onSelectMonth={setSelectedMonth}
          />

          {/* Monthly Breakdown */}
          {displayMonth && (
            <View style={{ marginTop: 24 }}>
              <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
              <MonthlyBreakdown month={displayMonth} />
            </View>
          )}

          {/* Empty State */}
          {!hasData && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>No Data Yet</Text>
              <Text style={styles.emptyText}>
                Start adding income and expenses to see your balance trend over time.
              </Text>
              <View style={styles.emptyActions}>
                <Pressable 
                  style={[styles.emptyButton, { backgroundColor: COLORS.green }]}
                  onPress={() => router.push('/(tabs)/income/add')}
                >
                  <Text style={styles.emptyButtonText}>+ Add Income</Text>
                </Pressable>
                <Pressable 
                  style={[styles.emptyButton, { backgroundColor: COLORS.red }]}
                  onPress={() => router.push('/(tabs)/expense/add')}
                >
                  <Text style={styles.emptyButtonText}>- Add Expense</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 18, gap: 16 },
  header: { gap: 6, marginBottom: 8 },
  backButton: { alignSelf: 'flex-start', marginBottom: 8 },
  backButtonText: { color: COLORS.green, fontSize: 16, fontWeight: '700' },
  title: { color: COLORS.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: COLORS.muted, fontSize: 14 },
  
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.panel2,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  rangeButtonActive: {
    backgroundColor: COLORS.green,
  },
  rangeButtonText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  rangeButtonTextActive: {
    color: COLORS.bg,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  emptyState: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  emptyIcon: { fontSize: 64 },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});