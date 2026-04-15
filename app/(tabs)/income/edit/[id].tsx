// app/(tabs)/income/edit/[id].tsx
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useIncomeContext } from "@/context/IncomeContext";
import { EditTransactionScreen } from "@/components/transactions/EditTransactionScreen";
import { type ThemeColors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SkeletonForm } from "@/components/skeletons";

export default function EditIncomeRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { incomes, loading } = useIncomeContext();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const income = useMemo(() => {
    return incomes.find((inc) => inc._id === id);
  }, [incomes, id]);

  if (loading || !income) {
    return (
      <View style={styles.loading}>
        <SkeletonForm fieldCount={5} buttonCount={2} />
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.bg,
    },
  });
