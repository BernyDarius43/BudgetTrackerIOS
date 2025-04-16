// components/MainContent.js
import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import FormIncome from './FormIncome';
import IncomeItem from './IncomeItem';
import { useIncomeContext } from '../context/incomeContext';
import { useAuth } from '../context/authContext/authContext';

const MainContent = () => {
  const { incomes, getAllIncomes, deleteIncome, totalIncome } = useIncomeContext();
  const { userLoggedIn, authMongoUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (userLoggedIn && authMongoUser) {
        await getAllIncomes();
      }
    };
    fetchData();
  }, [userLoggedIn, authMongoUser]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Total Income: <Text style={styles.total}>${totalIncome()}</Text></Text>

      <FormIncome />

      <View style={styles.list}>
        {incomes.map(income => (
          <IncomeItem
            key={income._id}
            income={income}
            onDelete={deleteIncome}
            onEdit={() => {}}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16
  },
  total: {
    color: 'green',
    fontSize: 24
  },
  list: {
    marginTop: 16,
    gap: 12
  }
});

export default MainContent;
