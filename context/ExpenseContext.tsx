// context/ExpenseContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import api from "@/services/api";

/**
 * Shared transaction discriminator
 */
export type TransactionType = "Income" | "Expense";

/**
 * READ MODEL (what backend returns)
 */
export interface Expense {
  _id: string;
  uid: string;                 // server-owned
  title: string;
  amount: number;
  type: "Expense";             // strict
  date: string;                // ISO string recommended
  category: string;
  description?: string;
  createdAt: string;           // server-owned
  updatedAt?: string;          // server-owned
}

/**
 * WRITE MODELS / DTOs (what frontend is allowed to send)
 */
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
  const [loading, setLoading] = useState<boolean>(true);

  const getExpenses = useCallback(async (): Promise<Expense[]> => {
    setLoading(true);
    try {
      const response = await api.get<Expense[]>("/fetchAllExpense");

      if (response.status === 200) {
        setExpenses(response.data);
        return response.data;
      }

      setError("Unexpected response while fetching expenses");
      return [];
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error fetching expenses");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = useCallback(
    async (expense: CreateExpenseDto): Promise<Expense> => {
      try {
        const response = await api.post<Expense>("/add-expense", expense);

        if (response.status === 201 || response.status === 200) {
          await getExpenses();
          return response.data;
        }

        throw new Error("Unexpected response while adding expense");
      } catch (err: any) {
        setError(err?.response?.data?.message || "Error adding expense");
        throw err;
      }
    },
    [getExpenses]
  );

  const deleteExpense = useCallback(
    async (id: string): Promise<void> => {
      try {
        const response = await api.delete(`/delete-expense/${id}`);

        if (response.status === 200) {
          await getExpenses();
          return;
        }

        throw new Error("Unexpected response while deleting expense");
      } catch (err: any) {
        setError(err?.response?.data?.message || "Error deleting expense");
        throw err;
      }
    },
    [getExpenses]
  );

  const updateExpense = useCallback(
    async (id: string, expense: UpdateExpenseDto): Promise<Expense> => {
      try {
        const response = await api.put<Expense>(
          `/update-expense/${id}`,
          expense
        );

        if (response.status === 200) {
          setExpenses((prev) =>
            prev.map((exp) => (exp._id === id ? response.data : exp))
          );
          await getExpenses();
          return response.data;
        }

        throw new Error("Unexpected response while updating expense");
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Error updating expense"
        );
        throw err;
      }
    },
    [getExpenses]
  );

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
    [
      expenses,
      error,
      loading,
      addExpense,
      getExpenses,
      deleteExpense,
      updateExpense,
      totalExpenses,
    ]
  );

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenseContext must be used within an ExpenseProvider");
  }
  return context;
};
