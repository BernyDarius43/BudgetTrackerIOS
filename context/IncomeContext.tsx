// context/IncomeContext.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://localhost:1738/api/dev";

// Define the shape of an Income item.
export interface Income {
  createdAt: string | number | Date;
  _id: string;
  title: string;
  amount: number;
  // Add additional fields (e.g., date, category, etc.) as needed.
}

// Define the context value type.
export interface IncomeContextType {
  incomes: Income[];
  error: string | null;
  addIncome: (income: Income) => Promise<any>;
  getAllIncomes: () => Promise<any>;
  deleteIncome: (id: string) => Promise<any>;
  updateIncome: (id: string, income: Income) => Promise<any>;
  totalIncome: () => number;
}

// Create the context with an undefined default to enforce provider usage.
const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

// Provider component.
export const IncomeProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to add an income.
  const addIncome = async (income: Income): Promise<any> => {
    try {
      // Retrieve token from AsyncStorage if needed.
      const tokenString = await AsyncStorage.getItem('firebaseToken');
      const token = tokenString ? JSON.parse(tokenString) : null;
      const response = await axios.post(`${BASE_URL}/addIncome`, income, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        await getAllIncomes();
        return response.data;
      }
      return response;
    } catch (err: any) {
      console.error('Error adding income:', err);
      setError(err.response?.data?.message || 'Error adding income');
    }
  };

  // Function to fetch all incomes.
  const getAllIncomes = async (): Promise<any> => {
    try {
      const tokenString = await AsyncStorage.getItem('firebaseToken');
      const token = tokenString ? JSON.parse(tokenString) : null;
      const response = await axios.get(`${BASE_URL}/fetchAllIncomes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setIncomes(response.data);
        return response;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching incomes');
    }
  };

  // Function to delete an income by its id.
  const deleteIncome = async (id: string): Promise<any> => {
    try {
      const tokenString = await AsyncStorage.getItem('firebaseToken');
      const token = tokenString ? JSON.parse(tokenString) : null;
      const response = await axios.delete(`${BASE_URL}/delete-income/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        await getAllIncomes();
        return response;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting income');
    }
  };

  // Function to update an income.
  const updateIncome = async (id: string, income: Income): Promise<any> => {
    try {
      const tokenString = await AsyncStorage.getItem('firebaseToken');
      const token = tokenString ? JSON.parse(tokenString) : null;
      const response = await axios.put(`${BASE_URL}/update-income/${id}`, income, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        // Optionally update state locally:
        setIncomes((prevIncomes) =>
          prevIncomes.map((inc) => (inc._id === id ? response.data : inc))
        );
        await getAllIncomes();
        return response;
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error updating income');
    }
  };

  // Function to calculate total income.
  const totalIncome = (): number => {
    return incomes.reduce((total, income) => total + income.amount, 0);
  };

  // Memoize the context value to prevent unnecessary re-renders.
  const value: IncomeContextType = useMemo(() => ({
    incomes,
    error,
    addIncome,
    getAllIncomes,
    deleteIncome,
    updateIncome,
    totalIncome,
  }), [incomes, error]);

  return (
    <IncomeContext.Provider value={value}>
      {children}
    </IncomeContext.Provider>
  );
};

// Custom hook to safely use the IncomeContext.
export const useIncomeContext = (): IncomeContextType => {
  const context = useContext(IncomeContext);
  if (context === undefined) {
    throw new Error('useIncomeContext must be used within an IncomeProvider');
  }
  return context;
};
