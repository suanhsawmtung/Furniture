import api from "@/lib/api";
import type { OrderListResult, OrderQueryParams, OrderType } from "@/types/order.type.ts";

export const DEFAULT_LIMIT = 10;

export async function fetchOrders(options: {
  offset?: number;
  search?: string;
  limit?: number;
  status?: string;
  paymentStatus?: string;
}): Promise<OrderListResult> {
  const { offset = 0, search, limit = 10, status, paymentStatus } = options;
  const queryParams: OrderQueryParams = {
    limit,
    offset,
    ...(search && { search }),
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
  };

  const response = await api.get("/admin/orders", {
    params: queryParams,
  });

  return {
    orders: response.data?.data?.orders || [],
    currentPage: response.data?.data?.currentPage || 0,
    totalPages: response.data?.data?.totalPages || 0,
    pageSize: response.data?.data?.pageSize || 10,
  };
}

export async function fetchOrder(id: string | number): Promise<OrderType> {
  const response = await api.get(`/admin/orders/${id}`);
  return response.data?.data?.order;
}
