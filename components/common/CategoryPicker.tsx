// components/common/CategoryPicker.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, ScrollView } from 'react-native';
import { COLORS } from '@/constants/Colors';

type CategoryPickerProps = {
  mode: 'Income' | 'Expense';
  value: string;
  onChange: (category: string) => void;
  error?: string;
};

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Gift',
  'Bonus',
  'Other Income',
];

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Insurance',
  'Other Expense',
];

export function CategoryPicker({ mode, value, onChange, error }: CategoryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const categories = mode === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSelect = (category: string) => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={[styles.picker, error ? styles.pickerError : null]}
      >
        <Text style={value ? styles.pickerText : styles.pickerPlaceholder}>
          {value || `Select ${mode === 'Income' ? 'income' : 'expense'} category`}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <ScrollView style={styles.optionsList}>
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => handleSelect(cat)}
                  style={[
                    styles.option,
                    value === cat ? styles.optionSelected : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === cat ? styles.optionTextSelected : null,
                    ]}
                  >
                    {cat}
                  </Text>
                  {value === cat && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              onPress={() => setIsOpen(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
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
  arrow: {
    color: COLORS.muted,
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: COLORS.panel2,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 15,
  },
  optionTextSelected: {
    fontWeight: '700',
    color: COLORS.green,
  },
  checkmark: {
    color: COLORS.green,
    fontSize: 18,
    fontWeight: '800',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
});