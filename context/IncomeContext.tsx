// context/IncomeContext.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo, JSX, useCallback } from 'react';
import api from '@/services/api';

export type TransactionType = "Income" | "Expense";

/**
 * READ MODEL (what backend returns)
 * Represents a MongoDB document.
 */
export interface Income {
  _id: string;
  uid: string; // server-owned (derived from Firebase token)
  title: string;
  amount: number;
  type: "Income"; // strict for income documents
  date: string; // prefer ISO string in RN/JSON to avoid Date serialization issues
  category: string;
  description?: string;
  createdAt: string; // server-owned
  updatedAt?: string; // server-owned
}

/**
 * WRITE MODELS / DTOs (what frontend is allowed to send)
 * No uid/_id/createdAt/updatedAt here — backend owns identity & timestamps.
 */
export type CreateIncomeDto = {
  title: string;
  amount: number;
  date: string; // ISO string recommended
  category: string;
  description?: string;
};

export type UpdateIncomeDto = Partial<CreateIncomeDto>;

export interface IncomeContextType {
  incomes: Income[];
  error: string | null;

  addIncome: (income: CreateIncomeDto) => Promise<Income>;
  getAllIncomes: () => Promise<Income[]>;
  deleteIncome: (id: string) => Promise<void>;
  updateIncome: (id: string, income: UpdateIncomeDto) => Promise<Income>;

  totalIncome: () => number;
}
// Create the context with an undefined default to enforce provider usage.
const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

// Provider component.
export const IncomeProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState<string | null>(null);

   const getAllIncomes = useCallback(async (): Promise<Income[]> => {
    try {
      const response = await api.get<Income[]>("/fetchAllIncomes");
      if (response.status === 200) {
        setIncomes(response.data);
        return response.data;
      }
      // If backend returns something unexpected
      setError("Unexpected response while fetching incomes");
      return [];
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error fetching incomes");
      throw err;
    }
  }, []);

    const addIncome = useCallback(
    async (income: CreateIncomeDto): Promise<Income> => {
      try {
        const response = await api.post<Income>("/addIncome", income);

        if (response.status === 201 || response.status === 200) {
          // Refresh cache so all screens stay in sync
          await getAllIncomes();
          return response.data;
        }

        throw new Error("Unexpected response while adding income");
      } catch (err: any) {
        console.error("Error adding income:", err);
        setError(err?.response?.data?.message || "Error adding income");
        throw err;
      }
    },
    [getAllIncomes]
  );

  const deleteIncome = useCallback(
    async (id: string): Promise<void> => {
      try {
        const response = await api.delete(`/delete-income/${id}`);
        if (response.status === 200) {
          await getAllIncomes();
          return;
        }
        throw new Error("Unexpected response while deleting income");
      } catch (err: any) {
        setError(err?.response?.data?.message || "Error deleting income");
        throw err;
      }
    },
    [getAllIncomes]
  );

    const updateIncome = useCallback(
    async (id: string, income: UpdateIncomeDto): Promise<Income> => {
      try {
        const response = await api.put<Income>(`/update-income/${id}`, income);

        if (response.status === 200) {
          // Optimistic local update + refresh (safe + consistent)
          setIncomes((prev) => prev.map((inc) => (inc._id === id ? response.data : inc)));
          await getAllIncomes();
          return response.data;
        }

        throw new Error("Unexpected response while updating income");
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Error updating income");
        throw err;
      }
    },
    [getAllIncomes]
  );

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
  }), [incomes, error, addIncome, getAllIncomes, deleteIncome, updateIncome, totalIncome]);

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