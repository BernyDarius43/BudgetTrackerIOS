// app/(tabs)/income/[id].tsx
import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { COLORS } from "@/constants/Colors";
import { useIncomeContext } from "@/context/IncomeContext";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { formatMoney, formatDate } from "@/utils/formatters";

export default function IncomeDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { incomes, deleteIncome } = useIncomeContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find the income
  const income = useMemo(() => {
    return incomes.find((inc) => inc._id === id);
  }, [incomes, id]);

  const handleDelete = useCallback(async () => {
    if (!income) return;

    setIsSubmitting(true);
    setShowDeleteConfirm(false);

    try {
      await deleteIncome(income._id);

      Toast.show({
        type: "success",
        text1: "Income Deleted",
        text2: "The income has been removed.",
      });

      router.replace("/(tabs)/income");
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || "Failed to delete income";
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: message,
      });
      setIsSubmitting(false);
    }
  }, [income, deleteIncome, router]);

  // Loading state
  if (!income) {
    return (
      <View style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.green} />
          <Text style={styles.loadingText}>Loading income...</Text>
        </View>
      </View>
    );
  }

  // View mode
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={[styles.safe]}>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>Income Details</Text>
          </View>

          {/* Details Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.value}>{income.title}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Amount</Text>
              <Text style={[styles.value, { color: COLORS.green, fontWeight: "900" }]}>
                {formatMoney(income.amount)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{income.category}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{formatDate(income.date)}</Text>
            </View>

            {income.description && (
              <>
                <View style={styles.divider} />
                <View style={styles.column}>
                  <Text style={styles.label}>Description</Text>
                  <Text style={[styles.value, { marginTop: 8 }]}>{income.description}</Text>
                </View>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Created</Text>
              <Text style={styles.valueMuted}>
                {new Date(income.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              onPress={() => router.push(`/(tabs)/income/edit/${income._id}`)}
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

        {/* Delete Confirmation */}
        <ConfirmDialog
          visible={showDeleteConfirm}
          title="Delete Income?"
          message={`Are you sure you want to delete "${income.title}"? This action cannot be undone.`}
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