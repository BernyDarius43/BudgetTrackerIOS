// app/(tabs)/income/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useIncomeContext } from '@/context/IncomeContext';

const IncomeScreen = () => {
  const { totalIncome, incomes } = useIncomeContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Income</Text>

      <Text style={styles.total}>
        Total Income: ${totalIncome ? totalIncome().toFixed(2) : '0.00'}
      </Text>

      {incomes.length === 0 && (
        <Text style={styles.empty}>No income entries yet.</Text>
      )}

      {incomes.map((income: { _id: React.Key | null | undefined; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
        <View key={income._id} style={styles.item}>
          <Text style={styles.itemTitle}>{income.title}</Text>
          <Text style={styles.itemAmount}>${income.amount}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  total: { fontSize: 20, color: 'green', marginBottom: 16 },
  item: { marginBottom: 12, padding: 12, backgroundColor: '#F0F0F0', borderRadius: 8 },
  itemTitle: { fontSize: 16 },
  itemAmount: { fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 20 },
});

export default IncomeScreen;
