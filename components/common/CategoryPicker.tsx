// components/common/CategoryPicker.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, ScrollView } from 'react-native';
import { type ThemeColors } from '@/constants/Colors';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  
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
  arrow: {
    color: colors.muted,
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
    backgroundColor: colors.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    color: colors.text,
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
    backgroundColor: colors.panel2,
  },
  optionText: {
    color: colors.text,
    fontSize: 15,
  },
  optionTextSelected: {
    fontWeight: '700',
    color: colors.green,
  },
  checkmark: {
    color: colors.green,
    fontSize: 18,
    fontWeight: '800',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
