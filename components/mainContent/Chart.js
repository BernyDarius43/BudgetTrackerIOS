// components/Chart.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import { useIncomeContext } from '../context/incomeContext';
import { useGlobalContext } from '../context/globalContext';

const Chart = () => {
  const { incomes } = useIncomeContext();
  const { expenses } = useGlobalContext();

  const incomeTotal = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const expenseTotal = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const chartData = [
    { x: 'Income', y: incomeTotal },
    { x: 'Expenses', y: expenseTotal }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Income vs Expenses</Text>
      <VictoryPie
        data={chartData}
        colorScale={['#4caf50', '#f44336']}
        innerRadius={50}
        labelRadius={80}
        style={{
          labels: { fontSize: 16, fill: '#333' }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  }
});

export default Chart;
