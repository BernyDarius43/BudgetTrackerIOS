// hooks/useDashboardData.ts - Updated to use weekly chart
import { useMemo } from 'react';
import { useFinancialData } from './useFinancialData';

export function useDashboardData() {
  const {
    totalBalance,
    recentTransactions,
    weeklyData,
    changeFromLastMonth,
    hasData,
  } = useFinancialData();

  // Chart values from weekly data
  const chartValues = useMemo(() => {
    if (weeklyData.length === 0) {
      return new Array(4).fill(0);
    }
    return weeklyData.map(w => w.balance);
  }, [weeklyData]);

  const isEmpty = useMemo(() => !hasData, [hasData]);

  return {
    totalBalance,
    recentTransactions,
    chartValues,
    changeFromLastMonth, // ✅ NEW: Change from last month's end
    isEmpty,
  };
}
