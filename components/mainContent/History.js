// components/History.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useIncomeContext } from '../context/incomeContext';

const History = () => {
  const { expenses } = useGlobalContext();
  const { incomes } = useIncomeContext();

  const history = [...incomes, ...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); // Show only last 5 entries

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={item.type === 'expense' ? styles.expense : styles.income}>
        ${item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recent History</Text>
      {history.length === 0 ? (
        <Text style={styles.empty}>No history available</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  title: {
    fontSize: 16
  },
  income: {
    color: '#2ecc71',
    fontWeight: 'bold'
  },
  expense: {
    color: '#e74c3c',
    fontWeight: 'bold'
  },
  empty: {
    fontStyle: 'italic',
    color: '#999'
  }
});

export default History;


// ✅ Where to Use?
// Anywhere on your dashboard screen:


// import History from '../components/History';
// ...
// <History />
