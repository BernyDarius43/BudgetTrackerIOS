// app/(tabs)/expense/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useExpenseContext } from '@/context/ExpenseContext';

const ExpenseScreen = () => {
  const { totalExpenses, expenses } = useExpenseContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Expenses</Text>

      <Text style={styles.total}>
        Total Expenses: ${totalExpenses ? totalExpenses().toFixed(2) : '0.00'}
      </Text>

      {expenses.length === 0 && (
        <Text style={styles.empty}>No expenses yet.</Text>
      )}

      {expenses.map((expense: { _id: React.Key | null | undefined; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
        <View key={expense._id} style={styles.item}>
          <Text style={styles.itemTitle}>{expense.title}</Text>
          <Text style={styles.itemAmount}>${expense.amount}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  total: { fontSize: 20, color: 'red', marginBottom: 16 },
  item: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  itemTitle: { fontSize: 16 },
  itemAmount: { fontSize: 16, fontWeight: 'bold' },
  empty: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});

export default ExpenseScreen;
