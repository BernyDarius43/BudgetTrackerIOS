import { useMemo } from 'react';
import { useIncomeContext, type Income } from '@/context/IncomeContext';
import { useExpenseContext, type Expense } from '@/context/ExpenseContext';

export type MergedTransaction = Income | Expense;

export type MonthlySnapshot = {
  month: string; // "2026-01" format
  monthLabel: string; // "January 2026"
  endBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number; // income - expenses
  changeFromPrevious: number;
  transactionCount: number;
  isComplete: boolean; // false if current month
  isPartial: boolean; // true if has transactions but incomplete
};

export type WeeklySnapshot = {
  week: number; // 1-4
  weekLabel: string; // "Week 1"
  balance: number;
  date: Date;
};

export function useFinancialData() {
  const { incomes } = useIncomeContext();
  const { expenses } = useExpenseContext();

  const allTransactions = useMemo<MergedTransaction[]>(
    () => [...incomes, ...expenses],
    [incomes, expenses]
  );

  const transactionsByDateAsc = useMemo(
    () =>
      [...allTransactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [allTransactions]
  );

  const transactionsByDateDesc = useMemo(
    () =>
      [...allTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [allTransactions]
  );

  const totalIncome = useMemo(
    () => incomes.reduce((sum, inc) => sum + inc.amount, 0),
    [incomes]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );

  const totalBalance = useMemo(
    () => totalIncome - totalExpenses,
    [totalIncome, totalExpenses]
  );

  const recentTransactions = useMemo(
    () => transactionsByDateDesc.slice(0, 5),
    [transactionsByDateDesc]
  );

  const monthlyData = useMemo((): MonthlySnapshot[] => {
    if (transactionsByDateAsc.length === 0) return [];

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}`;

    const monthMap = new Map<string, MergedTransaction[]>();

    transactionsByDateAsc.forEach((tx) => {
      const date = new Date(tx.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, []);
      }
      monthMap.get(monthKey)!.push(tx);
    });

    const snapshots: MonthlySnapshot[] = [];
    let runningBalance = 0;

    const sortedMonths = Array.from(monthMap.keys()).sort();

    sortedMonths.forEach((monthKey, index) => {
      const txs = monthMap.get(monthKey)!;

      let monthIncome = 0;
      let monthExpenses = 0;

      txs.forEach((tx) => {
        if (tx.type === 'Income') {
          monthIncome += tx.amount;
          runningBalance += tx.amount;
        } else {
          monthExpenses += tx.amount;
          runningBalance -= tx.amount;
        }
      });

      const netCashFlow = monthIncome - monthExpenses;
      const previousBalance = index > 0 ? snapshots[index - 1].endBalance : 0;
      const changeFromPrevious = runningBalance - previousBalance;

      const [year, month] = monthKey.split('-');
      const monthDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const monthLabel = monthDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      snapshots.push({
        month: monthKey,
        monthLabel,
        endBalance: runningBalance,
        totalIncome: monthIncome,
        totalExpenses: monthExpenses,
        netCashFlow,
        changeFromPrevious,
        transactionCount: txs.length,
        isComplete: monthKey !== currentMonth,
        isPartial: monthKey === currentMonth && txs.length > 0,
      });
    });

    return snapshots;
  }, [transactionsByDateAsc]);

  const weeklyData = useMemo((): WeeklySnapshot[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTxs = transactionsByDateAsc.filter((tx) => {
      const date = new Date(tx.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    if (currentMonthTxs.length === 0) {
      const lastMonthBalance =
        monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].endBalance : 0;

      return Array.from({ length: 4 }, (_, i) => ({
        week: i + 1,
        weekLabel: `Week ${i + 1}`,
        balance: lastMonthBalance,
        date: new Date(currentYear, currentMonth, (i + 1) * 7),
      }));
    }

    const weeks: WeeklySnapshot[] = [];
    let runningBalance =
      monthlyData.length > 1 ? monthlyData[monthlyData.length - 2].endBalance : 0;

    for (let week = 1; week <= 4; week++) {
      const weekStart = (week - 1) * 7 + 1;
      const weekEnd = week * 7;

      currentMonthTxs.forEach((tx) => {
        const date = new Date(tx.date);
        const day = date.getDate();

        if (day >= weekStart && day <= weekEnd) {
          if (tx.type === 'Income') {
            runningBalance += tx.amount;
          } else {
            runningBalance -= tx.amount;
          }
        }
      });

      weeks.push({
        week,
        weekLabel: `Week ${week}`,
        balance: runningBalance,
        date: new Date(currentYear, currentMonth, weekEnd),
      });
    }

    return weeks;
  }, [monthlyData, transactionsByDateAsc]);

  const changeFromLastMonth = useMemo(() => {
    if (monthlyData.length === 0) return 0;
    if (monthlyData.length === 1) return monthlyData[0].endBalance;

    const currentMonth = monthlyData[monthlyData.length - 1];
    const lastMonth = monthlyData[monthlyData.length - 2];

    return currentMonth.endBalance - lastMonth.endBalance;
  }, [monthlyData]);

  const getDataForRange = (range: '1M' | '3M' | '6M' | '1Y' | 'All') => {
    if (range === 'All') return monthlyData;

    const monthCounts = {
      '1M': 1,
      '3M': 3,
      '6M': 6,
      '1Y': 12,
    };

    return monthlyData.slice(-monthCounts[range]);
  };

  return {
    transactions: transactionsByDateDesc,
    transactionsByDateAsc,
    totalIncome,
    totalExpenses,
    totalBalance,
    recentTransactions,
    monthlyData,
    weeklyData,
    changeFromLastMonth,
    getDataForRange,
    hasData: transactionsByDateAsc.length > 0,
    hasCompleteMonth: monthlyData.some((m) => m.isComplete),
  };
}
