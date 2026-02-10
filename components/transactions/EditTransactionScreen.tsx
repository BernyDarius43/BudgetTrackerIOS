// components/transactions/EditTransactionScreen.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { TransactionForm, TransactionFormErrors, TransactionFormValues } from "./TransactionForm";
import { useIncomeContext, Income } from "@/context/IncomeContext";
import { useExpenseContext, Expense } from "@/context/ExpenseContext";

type Props = {
  mode: "Income" | "Expense";
  transaction: Income | Expense;
  onCancel: () => void;
};

export function EditTransactionScreen({ mode, transaction, onCancel }: Props) {
  const router = useRouter();
  const { updateIncome } = useIncomeContext();
  const { updateExpense } = useExpenseContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<TransactionFormValues>({
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });
  const [errors, setErrors] = useState<TransactionFormErrors>({});

  // Load transaction data into form
  useEffect(() => {
    if (transaction) {
      const dateStr = transaction.date.slice(0, 10); // Extract YYYY-MM-DD
      setValues({
        title: transaction.title,
        amount: String(transaction.amount),
        date: dateStr,
        category: transaction.category,
        description: transaction.description || "",
      });
    }
  }, [transaction]);

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

      // ✅ CRITICAL: Only include description if it has content
      const payload: any = {
        title: values.title.trim(),
        amount,
        date: isoDate,
        category: values.category.trim(),
        description: values.description?.trim() || "",
      };

      // Only add description if it's not empty
      const trimmedDescription = values.description?.trim();
      if (trimmedDescription) {
        payload.description = trimmedDescription;
      }

      if (mode === "Income") {
        await updateIncome(transaction._id, payload);
        Toast.show({
          type: "success",
          text1: "Income Updated",
          text2: "Your changes have been saved.",
        });
      } else {
        await updateExpense(transaction._id, payload);
        Toast.show({
          type: "success",
          text1: "Expense Updated",
          text2: "Your changes have been saved.",
        });
      }

      // Navigate back to detail view (forces refresh)
      router.back();
    } catch (e: any) {
      const message =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Failed to update transaction";
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, mode, router, transaction._id, updateExpense, updateIncome, validate, values]);

  return (
    <TransactionForm
      mode={mode}
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      onChange={onChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit
    />
  );
}