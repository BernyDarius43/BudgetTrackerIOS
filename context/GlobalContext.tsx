// context/GlobalContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { IncomeProvider, useIncomeContext } from './IncomeContext';
import { ExpenseProvider, useExpenseContext } from './ExpenseContext';

// Define the shape of the global context
export interface GlobalContextType {
  totalBalance: () => number;
  transactionHistory: () => any[]; // You can replace 'any' with a proper type if available
}

// Create the context with an undefined default value to force safety
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Define the props for the GlobalContextProvider wrapper
interface GlobalContextProviderProps {
  children: ReactNode;
}

// A provider component that computes global values and passes them via context
const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const { incomes, totalIncome } = useIncomeContext();
  const { expenses, totalExpenses } = useExpenseContext();

  // Compute the overall balance
  const totalBalance = () => totalIncome() - totalExpenses();

  // Merge incomes and expenses into a transaction history sorted by createdAt
  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return history.slice(0, 3); // returns the three most recent transactions
  };

  const value: GlobalContextType = {
    totalBalance,
    transactionHistory,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

// The GlobalProvider wraps the IncomeProvider and ExpenseProvider around the GlobalContextProvider.
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <IncomeProvider>
      <ExpenseProvider>
        <GlobalContextProvider>{children}</GlobalContextProvider>
      </ExpenseProvider>
    </IncomeProvider>
  );
};

// Custom hook to use the GlobalContext safely
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
