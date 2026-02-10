// app/(tabs)/expense/edit/[id].tsx
import React, { useMemo } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useExpenseContext } from "@/context/ExpenseContext";
import { EditTransactionScreen } from "@/components/transactions/EditTransactionScreen";
import { COLORS } from "@/constants/Colors";

export default function EditExpenseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { expenses } = useExpenseContext();

  const expense = useMemo(() => {
    return expenses.find((exp) => exp._id === id);
  }, [expenses, id]);

  if (!expense) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.red} />
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

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },
});