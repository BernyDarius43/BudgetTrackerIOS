// components/common/SortSheet.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

export type SortOption =
  | 'date_desc'
  | 'date_asc'
  | 'amount_desc'
  | 'amount_asc';

type SortSheetProps = {
  visible: boolean;
  selected: SortOption;
  onSelect: (option: SortOption) => void;
  onClose: () => void;
};

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'date_desc',   label: 'Newest to oldest' },
  { key: 'date_asc',    label: 'Oldest to newest' },
  { key: 'amount_desc', label: 'Highest to lowest amount' },
  { key: 'amount_asc',  label: 'Lowest to highest amount' },
];

export function SortSheet({ visible, selected, onSelect, onClose }: SortSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              style={styles.optionRow}
              onPress={() => {
                onSelect(option.key);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === option.key && styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
              {selected === option.key && (
                <Ionicons name="checkmark" size={18} color={COLORS.green} />
              )}
            </Pressable>
          ))}

          {/* Cancel */}
          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.panel,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 12,
    gap: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.line,
    alignSelf: 'center',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  optionTextActive: {
    color: COLORS.green,
    fontWeight: '800',
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  cancelText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
});