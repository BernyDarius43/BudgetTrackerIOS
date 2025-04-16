// app/(tabs)/dashboard/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGlobalContext } from '@/context/GlobalContext';

const Dashboard = () => {
  const { totalBalance } = useGlobalContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.balance}>
        Total Balance: ${totalBalance ? totalBalance().toFixed(2) : '0.00'}
      </Text>

      {/* Placeholder for upcoming widgets */}
      {/* <Chart /> */}
      {/* <RecentTransactions /> */}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balance: {
    fontSize: 20,
    color: 'green',
  },
});
