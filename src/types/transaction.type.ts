import type {
  TransactionFilterFormSchema,
  transactionSchema,
  updateTransactionSchema,
} from "@/validations/transaction.validation";
import type z from "zod";

export type TransactionTypeEnum = "PAYMENT" | "REFUND" | "ADJUSTMENT" | "REVERSAL" | "EXPENSE" | "WITHDRAWAL" | "OTHER";
export type TransactionDirection = "IN" | "OUT";

export type TransactionType = {
  id: number;
  type: TransactionTypeEnum;
  direction: TransactionDirection;
  amount: number;
  source: string;
  reference: string | null;
  note: string | null;
  createdById: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: {
    id: number;
    username: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
};

export interface TransactionListResult {
  items: TransactionType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export interface TransactionQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  type?: string;
  direction?: string;
}

export interface DeleteTransactionResponse {
  success: boolean;
  message: string;
}

export interface UpdateTransactionResponse {
  success: boolean;
  message: string;
  data: {
    transaction: TransactionType;
  };
}

export interface CreateTransactionResponse {
  success: boolean;
  message: string;
  data: {
    transaction: TransactionType;
  };
}

export type TransactionFormValues = z.infer<typeof transactionSchema>;
export type UpdateTransactionFormValues = z.infer<typeof updateTransactionSchema>;
export type TransactionFilterFormValues = z.infer<typeof TransactionFilterFormSchema>;
