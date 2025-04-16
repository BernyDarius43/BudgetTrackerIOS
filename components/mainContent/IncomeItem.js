// components/IncomeItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { dateFormat } from '../utils/dateFormat';
import { dollar, calender, comment } from '../utils/Icons';
import Button from './Button';

const IncomeItem = ({ income, onDelete, onEdit }) => {
  const { id, title, amount, date, description } = income;

  const handleDelete = () => {
    onDelete(id);
  };

  const handleEdit = () => {
    onEdit(income);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amount}>{dollar} {amount}</Text>
        <Text style={styles.meta}>{calender} {dateFormat(date)}</Text>
        <Text style={styles.meta}>{comment} {description}</Text>
      </View>
      <View style={styles.actions}>
        <Button name="Edit" onPress={handleEdit} />
        <Button name="Delete" onPress={handleDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCF6F9',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 15
  },
  content: {
    marginBottom: 12
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  amount: {
    color: '#00b894',
    fontSize: 16,
    marginBottom: 4
  },
  meta: {
    fontSize: 14,
    color: '#999'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  }
});

export default IncomeItem;
