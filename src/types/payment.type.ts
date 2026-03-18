import type { paymentFilterFormSchema } from "@/validations/payment.validation";
import type z from "zod";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "VOIDED";

export type PaymentMethod = "BANK_TRANSFER" | "CASH" | "CARD" | "E_WALLET";

export type PaymentType = {
  id: number;
  orderId: number;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  reference: string | null;
  note: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  order: {
    id: number;
    code: string;
  } | null;
};

export interface PaymentListResult {
  items: PaymentType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export interface PaymentQueryParams {
  limit?: number;
  pageSize?: number;
  offset?: number;
  search?: string;
  method?: string;
  status?: string;
}

export interface DeletePaymentResponse {
  success: boolean;
  message: string;
}

export interface UpdatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment: PaymentType;
  };
}

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment: PaymentType;
  };
}

export type { PaymentFormValues } from "@/validations/payment.validation";

export type PaymentFilterFormValues = z.infer<typeof paymentFilterFormSchema>;
