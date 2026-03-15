// hooks/useAllTransactions.ts
import { useMemo } from 'react';
import { useIncomeContext, Income } from '@/context/IncomeContext';
import { useExpenseContext, Expense } from '@/context/ExpenseContext';

export type MergedTransaction = (Income | Expense);

export function useAllTransactions(): { transactions: MergedTransaction[] } {
  const { incomes } = useIncomeContext();
  const { expenses } = useExpenseContext();

  const transactions = useMemo<MergedTransaction[]>(() => {
    const merged: MergedTransaction[] = [
      ...incomes,
      ...expenses,
    ];

    return merged.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [incomes, expenses]);

  return { transactions };
}
