// components/common/DatePickerField.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { type ThemeColors } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useThemeColors';

type DatePickerFieldProps = {
  value: string; // ISO date string YYYY-MM-DD
  onChange: (date: string) => void;
  error?: string;
};

export function DatePickerField({ value, onChange, error }: DatePickerFieldProps) {
  const [show, setShow] = useState(false);
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  picker: {
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerError: {
    borderColor: colors.red,
  },
  pickerText: {
    color: colors.text,
    fontSize: 14,
  },
  pickerPlaceholder: {
    color: colors.muted,
    fontSize: 14,
  },
  icon: {
    fontSize: 18,
  },
});
