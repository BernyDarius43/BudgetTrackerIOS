// components/common/FilterSheet.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

export type FilterState = {
  dateFrom: string;   // YYYY-MM-DD or ''
  dateTo: string;     // YYYY-MM-DD or ''
  amountMin: string;  // numeric string or ''
  amountMax: string;  // numeric string or ''
  category: string;   // category name or ''
};

export const EMPTY_FILTER: FilterState = {
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
  category: '',
};

export function hasActiveFilters(f: FilterState): boolean {
  return !!(f.dateFrom || f.dateTo || f.amountMin || f.amountMax || f.category);
}

type FilterSheetProps = {
  visible: boolean;
  current: FilterState;
  categories: string[];
  onApply: (filters: FilterState) => void;
  onClose: () => void;
};

export function FilterSheet({
  visible,
  current,
  categories,
  onApply,
  onClose,
}: FilterSheetProps) {
  const [local, setLocal] = useState<FilterState>(current);
  const [categoryOpen, setCategoryOpen] = useState(false);

  // Sync when sheet opens
  useEffect(() => {
    if (visible) setLocal(current);
  }, [visible]);

  const set = (key: keyof FilterState, value: string) =>
    setLocal((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleReset = () => {
    setLocal(EMPTY_FILTER);
    onApply(EMPTY_FILTER);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Prevent tap-through on sheet */}
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <View style={styles.headerActions}>
              <Pressable onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </Pressable>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={22} color={COLORS.muted} />
              </Pressable>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Date range */}
            <Text style={styles.sectionLabel}>Date range</Text>
            <View style={styles.rowInputs}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>From</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.muted}
                  value={local.dateFrom}
                  onChangeText={(v) => set('dateFrom', v)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>To</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.muted}
                  value={local.dateTo}
                  onChangeText={(v) => set('dateTo', v)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Amount range */}
            <Text style={styles.sectionLabel}>Amount range</Text>
            <View style={styles.rowInputs}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Min ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={COLORS.muted}
                  value={local.amountMin}
                  onChangeText={(v) => set('amountMin', v)}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Max ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Any"
                  placeholderTextColor={COLORS.muted}
                  value={local.amountMax}
                  onChangeText={(v) => set('amountMax', v)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Category picker */}
            <Text style={styles.sectionLabel}>Category</Text>
            <Pressable
              style={styles.categoryPicker}
              onPress={() => setCategoryOpen((v) => !v)}
            >
              <Text style={local.category ? styles.categorySelected : styles.categoryPlaceholder}>
                {local.category || 'All categories'}
              </Text>
              <Ionicons
                name={categoryOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={COLORS.muted}
              />
            </Pressable>

            {categoryOpen && (
              <View style={styles.categoryList}>
                {/* All option */}
                <Pressable
                  style={styles.categoryOption}
                  onPress={() => { set('category', ''); setCategoryOpen(false); }}
                >
                  <Text style={[styles.categoryOptionText, !local.category && styles.categoryOptionActive]}>
                    All categories
                  </Text>
                  {!local.category && (
                    <Ionicons name="checkmark" size={16} color={COLORS.green} />
                  )}
                </Pressable>

                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    style={styles.categoryOption}
                    onPress={() => { set('category', cat); setCategoryOpen(false); }}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        local.category === cat && styles.categoryOptionActive,
                      ]}
                    >
                      {cat}
                    </Text>
                    {local.category === cat && (
                      <Ionicons name="checkmark" size={16} color={COLORS.green} />
                    )}
                  </Pressable>
                ))}
              </View>
            )}

            <View style={{ height: 16 }} />
          </ScrollView>

          {/* Apply button */}
          <Pressable style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyText}>Apply Filters</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.line,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resetText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionLabel: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    color: COLORS.muted,
    fontSize: 12,
  },
  input: {
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
  },
  categoryPicker: {
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorySelected: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryPlaceholder: {
    color: COLORS.muted,
    fontSize: 14,
  },
  categoryList: {
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  categoryOptionText: {
    color: COLORS.text,
    fontSize: 14,
  },
  categoryOptionActive: {
    color: COLORS.green,
    fontWeight: '700',
  },
  applyBtn: {
    backgroundColor: COLORS.green,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  applyText: {
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: '800',
  },
});