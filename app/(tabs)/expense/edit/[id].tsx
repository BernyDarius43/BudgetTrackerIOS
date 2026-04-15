// app/(tabs)/expense/edit/[id].tsx
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useExpenseContext } from "@/context/ExpenseContext";
import { EditTransactionScreen } from "@/components/transactions/EditTransactionScreen";
import { type ThemeColors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SkeletonForm } from "@/components/skeletons";

export default function EditExpenseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { expenses, loading } = useExpenseContext();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const expense = useMemo(() => {
    return expenses.find((exp) => exp._id === id);
  }, [expenses, id]);

  if (loading || !expense) {
    return (
      <View style={styles.loading}>
        <SkeletonForm fieldCount={5} buttonCount={2} />
      </View>
    );
  }

  return (
    <EditTransactionScreen
      mode="Expense"
      transaction={expense}
      onCancel={() => router.back()}
    />
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.bg,
    },
  });
