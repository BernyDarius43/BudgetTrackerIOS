// hooks/useChartData.ts
import { useMemo } from 'react';
import { useIncomeContext } from '@/context/IncomeContext';
import { useExpenseContext } from '@/context/ExpenseContext';

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

export function useChartData() {
  const { incomes } = useIncomeContext();
  const { expenses } = useExpenseContext();

  // Get all transactions sorted by date
  const allTransactions = useMemo(() => {
    return [...incomes, ...expenses].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [incomes, expenses]);

  // Calculate monthly snapshots
  const monthlyData = useMemo((): MonthlySnapshot[] => {
    if (allTransactions.length === 0) return [];

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Group transactions by month
    const monthMap = new Map<string, typeof allTransactions>();
    
    allTransactions.forEach(tx => {
      const date = new Date(tx.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, []);
      }
      monthMap.get(monthKey)!.push(tx);
    });

    // Calculate snapshots for each month
    const snapshots: MonthlySnapshot[] = [];
    let runningBalance = 0;

    const sortedMonths = Array.from(monthMap.keys()).sort();

    sortedMonths.forEach((monthKey, index) => {
      const txs = monthMap.get(monthKey)!;
      
      let monthIncome = 0;
      let monthExpenses = 0;

      txs.forEach(tx => {
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
      const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthLabel = monthDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
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
  }, [allTransactions]);

  // Calculate weekly data for current month
  const weeklyData = useMemo((): WeeklySnapshot[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter transactions for current month
    const currentMonthTxs = allTransactions.filter(tx => {
      const date = new Date(tx.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    if (currentMonthTxs.length === 0) {
      // No transactions this month - return 4 weeks with starting balance
      const lastMonthBalance = monthlyData.length > 0 
        ? monthlyData[monthlyData.length - 1].endBalance 
        : 0;

      return Array.from({ length: 4 }, (_, i) => ({
        week: i + 1,
        weekLabel: `Week ${i + 1}`,
        balance: lastMonthBalance,
        date: new Date(currentYear, currentMonth, (i + 1) * 7),
      }));
    }

    // Calculate balance at end of each week
    const weeks: WeeklySnapshot[] = [];
    let runningBalance = monthlyData.length > 1 
      ? monthlyData[monthlyData.length - 2].endBalance 
      : 0;

    for (let week = 1; week <= 4; week++) {
      const weekStart = (week - 1) * 7 + 1;
      const weekEnd = week * 7;

      // Process transactions in this week
      currentMonthTxs.forEach(tx => {
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
  }, [allTransactions, monthlyData]);

  // Calculate change from last month
  const changeFromLastMonth = useMemo(() => {
    if (monthlyData.length === 0) return 0;
    if (monthlyData.length === 1) return monthlyData[0].endBalance;

    const currentMonth = monthlyData[monthlyData.length - 1];
    const lastMonth = monthlyData[monthlyData.length - 2];

    return currentMonth.endBalance - lastMonth.endBalance;
  }, [monthlyData]);

  // Get data for specific time range
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
    monthlyData,
    weeklyData,
    changeFromLastMonth,
    getDataForRange,
    hasData: allTransactions.length > 0,
    hasCompleteMonth: monthlyData.some(m => m.isComplete),
  };
}