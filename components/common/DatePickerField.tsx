// components/common/DatePickerField.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '@/constants/Colors';

type DatePickerFieldProps = {
  value: string; // ISO date string YYYY-MM-DD
  onChange: (date: string) => void;
  error?: string;
};

export function DatePickerField({ value, onChange, error }: DatePickerFieldProps) {
  const [show, setShow] = useState(false);

  const dateValue = value ? new Date(value) : new Date();

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    }
  };

  const formattedDate = value
    ? new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Select date';

  return (
    <View>
      <Pressable
        onPress={() => setShow(true)}
        style={[styles.picker, error ? styles.pickerError : null]}
      >
        <Text style={value ? styles.pickerText : styles.pickerPlaceholder}>
          {formattedDate}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerError: {
    borderColor: COLORS.red,
  },
  pickerText: {
    color: COLORS.text,
    fontSize: 14,
  },
  pickerPlaceholder: {
    color: COLORS.muted,
    fontSize: 14,
  },
  icon: {
    fontSize: 18,
  },
});