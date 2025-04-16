// context/ExpenseContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://localhost:1738/api/dev";

// Define a type for an Expense object. Adjust fields as needed.
export interface Expense {
  [x: string]: string | number | Date;
  _id: string;
  title: string;
  amount: number;
  // Add more fields if required
}

// Define the shape of our context's value
export interface ExpenseContextType {
  expenses: Expense[];
  error: string | null;
  addExpense: (expense: Expense) => Promise<void>;
  getExpenses: () => Promise<any>;
  deleteExpense: (id: string) => Promise<void>;
  totalExpenses: () => number;
}

// Create the context with an undefined default value.
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to add an expense
  const addExpense = async (expense: Expense): Promise<void> => {
    try {
      // If needed, you can retrieve a token from AsyncStorage here
      await axios.post(`${BASE_URL}/add-expense`, expense);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error adding expense');
    }
  };

  // Function to fetch all expenses
  const getExpenses = async (): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/fetchAllExpense`);
      if (response.status === 200) {
        setExpenses(response.data);
        return response;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching expenses');
    }
  };

  // Function to delete an expense by id and then refresh the list
  const deleteExpense = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${BASE_URL}/delete-expense/${id}`);
      await getExpenses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting expense');
    }
  };

  // Calculate the total expenses
  const totalExpenses = (): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const value: ExpenseContextType = {
    expenses,
    error,
    addExpense,
    getExpenses,
    deleteExpense,
    totalExpenses,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use the Expense context safely
export const useExpenseContext = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
};
