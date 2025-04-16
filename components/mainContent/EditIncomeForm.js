// components/EditIncomeForm.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';
import FormField from './FormField';
import DatePickerField from './DatePickerField';
import Button from './Button';

const EditIncomeForm = ({ income, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState({ ...income });
  
  useEffect(() => {
    setFormState({ ...income });
  }, [income]);

  const handleChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { title, amount, category, description, date } = formState;
    if (!title || !amount || !category || !description || !date) {
      alert("All fields are required.");
      return;
    }
    onSubmit(formState);
  };

  return (
    <View style={styles.form}>
      <FormField 
        label="Title" 
        value={formState.title} 
        onChangeText={text => handleChange('title', text)}
        placeholder="Title" 
      />
      <FormField 
        label="Amount" 
        value={String(formState.amount)} 
        onChangeText={text => handleChange('amount', text)}
        placeholder="Amount"
        keyboardType="numeric"
      />
      <FormField 
        label="Description" 
        value={formState.description} 
        onChangeText={text => handleChange('description', text)}
        placeholder="Description"
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={formState.category}
          onValueChange={value => handleChange('category', value)}
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
        date={new Date(formState.date)} 
        onDateChange={selectedDate => handleChange('date', selectedDate)}
      />
      <View style={styles.buttonRow}>
        <Button name="Update" onPress={handleSubmit} />
        <Button name="Cancel" onPress={onCancel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  }
});

export default EditIncomeForm;
