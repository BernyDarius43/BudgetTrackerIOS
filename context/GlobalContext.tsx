// context/GlobalContext.tsx
import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { IncomeProvider, useIncomeContext, type Income } from "./IncomeContext";
import { ExpenseProvider, useExpenseContext, type Expense } from "./ExpenseContext";

export type Transaction = Income | Expense;

export interface GlobalContextType {
  totalBalance: number;
  transactionHistory: Transaction[];
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
    const history: Transaction[] = [...incomes, ...expenses].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

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
