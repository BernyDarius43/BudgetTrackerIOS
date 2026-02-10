// app/(tabs)/income/edit/[id].tsx
import React, { useMemo } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useIncomeContext } from "@/context/IncomeContext";
import { EditTransactionScreen } from "@/components/transactions/EditTransactionScreen";
import { COLORS } from "@/constants/Colors";

export default function EditIncomeRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { incomes } = useIncomeContext();

  const income = useMemo(() => {
    return incomes.find((inc) => inc._id === id);
  }, [incomes, id]);

  if (!income) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
    );
  }

  return (
    <EditTransactionScreen
      mode="Income"
      transaction={income}
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