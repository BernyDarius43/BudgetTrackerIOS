// app/(tabs)/expense/edit/[id].tsx
import React, { useMemo } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useExpenseContext } from "@/context/ExpenseContext";
import { EditTransactionScreen } from "@/components/transactions/EditTransactionScreen";
import { type ThemeColors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function EditExpenseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { expenses } = useExpenseContext();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const expense = useMemo(() => {
    return expenses.find((exp) => exp._id === id);
  }, [expenses, id]);

  if (!expense) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.red} />
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
