// components/ExpenseForm.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FormField from './FormField';
import DatePickerField from './DatePickerField';
import Button from './Button';
import { useGlobalContext } from '../context/globalContext';

const ExpenseForm = () => {
  const { addExpense, error, setError } = useGlobalContext();
  const [inputState, setInputState] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
  });
  const [date, setDate] = useState(new Date());

  const handleInputChange = (name, value) => {
    setInputState(prev => ({ ...prev, [name]: value }));
    if (setError) setError('');
  };

  const handleSubmit = () => {
    const { title, amount, category, description } = inputState;
    if (!title || !amount || !category || !description) {
      Alert.alert("Validation", "All fields are required.");
      return;
    }
    const expense = {
      title,
      amount: parseFloat(amount),
      category,
      description,
      date: date.toISOString(),
    };
    addExpense(expense);
    setInputState({
      title: '',
      amount: '',
      category: '',
      description: '',
    });
    setDate(new Date());
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FormField
        label="Expense Title"
        value={inputState.title}
        onChangeText={text => handleInputChange('title', text)}
        placeholder="Enter Expense Title"
      />
      <FormField
        label="Expense Amount"
        value={inputState.amount}
        onChangeText={text => handleInputChange('amount', text)}
        placeholder="Enter Expense Amount"
        keyboardType="numeric"
      />
      <FormField
        label="Description"
        value={inputState.description}
        onChangeText={text => handleInputChange('description', text)}
        placeholder="Enter a description"
        multiline
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={inputState.category}
          onValueChange={value => handleInputChange('category', value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Education" value="education" />
          <Picker.Item label="Groceries" value="groceries" />
          <Picker.Item label="Health" value="health" />
          <Picker.Item label="Subscriptions" value="subscriptions" />
          <Picker.Item label="Takeaways" value="takeaways" />
          <Picker.Item label="Clothing" value="clothing" />
          <Picker.Item label="Travelling" value="travelling" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>
      <DatePickerField
        label="Date"
        date={date}
        onDateChange={setDate}
      />
      <Button name="Add Expense" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 16,
  },
  picker: {
    height: 50,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontWeight: 'bold',
  },
});

export default ExpenseForm;
