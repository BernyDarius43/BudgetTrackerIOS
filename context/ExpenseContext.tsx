import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import api from '@/services/api';

export type TransactionType = 'Income' | 'Expense';

export interface Expense {
  _id: string;
  uid: string;
  title: string;
  amount: number;
  type: 'Expense';
  date: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CreateExpenseDto = {
  title: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
};

export type UpdateExpenseDto = Partial<CreateExpenseDto>;

export interface ExpenseContextType {
  expenses: Expense[];
  error: string | null;
  loading: boolean;
  addExpense: (expense: CreateExpenseDto) => Promise<Expense>;
  getExpenses: () => Promise<Expense[]>;
  deleteExpense: (id: string) => Promise<void>;
  updateExpense: (id: string, expense: UpdateExpenseDto) => Promise<Expense>;
  totalExpenses: () => number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getExpenses = useCallback(async (): Promise<Expense[]> => {
     console.log('[ExpenseContext] getExpenses called'); // 🔍
    setLoading(true);
    try {
      const response = await api.get<Expense[]>('/fetchAllExpense');
console.log('[ExpenseContext] Response status:', response.status, '| count:', response.data.length); // 🔍
      if (response.status === 200) {
        setExpenses(response.data);
        return response.data;
      }

      setError('Unexpected response while fetching expenses');
      return [];
    } catch (err: any) {
       console.error('[ExpenseContext] getExpenses ERROR:', err?.response?.status, err?.message); // 🔍
      setError(err?.response?.data?.message || 'Error fetching expenses');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = useCallback(async (expense: CreateExpenseDto): Promise<Expense> => {
    try {
      const response = await api.post<Expense>('/add-expense', expense);

      if (response.status === 201 || response.status === 200) {
        setExpenses((prev) => [response.data, ...prev.filter((item) => item._id !== response.data._id)]);
        return response.data;
      }

      throw new Error('Unexpected response while adding expense');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error adding expense');
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/delete-expense/${id}`);

      if (response.status === 200) {
        setExpenses((prev) => prev.filter((item) => item._id !== id));
        return;
      }

      throw new Error('Unexpected response while deleting expense');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error deleting expense');
      throw err;
    }
  }, []);

  const updateExpense = useCallback(async (id: string, expense: UpdateExpenseDto): Promise<Expense> => {
    try {
      const response = await api.put<Expense>(`/update-expense/${id}`, expense);

      if (response.status === 200) {
        setExpenses((prev) => prev.map((exp) => (exp._id === id ? response.data : exp)));
        return response.data;
      }

      throw new Error('Unexpected response while updating expense');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error updating expense');
      throw err;
    }
  }, []);

  const totalExpenses = useCallback((): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }, [expenses]);

  const value: ExpenseContextType = useMemo(
    () => ({
      expenses,
      error,
      loading,
      addExpense,
      getExpenses,
      deleteExpense,
      updateExpense,
      totalExpenses,
    }),
    [expenses, error, loading, addExpense, getExpenses, deleteExpense, updateExpense, totalExpenses]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpenseContext = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
};
