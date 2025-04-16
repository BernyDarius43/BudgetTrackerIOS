// components/FormIncome.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';
import FormField from './FormField';
import DatePickerField from './DatePickerField';
import Button from './Button';
import { useIncomeContext } from '../context/incomeContext';
import { useAuth } from '../context/authContext';

const FormIncome = () => {
  const { addIncome, error } = useIncomeContext();
  const { currentUser } = useAuth();
  
  const [inputState, setInputState] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
  });
  const [date, setDate] = useState(new Date());

  const handleInputChange = (name, value) => {
    setInputState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { title, amount, category, description } = inputState;
    const firebaseUid = currentUser?.uid;

    const newIncome = {
      firebaseUid,
      title,
      amount: parseFloat(amount),
      date: date.toISOString(),
      category,
      description
    };

    try {
      await addIncome(newIncome);
      setInputState({ title: '', amount: '', category: '', description: '' });
      setDate(new Date());
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      <FormField 
        label="Title" 
        value={inputState.title} 
        onChangeText={text => handleInputChange('title', text)}
        placeholder="Title"
      />
      <FormField 
        label="Amount" 
        value={inputState.amount} 
        onChangeText={text => handleInputChange('amount', text)}
        placeholder="Amount"
        keyboardType="numeric"
      />
      <FormField 
        label="Description" 
        value={inputState.description} 
        onChangeText={text => handleInputChange('description', text)}
        placeholder="Description"
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={inputState.category}
          onValueChange={value => handleInputChange('category', value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Salary" value="salary" />
          <Picker.Item label="Freelancing" value="freelancing" />
          <Picker.Item label="Investments" value="investments" />
          <Picker.Item label="Stocks" value="stocks" />
          <Picker.Item label="Bitcoin" value="bitcoin" />
          <Picker.Item label="Bank Transfer" value="bank" />
          <Picker.Item label="Youtube" value="youtube" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>
      <DatePickerField 
        label="Date" 
        date={date} 
        onDateChange={setDate}
      />
      <Button name="Add Income" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
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
    fontWeight: 'bold'
  }
});

export default FormIncome;