// context/GlobalContext.tsx
import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { IncomeProvider, useIncomeContext, type Income } from "./IncomeContext";
import { ExpenseProvider, useExpenseContext, type Expense } from "./ExpenseContext";

/**
 * A strict union type for dashboard/global usage.
 * This is the "read model" coming from your backend.
 */
export type Transaction = Income | Expense;

export interface GlobalContextType {
  totalBalance: number;
  transactionHistory: Transaction[]; // most recent N transactions
  totalIncome: number;
  totalExpenses: number;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalContextProviderProps {
  children: ReactNode;
}

const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const { incomes, totalIncome: totalIncomeFn } = useIncomeContext();
  const { expenses, totalExpenses: totalExpensesFn } = useExpenseContext();

  const totalIncome = useMemo(() => totalIncomeFn(), [totalIncomeFn, incomes]);
  const totalExpenses = useMemo(() => totalExpensesFn(), [totalExpensesFn, expenses]);

  const totalBalance = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  const transactionHistory = useMemo<Transaction[]>(() => {
    // Merge and sort by createdAt desc
    const history: Transaction[] = [...incomes, ...expenses].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    // Return the 3 most recent transactions (same behavior you had)
    return history.slice(0, 3);
  }, [incomes, expenses]);

  const value: GlobalContextType = {
    totalBalance,
    transactionHistory,
    totalIncome,
    totalExpenses,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

/**
 * Wraps Income + Expense providers and exposes derived global values
 */
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <IncomeProvider>
      <ExpenseProvider>
        <GlobalContextProvider>{children}</GlobalContextProvider>
      </ExpenseProvider>
    </IncomeProvider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
