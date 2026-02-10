// types/dashboard.types.ts

export type TxType = "Income" | "Expense";

/**
 * Base shape shared by both Income and Expense in the UI layer.
 * Align this with what your backend actually returns.
 */
export type TransactionBase = {
  _id: string;
  uid: string;
  title: string;
  amount: number;
  type: TxType;
  date: string | Date;
  category: string;
  description?: string;
  createdAt: string | number | Date;
  updatedAt?: string | number | Date;
};

export type IncomeTx = TransactionBase & { type: "Income" };
export type ExpenseTx = TransactionBase & { type: "Expense" };
export type Transaction = IncomeTx | ExpenseTx;

export type Card = {
  id: string;
  brand: string;
  last4: string;
  exp: string;
  accent: "green" | "blue";
};

export type ChartDataPoint = {
  date: string;
  balance: number;
};
