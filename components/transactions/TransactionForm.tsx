// components/transactions/TransactionForm.tsx
import React, { useMemo } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { type ThemeColors } from "@/constants/Colors";
import { CategoryPicker } from "@/components/common/CategoryPicker";
import { DatePickerField } from "@/components/common/DatePickerField";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";

// ✅ EXPORT these types
export type TransactionFormValues = {
  title: string;
  amount: string;
  date: string;
  category: string;
  description?: string;
};

export type TransactionFormErrors = Partial<Record<keyof TransactionFormValues, string>>;

type Props = {
  mode: "Income" | "Expense";
  values: TransactionFormValues;
  errors: TransactionFormErrors;
  isSubmitting?: boolean;
  onChange: <K extends keyof TransactionFormValues>(key: K, value: TransactionFormValues[K]) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isEdit?: boolean;
};

// ✅ EXPORT the component
export function TransactionForm({
  mode,
  values,
  errors,
  isSubmitting,
  onChange,
  onCancel,
  onSubmit,
  isEdit = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const header = useMemo(() => {
    return isEdit ? `Edit ${mode}` : `Add ${mode}`;
  }, [mode, isEdit]);

  const primaryColor = mode === "Income" ? colors.green : colors.red;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.container, , { paddingBottom: insets.bottom + 16 }]} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{header}</Text>
          <Text style={styles.subtitle}>
            Fill the details below. Your dashboard will update automatically.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Title */}
          <FieldLabel label="Title" error={errors.title} required />
          <TextInput
            value={values.title}
            onChangeText={(t) => onChange("title", t)}
            placeholder={mode === "Income" ? "e.g., Paycheck" : "e.g., Groceries"}
            placeholderTextColor={colors.muted}
            style={[styles.input, errors.title ? styles.inputError : null]}
          />

          {/* Amount */}
          <FieldLabel label="Amount" error={errors.amount} required />
          <TextInput
            value={values.amount}
            onChangeText={(t) => onChange("amount", t)}
            placeholder="e.g., 120.50"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            style={[styles.input, errors.amount ? styles.inputError : null]}
          />

          {/* Category */}
          <FieldLabel label="Category" error={errors.category} required />
          <CategoryPicker
            mode={mode}
            value={values.category}
            onChange={(cat) => onChange("category", cat)}
            error={errors.category}
          />

          {/* Date */}
          <FieldLabel label="Date" error={errors.date} required />
          <DatePickerField
            value={values.date}
            onChange={(date) => onChange("date", date)}
            error={errors.date}
          />

          {/* Description */}
          <FieldLabel label="Description (optional)" />
          <TextInput
            value={values.description || ""}
            onChangeText={(t) => onChange("description", t)}
            placeholder="Add a note…"
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Actions */}
          <View style={styles.actionsRow}>
            {onCancel && (
              <Pressable
                onPress={onCancel}
                style={[styles.secondaryBtn, isSubmitting ? styles.disabled : null]}
                disabled={!!isSubmitting}
              >
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </Pressable>
            )}

            <Pressable
              onPress={onSubmit}
              style={[
                styles.primaryBtn,
                { backgroundColor: primaryColor },
                isSubmitting ? styles.disabled : null,
                !onCancel ? { flex: 1 } : null,
              ]}
              disabled={!!isSubmitting}
            >
              <Text style={styles.primaryBtnText}>
                {isSubmitting ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

function FieldLabel({ label, error, required }: { label: string; error?: string; required?: boolean }) {
  return (
    <View style={styles.labelRow}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 18, gap: 16, paddingBottom: 40 },
  header: { gap: 6, marginBottom: 6 },
  title: { color: colors.text, fontSize: 26, fontWeight: "800" },
  subtitle: { color: colors.muted, fontSize: 13 },

  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },

  labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  label: { color: colors.text, fontSize: 13, fontWeight: "700" },
  required: { color: colors.red },
  errorText: { color: colors.red, fontSize: 12, fontWeight: "700" },

  input: {
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
  },
  inputError: { borderColor: colors.red },
  multiline: { minHeight: 88 },

  actionsRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: colors.white, fontSize: 16, fontWeight: "800" },

  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  secondaryBtnText: { color: colors.text, fontSize: 16, fontWeight: "800" },

  disabled: { opacity: 0.6 },
});
