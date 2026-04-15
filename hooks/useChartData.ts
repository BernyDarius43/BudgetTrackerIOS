// hooks/useChartData.ts
import {
  useFinancialData,
  type MonthlySnapshot,
  type WeeklySnapshot,
} from '@/hooks/useFinancialData';

export function useChartData() {
  const {
    monthlyData,
    weeklyData,
    changeFromLastMonth,
    getDataForRange,
    hasData,
    hasCompleteMonth,
    isLoading,
  } = useFinancialData();

  return {
    monthlyData,
    weeklyData,
    changeFromLastMonth,
    getDataForRange,
    hasData,
    hasCompleteMonth,
    isLoading,
  };
}

export type { MonthlySnapshot, WeeklySnapshot };
