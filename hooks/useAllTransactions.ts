// hooks/useAllTransactions.ts
import { useFinancialData, type MergedTransaction } from '@/hooks/useFinancialData';

export function useAllTransactions(): { transactions: MergedTransaction[] } {
  const { transactions } = useFinancialData();
  return { transactions };
}

export type { MergedTransaction };
