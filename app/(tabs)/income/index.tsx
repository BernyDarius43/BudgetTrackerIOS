// app/(tabs)/income/index.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useIncomeContext } from '@/context/IncomeContext';
import { type ThemeColors } from '@/constants/Colors';
import { formatMoney, formatDate } from '@/utils/formatters';
import { TransactionRow } from '@/components/common/TransactionRow';
import { TransactionCard } from '@/components/common/TransactionCard';
import { SortSheet } from '@/components/common/SortSheet';
import { FilterSheet, hasActiveFilters } from '@/components/common/FilterSheet';
import { useTransactionControls } from '@/hooks/useTransactionControls';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Investment',
  'Gift', 'Bonus', 'Other Income',
];

type ViewMode = 'list' | 'card';

export default function IncomeScreen() {
  const router = useRouter();
  const { totalIncome, incomes, getAllIncomes } = useIncomeContext();
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => { getAllIncomes(); }, []);

  const {
    grouped,
    processed,
    sortOption,
    setSortOption,
    filters,
    setFilters,
    sortSheetOpen,
    setSortSheetOpen,
    filterSheetOpen,
    setFilterSheetOpen,
  } = useTransactionControls(incomes);

  const total = totalIncome ? totalIncome() : 0;
  const filtersActive = hasActiveFilters(filters);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Income</Text>
          </View>

          {/* Total Card */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Income</Text>
            <Text style={[styles.totalAmount, { color: colors.green }]}>
              {formatMoney(total)} CAD
            </Text>
          </View>

          {/* Add Button */}
          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/(tabs)/income/add')}
          >
            <Text style={styles.addButtonText}>+ Add Income</Text>
          </Pressable>

          {/* Section header + controls */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>All Income</Text>
              <Text style={styles.count}>
                {processed.length} of {incomes.length} entries
              </Text>
            </View>

            <View style={styles.controls}>
              {/* Sort */}
              <Pressable
                style={styles.controlBtn}
                onPress={() => setSortSheetOpen(true)}
              >
                <Ionicons name="swap-vertical-outline" size={18} color={colors.text} />
              </Pressable>

              {/* Filter */}
              <Pressable
                style={[styles.controlBtn, filtersActive && styles.controlBtnActive]}
                onPress={() => setFilterSheetOpen(true)}
              >
                <Ionicons
                  name="options-outline"
                  size={18}
                  color={filtersActive ? colors.green : colors.text}
                />
                {filtersActive && <View style={styles.filterDot} />}
              </Pressable>

              {/* View toggle */}
              <View style={styles.viewToggle}>
                <Pressable
                  onPress={() => setViewMode('list')}
                  style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
                >
                  <Ionicons name="list-outline" size={18} color={viewMode === 'list' ? colors.green : colors.muted} />
                </Pressable>
                <Pressable
                  onPress={() => setViewMode('card')}
                  style={[styles.toggleBtn, viewMode === 'card' && styles.toggleBtnActive]}
                >
                  <Ionicons name="grid-outline" size={18} color={viewMode === 'card' ? colors.green : colors.muted} />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Transactions */}
          {processed.length > 0 ? (
            viewMode === 'list' ? (
              <View style={styles.listContainer}>
                {grouped.map(([dateLabel, items]) => (
                  <View key={dateLabel}>
                    <Text style={styles.dateHeader}>{dateLabel}</Text>
                    {items.map((income) => (
                      <TransactionRow
                        key={income._id}
                        item={{ ...income, type: 'Income' }}
                        timeLabel={new Date(income.date).toLocaleTimeString('default', {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      />
                    ))}
                  </View>
                ))}
              </View>
            ) : (
              <View>
                {processed.map((income) => (
                  <TransactionCard
                    key={income._id}
                    item={{ ...income, type: 'Income' }}
                    timeLabel={formatDate(income.date)}
                  />
                ))}
              </View>
            )
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cash-outline" size={48} color={colors.muted} />
              <Text style={styles.emptyText}>
                {hasActiveFilters(filters) ? 'No results match your filters' : 'No income entries yet'}
              </Text>
              {hasActiveFilters(filters) && (
                <Pressable onPress={() => setFilters({ dateFrom: '', dateTo: '', amountMin: '', amountMax: '', category: '' })}>
                  <Text style={styles.clearFilters}>Clear filters</Text>
                </Pressable>
              )}
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>

      {/* Sort sheet */}
      <SortSheet
        visible={sortSheetOpen}
        selected={sortOption}
        onSelect={setSortOption}
        onClose={() => setSortSheetOpen(false)}
      />

      {/* Filter sheet */}
      <FilterSheet
        visible={filterSheetOpen}
        current={filters}
        categories={INCOME_CATEGORIES}
        onApply={setFilters}
        onClose={() => setFilterSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 18, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  totalCard: {
    backgroundColor: colors.panel, borderWidth: 1,
    borderColor: colors.line, borderRadius: 18, padding: 20,
  },
  totalLabel: { color: colors.muted, fontSize: 13, marginBottom: 8 },
  totalAmount: { fontSize: 32, fontWeight: '900' },
  addButton: { backgroundColor: colors.green, padding: 16, borderRadius: 14, alignItems: 'center' },
  addButtonText: { color: colors.bg, fontSize: 16, fontWeight: '800' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 8,
  },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  count: { color: colors.muted, fontSize: 12, marginTop: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  controlBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  controlBtnActive: { borderColor: colors.green },
  filterDot: {
    position: 'absolute', top: 6, right: 6,
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: colors.green,
  },
  viewToggle: {
    flexDirection: 'row', backgroundColor: colors.panel,
    borderWidth: 1, borderColor: colors.line,
    borderRadius: 10, overflow: 'hidden',
  },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  toggleBtnActive: { backgroundColor: colors.panel2 },
  listContainer: {
    borderRadius: 18, overflow: 'hidden',
    backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line,
  },
  dateHeader: {
    color: colors.muted, fontSize: 11, fontWeight: '700',
    letterSpacing: 0.8, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4,
  },
  emptyState: {
    padding: 32, alignItems: 'center', gap: 12,
    backgroundColor: colors.panel2, borderWidth: 1,
    borderColor: colors.line, borderRadius: 18,
  },
  emptyText: { color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  clearFilters: { color: colors.green, fontSize: 14, fontWeight: '700' },
});
