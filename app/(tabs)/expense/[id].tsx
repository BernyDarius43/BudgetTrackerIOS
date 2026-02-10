// app/(tabs)/expense/[id].tsx
import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { COLORS } from "@/constants/Colors";
import { useExpenseContext } from "@/context/ExpenseContext";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { formatMoney, formatDate } from "@/utils/formatters";

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { expenses, deleteExpense } = useExpenseContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const expense = useMemo(() => {
    return expenses.find((exp) => exp._id === id);
  }, [expenses, id]);

  const handleDelete = useCallback(async () => {
    if (!expense) return;

    setIsSubmitting(true);
    setShowDeleteConfirm(false);

    try {
      await deleteExpense(expense._id);

      Toast.show({
        type: "success",
        text1: "Expense Deleted",
        text2: "The expense has been removed.",
      });

      router.replace("/(tabs)/expense");
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || "Failed to delete expense";
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: message,
      });
      setIsSubmitting(false);
    }
  }, [expense, deleteExpense, router]);

  if (!expense) {
    return (
      <View style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.red} />
          <Text style={styles.loadingText}>Loading expense...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.safe}>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>Expense Details</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.value}>{expense.title}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Amount</Text>
              <Text style={[styles.value, { color: COLORS.red, fontWeight: "900" }]}>
                {formatMoney(expense.amount)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{expense.category}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{formatDate(expense.date)}</Text>
            </View>

            {expense.description && (
              <>
                <View style={styles.divider} />
                <View style={styles.column}>
                  <Text style={styles.label}>Description</Text>
                  <Text style={[styles.value, { marginTop: 8 }]}>{expense.description}</Text>
                </View>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Created</Text>
              <Text style={styles.valueMuted}>
                {new Date(expense.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() => router.push(`/(tabs)/expense/edit/${expense._id}`)}
              style={[styles.actionBtn, { backgroundColor: COLORS.green }]}
              disabled={isSubmitting}
            >
              <Text style={styles.actionBtnText}>Edit</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowDeleteConfirm(true)}
              style={[styles.actionBtn, { backgroundColor: COLORS.red }]}
              disabled={isSubmitting}
            >
              <Text style={styles.actionBtnText}>Delete</Text>
            </Pressable>
          </View>
        </ScrollView>

        <ConfirmDialog
          visible={showDeleteConfirm}
          title="Delete Expense?"
          message={`Are you sure you want to delete "${expense.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          dangerous
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 18, gap: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: { color: COLORS.muted, fontSize: 14 },
  header: { gap: 12 },
  backButton: { alignSelf: "flex-start" },
  backButtonText: { color: COLORS.green, fontSize: 16, fontWeight: "700" },
  title: { color: COLORS.text, fontSize: 28, fontWeight: "800" },
  card: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    padding: 20,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  column: { gap: 4 },
  label: { color: COLORS.muted, fontSize: 14, fontWeight: "600" },
  value: { color: COLORS.text, fontSize: 16, fontWeight: "700", flex: 1, textAlign: "right" },
  valueMuted: { color: COLORS.muted, fontSize: 14 },
  divider: { height: 1, backgroundColor: COLORS.line },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  actionBtnText: { color: COLORS.white, fontSize: 16, fontWeight: "800" },
});