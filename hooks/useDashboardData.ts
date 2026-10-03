import { useMemo } from 'react';
import { useFinancialData } from './useFinancialData';

export function useDashboardData() {
  const {
    totalBalance,
    recentTransactions,
    weeklyData,
    changeFromLastMonth,
    hasComparisonMonth,
    hasData,
    isLoading,
    monthlyData, 
  } = useFinancialData();

  const chartValues = useMemo(() => {
    if (weeklyData.length === 0) {
      return new Array(4).fill(0);
    }
    return weeklyData.map(w => w.balance);
  }, [weeklyData]);

  const isEmpty = useMemo(() => !hasData, [hasData]);

   const trendPct = useMemo(() => {
    if (monthlyData.length < 2) return 0;
    const prev = monthlyData[monthlyData.length - 2].endBalance;
    if (prev === 0) return 0;
    return ((changeFromLastMonth / Math.abs(prev)) * 100);
  }, [monthlyData, changeFromLastMonth]);

  return {
    totalBalance,
    recentTransactions,
    chartValues,
    changeFromLastMonth,
    trendPct,
    hasComparisonMonth,
    isEmpty,
    isLoading,
  };
}
