// app/(tabs)/dashboard/all-transactions.tsx
import React, { useMemo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet,
  SectionList, Pressable,
  SectionListRenderItemInfo,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { type ThemeColors } from '@/constants/Colors';
import { formatMoney } from '@/utils/formatters';
import { useAllTransactions, MergedTransaction } from '@/hooks/useAllTransactions';
import { groupTransactions, TimeRange, TransactionSection } from '@/utils/groupTransactions';
import { getCategoryIcon } from '@/constants/categoryIcons';
import { SortSheet } from '@/components/common/SortSheet';
import { FilterSheet, hasActiveFilters, EMPTY_FILTER } from '@/components/common/FilterSheet';
import { useTransactionControls } from '@/hooks/useTransactionControls';
import { useThemeColors } from '@/hooks/useThemeColors';

type ViewMode = 'list' | 'card';

const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: '1M', label: '1M' },
  { key: '3M', label: '3M' },
  { key: '6M', label: '6M' },
  { key: '1Y', label: '1Y' },
  { key: 'All', label: 'All' },
];

const ALL_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Bonus', 'Other Income',
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Insurance', 'Other Expense',
];

// ─── KOHO List Row ─────────────────────────────────────────────────────────────

function ListRow({ item }: { item: MergedTransaction }) {
  const router = useRouter();
  const colors = useThemeColors();
  const listRowStyles = useMemo(() => createListRowStyles(colors), [colors]);
  const icon = getCategoryIcon(item.category);
  const isIncome = item.type === 'Income';
  const amountColor = isIncome ? colors.green : colors.red;
  const amountPrefix = isIncome ? '+' : '-';
  const timeStr = new Date(item.date).toLocaleTimeString('default', {
    hour: '2-digit', minute: '2-digit',
  });

  const handlePress = () => {
    if (item.type === 'Income') {
      router.push(`/(tabs)/income/${item._id}`);
    } else {
      router.push(`/(tabs)/expense/${item._id}`);
    }
  };

  return (
    <Pressable onPress={handlePress} style={listRowStyles.row}>
      <View style={[listRowStyles.iconSquare, { backgroundColor: icon.color }]}>
        <Ionicons name={icon.name as any} size={20} color="#fff" />
      </View>
      <View style={listRowStyles.textBlock}>
        <Text style={listRowStyles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={listRowStyles.subtitle}>{timeStr} · {item.category}</Text>
      </View>
      <Text style={[listRowStyles.amount, { color: amountColor }]}>
        {amountPrefix}{formatMoney(Math.abs(item.amount))} $
      </Text>
    </Pressable>
  );
}

const createListRowStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    gap: 14, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  iconSquare: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  textBlock: { flex: 1, gap: 3 },
  title: { color: colors.text, fontSize: 15, fontWeight: '700' },
  subtitle: { color: colors.muted, fontSize: 12 },
  amount: { fontSize: 15, fontWeight: '800' },
});

// ─── Card Tile ─────────────────────────────────────────────────────────────────

function CardTile({ item }: { item: MergedTransaction }) {
  const router = useRouter();
  const colors = useThemeColors();
  const cardStyles = useMemo(() => createCardStyles(colors), [colors]);
  const icon = getCategoryIcon(item.category);
  const isIncome = item.type === 'Income';
  const accentColor = isIncome ? colors.green : colors.red;
  const amountPrefix = isIncome ? '+' : '-';
  const dateStr = new Date(item.date).toLocaleDateString('default', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const handlePress = () => {
    if (item.type === 'Income') {
      router.push(`/(tabs)/income/${item._id}`);
    } else {
      router.push(`/(tabs)/expense/${item._id}`);
    }
  };

  return (
    <Pressable onPress={handlePress} style={[cardStyles.card, { borderLeftColor: accentColor }]}>
      <View style={cardStyles.topRow}>
        <View style={[cardStyles.iconSquare, { backgroundColor: icon.color }]}>
          <Ionicons name={icon.name as any} size={22} color="#fff" />
        </View>
        <View style={cardStyles.titleBlock}>
          <Text style={cardStyles.title} numberOfLines={1}>{item.title}</Text>
          <View style={cardStyles.metaRow}>
            <View style={[cardStyles.badge, { backgroundColor: icon.color + '22' }]}>
              <Text style={[cardStyles.badgeText, { color: icon.color }]}>{item.category}</Text>
            </View>
            <View style={[cardStyles.badge, { backgroundColor: accentColor + '22' }]}>
              <Text style={[cardStyles.badgeText, { color: accentColor }]}>{item.type}</Text>
            </View>
          </View>
        </View>
        <Text style={[cardStyles.amount, { color: accentColor }]}>
          {amountPrefix}{formatMoney(Math.abs(item.amount))} CAD
        </Text>
      </View>
      <View style={cardStyles.bottomRow}>
        <Text style={cardStyles.date}>{dateStr}</Text>
        {!!item.description && (
          <Text style={cardStyles.description} numberOfLines={1}>{item.description}</Text>
        )}
      </View>
    </Pressable>
  );
}

const createCardStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line,
    borderRadius: 14, borderLeftWidth: 4, padding: 14,
    marginHorizontal: 16, marginVertical: 6, gap: 10,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconSquare: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  titleBlock: { flex: 1, gap: 6 },
  title: { color: colors.text, fontSize: 15, fontWeight: '800' },
  metaRow: { flexDirection: 'row', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  amount: { fontSize: 14, fontWeight: '800' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { color: colors.muted, fontSize: 12 },
  description: { color: colors.muted, fontSize: 12, maxWidth: '60%', textAlign: 'right' },
});

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function AllTransactionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { transactions } = useAllTransactions();

  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Step 1 — range filter (time tabs)
  const rangeFiltered = useMemo(
    () => groupTransactions(transactions, selectedRange).flatMap((s) => s.data),
    [transactions, selectedRange]
  );

  // Step 2 — sort + filter controls on top of range-filtered data
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
  } = useTransactionControls(rangeFiltered);

  // Rebuild sections from grouped output for SectionList
  const sections: TransactionSection[] = useMemo(
    () => grouped.map(([title, data]) => ({ title, data })),
    [grouped]
  );

  const filtersActive = hasActiveFilters(filters);

  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<MergedTransaction>) =>
      viewMode === 'card' ? <CardTile item={item} /> : <ListRow item={item} />,
    [viewMode]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: TransactionSection }) =>
      viewMode === 'list' ? (
        <Text style={styles.dateHeader}>{section.title.toUpperCase()}</Text>
      ) : (
        <View style={styles.cardSectionHeader}>
          <Text style={styles.cardSectionTitle}>{section.title}</Text>
          <Text style={styles.sectionCount}>
            {section.data.length} transaction{section.data.length !== 1 ? 's' : ''}
          </Text>
        </View>
      ),
    [viewMode]
  );

  const ListEmpty = (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={48} color={colors.muted} />
      <Text style={styles.emptyText}>
        {filtersActive ? 'No results match your filters' : 'No transactions found'}
      </Text>
      {filtersActive ? (
        <Pressable onPress={() => setFilters(EMPTY_FILTER)}>
          <Text style={styles.clearFilters}>Clear filters</Text>
        </Pressable>
      ) : (
        <Text style={styles.emptySubtext}>Try selecting a wider time range</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.green} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          All Transactions
        </Text>


      </View>

      {/* Time Range Tabs */}
      <View style={styles.rangeTabs}>
        {TIME_RANGES.map(({ key, label }) => (
          <Pressable
            key={key}
            onPress={() => setSelectedRange(key)}
            style={[styles.rangeTab, selectedRange === key && styles.rangeTabActive]}
          >
            <Text style={[styles.rangeTabText, selectedRange === key && styles.rangeTabTextActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      
      <View style={styles.controls}>
          {/* Sort */}
          <Pressable style={styles.controlBtn} onPress={() => setSortSheetOpen(true)}>
            <Ionicons name="swap-vertical-outline" size={18} color={colors.text} />
          </Pressable>

          {/* Filter */}
          <Pressable
            style={[styles.controlBtn, filtersActive && styles.controlBtnActive]}
            onPress={() => setFilterSheetOpen(true)}
          >
            <Ionicons name="options-outline" size={18} color={filtersActive ? colors.green : colors.text} />
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

      {/* Count row */}
      <Text style={styles.countRow}>
        {processed.length} transaction{processed.length !== 1 ? 's' : ''}
        {filtersActive ? ' (filtered)' : ''}
      </Text>

      {/* Transaction SectionList */}
      <SectionList<MergedTransaction, TransactionSection>
        sections={sections}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={[
          viewMode === 'list'
            ? { marginHorizontal: 16, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 18, overflow: 'hidden' }
            : { paddingTop: 4 },
          { paddingBottom: insets.bottom + 24 },
        ]}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      <SortSheet
        visible={sortSheetOpen}
        selected={sortOption}
        onSelect={setSortOption}
        onClose={() => setSortSheetOpen(false)}
      />

      <FilterSheet
        visible={filterSheetOpen}
        current={filters}
        categories={ALL_CATEGORIES}
        onApply={setFilters}
        onClose={() => setFilterSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backText: { color: colors.green, fontWeight: '700', fontSize: 15 },
  headerTitle: {
  color: colors.text,
  fontSize: 18,
  fontWeight: '800',
  position: 'absolute',
  left: 0,
  right: 0,
  textAlign: 'center',
  zIndex: -1, // sits behind the pressable buttons so they stay tappable
},
  controls: {paddingHorizontal: 16, gap: 8, marginBottom: 4, flexDirection: 'row-reverse', alignItems: 'flex-end', borderRadius: 10 },
  controlBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  controlBtnActive: { borderColor: colors.green },
  filterDot: {
    position: 'absolute', top: 5, right: 5,
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
  rangeTabs: {
    flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4,
  },
  rangeTab: {
    flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center',
    backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line,
  },
  rangeTabActive: { backgroundColor: colors.green, borderColor: colors.green },
  rangeTabText: { color: colors.muted, fontWeight: '700', fontSize: 13 },
  rangeTabTextActive: { color: colors.bg },
  countRow: {
    color: colors.muted, fontSize: 12,
    paddingHorizontal: 20, paddingBottom: 8,
  },
  dateHeader: {
    color: colors.muted, fontSize: 11, fontWeight: '700',
    letterSpacing: 0.8, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4,
  },
  cardSectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8,
  },
  cardSectionTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  sectionCount: { color: colors.muted, fontSize: 12 },
  emptyState: {
    margin: 16, padding: 32, alignItems: 'center', gap: 12,
    backgroundColor: colors.panel2, borderWidth: 1,
    borderColor: colors.line, borderRadius: 18,
  },
  emptyText: { color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  emptySubtext: { color: colors.muted, fontSize: 13 },
  clearFilters: { color: colors.green, fontSize: 14, fontWeight: '700' },
});
