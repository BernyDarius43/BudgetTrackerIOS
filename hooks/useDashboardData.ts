// hooks/useDashboardData.ts - Updated to use weekly chart
import { useMemo } from 'react';
import { useIncomeContext } from '@/context/IncomeContext';
import { useExpenseContext } from '@/context/ExpenseContext';
import { TransactionBase } from '@/types/dashboard.types';
import { useChartData } from './useChartData';

export function useDashboardData() {
  const { incomes, totalIncome } = useIncomeContext();
  const { expenses, totalExpenses } = useExpenseContext();
  const { weeklyData, changeFromLastMonth } = useChartData();

  // Calculate total balance
  const totalBalance = useMemo(() => {
    const income = totalIncome ? totalIncome() : 0;
    const expense = totalExpenses ? totalExpenses() : 0;
    return income - expense;
  }, [totalIncome, totalExpenses]);

  // Merge and sort transactions
  const recentTransactions = useMemo(() => {
    const allTransactions: TransactionBase[] = [
      ...incomes,
      ...expenses,
    ];

    return allTransactions
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [incomes, expenses]);

  // Chart values from weekly data
  const chartValues = useMemo(() => {
    if (weeklyData.length === 0) {
      return new Array(4).fill(0);
    }
    return weeklyData.map(w => w.balance);
  }, [weeklyData]);

  const isEmpty = useMemo(() => incomes.length === 0 && expenses.length === 0, [incomes, expenses]);

  return {
    totalBalance,
    recentTransactions,
    chartValues,
    changeFromLastMonth, // ✅ NEW: Change from last month's end
    isEmpty,
  };
}