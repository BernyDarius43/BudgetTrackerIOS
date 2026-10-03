import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  JSX,
  useCallback,
} from 'react';
import api from '@/services/api';

export type TransactionType = 'Income' | 'Expense';

export interface Income {
  _id: string;
  uid: string;
  title: string;
  amount: number;
  type: 'Income';
  date: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CreateIncomeDto = {
  title: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
};

export type UpdateIncomeDto = Partial<CreateIncomeDto>;

export interface IncomeContextType {
  incomes: Income[];
  error: string | null;
  loading: boolean;
  addIncome: (income: CreateIncomeDto) => Promise<Income>;
  getAllIncomes: () => Promise<Income[]>;
  deleteIncome: (id: string) => Promise<void>;
  updateIncome: (id: string, income: UpdateIncomeDto) => Promise<Income>;
  totalIncome: () => number;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const IncomeProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getAllIncomes = useCallback(async (): Promise<Income[]> => {
    console.log('[IncomeContext] getAllIncomes called, current loading state:', loading); 
    console.log('[IncomeContext] getAllIncomes called'); // 🔍
    setLoading(true);
    try {
      const response = await api.get<Income[]>('/fetchAllIncomes');
      console.log('[IncomeContext] Response status:', response.status, '| count:', response.data.length); // 🔍
      if (response.status === 200) {
        setIncomes(response.data);
        return response.data;
      }

      setError('Unexpected response while fetching incomes');
      return [];
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error fetching incomes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addIncome = useCallback(async (income: CreateIncomeDto): Promise<Income> => {
    try {
      const response = await api.post<Income>('/addIncome', income);

      if (response.status === 201 || response.status === 200) {
        setIncomes((prev) => [response.data, ...prev.filter((item) => item._id !== response.data._id)]);
        return response.data;
      }

      throw new Error('Unexpected response while adding income');
    } catch (err: any) {
      console.error('Error adding income:', err);
      setError(err?.response?.data?.message || 'Error adding income');
      throw err;
    }
  }, []);

  const deleteIncome = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/delete-income/${id}`);
      if (response.status === 200) {
        setIncomes((prev) => prev.filter((item) => item._id !== id));
        return;
      }

      throw new Error('Unexpected response while deleting income');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error deleting income');
      throw err;
    }
  }, []);

  const updateIncome = useCallback(async (id: string, income: UpdateIncomeDto): Promise<Income> => {
    try {
      const response = await api.put<Income>(`/update-income/${id}`, income);

      if (response.status === 200) {
        setIncomes((prev) => prev.map((inc) => (inc._id === id ? response.data : inc)));
        return response.data;
      }

      throw new Error('Unexpected response while updating income');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error updating income');
      throw err;
    }
  }, []);

  const totalIncome = useCallback((): number => {
    return incomes.reduce((total, income) => total + income.amount, 0);
  }, [incomes]);

  const value: IncomeContextType = useMemo(
    () => ({
      incomes,
      error,
      loading,
      addIncome,
      getAllIncomes,
      deleteIncome,
      updateIncome,
      totalIncome,
    }),
    [incomes, error, loading, addIncome, getAllIncomes, deleteIncome, updateIncome, totalIncome]
  );

  return <IncomeContext.Provider value={value}>{children}</IncomeContext.Provider>;
};

export const useIncomeContext = (): IncomeContextType => {
  const context = useContext(IncomeContext);
  if (context === undefined) {
    throw new Error('useIncomeContext must be used within an IncomeProvider');
  }
  return context;
};
