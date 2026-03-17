import type { RefundFilterFormSchema, refundSchema } from "@/validations/refund.validation";
import type z from "zod";

export type RefundStatus = "PENDING" | "SUCCESS" | "FAILED" | "VOIDED";

export type RefundType = {
  id: number;
  orderId: number;
  amount: number;
  reason: string | null;
  status: RefundStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  order: {
    id: number;
    code: string;
  } | null;
};

export interface RefundListResult {
  refunds: RefundType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface RefundQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
}

export interface DeleteRefundResponse {
  success: boolean;
  message: string;
}

export interface UpdateRefundResponse {
  success: boolean;
  message: string;
  data: {
    refund: RefundType;
  };
}

export interface CreateRefundResponse {
  success: boolean;
  message: string;
  data: {
    refund: RefundType;
  };
}

export type RefundFormValues = z.infer<typeof refundSchema>;

export type RefundFilterFormValues = z.infer<typeof RefundFilterFormSchema>;
