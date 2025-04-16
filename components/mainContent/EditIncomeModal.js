// components/EditIncomeModal.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Button as RNButton
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Button from './Button';
import { useIncomeContext } from '../context/incomeContext';

const EditIncomeModal = ({ income, closeModal }) => {
  const { updateIncome } = useIncomeContext();
  const [formState, setFormState] = useState({ ...income });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setFormState({ ...income });
  }, [income]);

  const handleChange = (name, value) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { title, amount, category, description, date, _id } = formState;
    if (!title || !amount || !category || !description) {
      alert('All fields required.');
      return;
    }

    const payload = {
      title,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date).toISOString()
    };

    try {
      const result = await updateIncome(_id, payload);
      if (result?.status === 200) {
        closeModal();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

//   🧩 Usage (inside EditIncomeModal.js)
// Replace inline logic with:
    {/* <EditIncomeForm
        income={selectedIncome}
        onSubmit={handleUpdate}
        onCancel={closeModal}
    />
 */}
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Income</Text>

          <TextInput
            style={styles.input}
            value={formState.title}
            onChangeText={val => handleChange('title', val)}
            placeholder="Title"
          />

          <TextInput
            style={styles.input}
            value={String(formState.amount)}
            onChangeText={val => handleChange('amount', val)}
            keyboardType="numeric"
            placeholder="Amount"
          />

          <TextInput
            style={styles.input}
            value={formState.description}
            onChangeText={val => handleChange('description', val)}
            placeholder="Description"
          />

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

          <RNButton
            title={`Date: ${new Date(formState.date).toDateString()}`}
            onPress={() => setShowDatePicker(true)}
          />

          {showDatePicker && (
            <DateTimePicker
              value={new Date(formState.date)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                handleChange('date', selectedDate);
              }}
            />
          )}

          <View style={styles.buttons}>
            <Button name="Update" onPress={handleSubmit} />
            <Button name="Cancel" onPress={closeModal} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: '600'
  },
  input: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginBottom: 12
  },
  picker: {
    height: 50,
    marginBottom: 12
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20
  }
});

export default EditIncomeModal;
