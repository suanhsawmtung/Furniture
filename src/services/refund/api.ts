import axios from "@/lib/api";
import type {
  CreateRefundResponse,
  DeleteRefundResponse,
  RefundFormValues,
  RefundListResult,
  RefundQueryParams,
  RefundType,
  UpdateRefundResponse,
} from "@/types/refund.type";
export const DEFAULT_LIMIT = 10;

export const listRefunds = async (params?: RefundQueryParams): Promise<RefundListResult> => {
  const response = await axios.get("/admin/refunds", { params });
  const data = response.data?.data;
  
  return {
    refunds: data?.items || [],
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
    pageSize: data?.pageSize || DEFAULT_LIMIT,
  };
};

export const getRefund = async (id: number): Promise<RefundType> => {
  const response = await axios.get(`/admin/refunds/${id}`);
  return response.data.data?.refund;
};

export const createRefund = async (data: RefundFormValues): Promise<CreateRefundResponse> => {
  const response = await axios.post("/admin/refunds", data);
  return response.data;
};

export const updateRefund = async (
  id: number,
  data: Partial<RefundFormValues>
): Promise<UpdateRefundResponse> => {
  const response = await axios.patch(`/admin/refunds/${id}`, data);
  return response.data;
};

export const deleteRefund = async (id: number): Promise<DeleteRefundResponse> => {
  const response = await axios.delete(`/admin/refunds/${id}`);
  return response.data;
};
