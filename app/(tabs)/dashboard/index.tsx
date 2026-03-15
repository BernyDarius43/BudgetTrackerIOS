// app/(tabs)/dashboard/index.tsx
import React, { useEffect, useCallback } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { formatBalance } from '@/utils/formatters';
import { formatDate } from '@/utils/formatters';
import { MiniLineChart } from '@/components/common/MiniLineChart';
import { TransactionRow } from '@/components/common/TransactionRow';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useIncomeContext } from '@/context/IncomeContext';
import { useExpenseContext } from '@/context/ExpenseContext';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getAllIncomes } = useIncomeContext();
  const { getExpenses } = useExpenseContext();
  
  const { totalBalance, recentTransactions, chartValues, changeFromLastMonth, isEmpty } = useDashboardData();

  useFocusEffect(
  useCallback(() => {
/*     First visit uses bootstrapped data

Subsequent visits refresh normally */
     if (isEmpty) {
      getAllIncomes();
      getExpenses();
    }
  }, [getAllIncomes, getExpenses, isEmpty])
);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
    <View style={styles.safe}>
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
  <Text style={styles.muted}>Total balance</Text>
  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
    <Text style={styles.balance}>
      {formatBalance(totalBalance)}
    </Text>
    <View style={styles.pill}>
      <Text style={styles.pillText}>
        {changeFromLastMonth >= 0 ? "+" : ""}
        ${Math.abs(changeFromLastMonth).toFixed(0)}
      </Text>
    </View>
  </View>
  <Text style={[styles.muted, { fontSize: 11, marginTop: 4 }]}>
    {changeFromLastMonth >= 0 ? "Up" : "Down"} from last month
  </Text>
</View>

        </View>

        {/* Chart */}
<Pressable onPress={() => router.push('/(tabs)/dashboard/chart')}>
  <MiniLineChart values={chartValues} />
  <Text style={[styles.link, { textAlign: 'center', marginTop: 8 }]}>
    Tap to see full trend →
  </Text>
</Pressable>
        {/* Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Pressable onPress={() => router.push('/(tabs)/dashboard/all-transactions' as any)}>
            <Text style={styles.link}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.txPanel}>
          {!isEmpty? (
            recentTransactions.map((tx) => (
              <TransactionRow 
                key={tx._id} 
                item={tx}
                timeLabel={formatDate(tx.createdAt)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first income or expense to get started
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <Pressable 
            style={[styles.actionBtn, { backgroundColor: COLORS.green }]}
            onPress={() => router.push('/(tabs)/income')}
          >
            <Text style={styles.actionText}>+ Income</Text>
          </Pressable>
          <Pressable 
            style={[styles.actionBtn, { backgroundColor: COLORS.red }]}
            onPress={() => router.push('/(tabs)/expense')}
          >
            <Text style={styles.actionText}>- Expense</Text>
          </Pressable>
        </View>

        {/* Bottom spacer for tab bar */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 18, gap: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  muted: { color: COLORS.muted, fontSize: 13 },
  balance: { color: COLORS.text, fontSize: 28, fontWeight: '800' },
  balanceNegative: { color: COLORS.red, fontSize: 28, fontWeight: '800' },
  pill: {
    backgroundColor: COLORS.pillBg,
    borderColor: COLORS.pillBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: { color: COLORS.green, fontWeight: '700', fontSize: 12 },
  sectionHeader: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800' },
  link: { color: COLORS.green, fontWeight: '700' },
  txPanel: {
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    paddingVertical: 6,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtext: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  actionText: {
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: '800',
  },
});