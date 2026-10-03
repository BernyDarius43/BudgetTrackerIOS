import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { TransactionForm, TransactionFormErrors, TransactionFormValues } from "./TransactionForm";
import { useIncomeContext } from "@/context/IncomeContext";
import { useExpenseContext } from "@/context/ExpenseContext";

type Props = {
  mode: "Income" | "Expense";
};

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function AddTransactionScreen({ mode }: Props) {
  const router = useRouter();
  const { addIncome } = useIncomeContext();
  const { addExpense } = useExpenseContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<TransactionFormValues>({
    title: "",
    amount: "",
    date: todayISO(),
    category: "",
    description: "",
  });
  const [errors, setErrors] = useState<TransactionFormErrors>({});

  const primaryRoute = useMemo(() => {
    return mode === "Income" ? "/(tabs)/income" : "/(tabs)/expense";
  }, [mode]);

  const onChange = useCallback(
    <K extends keyof TransactionFormValues>(key: K, value: TransactionFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  const validate = useCallback((): boolean => {
    const next: TransactionFormErrors = {};

    if (!values.title.trim()) next.title = "Required";
    if (!values.category.trim()) next.category = "Required";

    const amountNum = Number(values.amount);
    if (!values.amount.trim()) next.amount = "Required";
    else if (Number.isNaN(amountNum)) next.amount = "Must be a number";
    else if (amountNum <= 0) next.amount = "Must be > 0";

    const dateStr = values.date.trim();
    if (!dateStr) next.date = "Required";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) next.date = "Use YYYY-MM-DD";

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [values]);

  const onSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const amount = Number(values.amount);

      const isoDate = `${values.date.slice(0, 10)}T00:00:00.000Z`;

      const payloadBase = {
        title: values.title.trim(),
        amount,
        date: isoDate,
        category: values.category.trim(),
        description: values.description?.trim() || "",
        type: mode,
      };

      if (mode === "Income") {
        await addIncome(payloadBase as any);
        Toast.show({
          type: "success",
          text1: "Income Added",
          text2: "Your dashboard has been updated.",
        });
      } else {
        await addExpense(payloadBase as any);
        Toast.show({
          type: "success",
          text1: "Expense Added",
          text2: "Your dashboard has been updated.",
        });
      }

      router.replace(primaryRoute);
    } catch (e: any) {
      const message =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Failed to save transaction";
            Toast.show({
        type: "error",
        text1: "Save Failed",
        text2: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [addExpense, addIncome, isSubmitting, mode, primaryRoute, router, validate, values]);

  const onCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <TransactionForm
      mode={mode}
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      onChange={onChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}
