import axios from "@/lib/api";
import type {
  CreatePaymentResponse,
  DeletePaymentResponse,
  PaymentFormValues,
  PaymentListResult,
  PaymentQueryParams,
  PaymentType,
  UpdatePaymentResponse,
} from "@/types/payment.type";

export const DEFAULT_LIMIT = 10;

export const listPayments = async (params?: PaymentQueryParams): Promise<PaymentListResult> => {
  const response = await axios.get("/admin/payments", { params });
  const data = response.data?.data;
  
  return {
    items: data?.items || [],
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    pageSize: data?.pageSize || DEFAULT_LIMIT,
    totalCount: data?.totalCount || 0,
  };
};

export const getPayment = async (id: string): Promise<PaymentType> => {
  const response = await axios.get(`/admin/payments/${id}`);
  return response.data.data?.payment;
};

export const createPayment = async (data: PaymentFormValues): Promise<CreatePaymentResponse> => {
  const response = await axios.post("/admin/payments", data);
  return response.data;
};

export const updatePayment = async (
  id: string,
  data: Partial<PaymentFormValues>
): Promise<UpdatePaymentResponse> => {
  const response = await axios.patch(`/admin/payments/${id}`, data);
  return response.data;
};

export const deletePayment = async (id: string): Promise<DeletePaymentResponse> => {
  const response = await axios.delete(`/admin/payments/${id}`);
  return response.data;
};
