// app/(tabs)/expense/index.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useExpenseContext } from '@/context/ExpenseContext';
import { COLORS } from '@/constants/Colors';
import { formatMoney } from '@/utils/formatters';
import { formatDate } from '@/utils/formatters';
import { TransactionRow } from '@/components/common/TransactionRow';

export default function ExpenseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { totalExpenses, expenses, getExpenses } = useExpenseContext();

  useEffect(() => {
    getExpenses();
  }, []);

  const total = totalExpenses ? totalExpenses() : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
    <View style={styles.safe}>
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Expenses</Text>
        </View>

        {/* Total Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Expenses</Text>
          <Text style={[styles.totalAmount, { color: COLORS.red }]}>
            -{formatMoney(total)}
          </Text>
        </View>

        {/* Add Button */}
        <Pressable 
          style={[styles.addButton, { backgroundColor: COLORS.red }]}
          onPress={() => {
            console.log('Add expense');
            router.push('/(tabs)/expense/add');
          }}
        >
          <Text style={styles.addButtonText}>+ Add Expense</Text>
        </Pressable>

        {/* Transactions List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Expenses</Text>
          <Text style={styles.count}>{expenses.length} entries</Text>
        </View>

        <View style={styles.txPanel}>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <TransactionRow
                key={expense._id}
                item={{ ...expense, type: 'Expense' }}
                timeLabel={formatDate(expense.createdAt)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubtext}>
                Tap "Add Expense" to record your first entry
              </Text>
            </View>
          )}
        </View>

        {/* Bottom spacer */}
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
    alignItems: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
  },
  totalCard: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    padding: 20,
  },
  totalLabel: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '900',
  },
  addButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  count: {
    color: COLORS.muted,
    fontSize: 13,
  },
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
});