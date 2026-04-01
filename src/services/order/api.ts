import api from "@/lib/api";
import type {
  OrderDetailType,
  OrderListResult,
  OrderQueryParams,
  OrderType
} from "@/types/order.type.ts";

export const DEFAULT_LIMIT = 10;

export async function fetchOrders(options: OrderQueryParams): Promise<OrderListResult> {
  const { offset = 0, search, limit = 10, status, paymentStatus, source } = options;
  const queryParams: OrderQueryParams = {
    limit,
    offset,
    ...(search && { search }),
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
    ...(source && { source }),
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

export async function fetchOrder(code: string): Promise<OrderDetailType> {
  const response = await api.get(`/admin/orders/${code}`);
  return response.data?.data?.order;
}

export async function createOrder(params: FormData): Promise<{
  success: boolean;
  message: string;
  data?: { order: OrderType };
}> {
  const response = await api.post("/admin/orders", params);
  return response.data;
}

export async function updateOrder(code: string, params: FormData): Promise<{
  success: boolean;
  message: string;
  data?: { order: OrderType };
}> {
  const response = await api.patch(`/admin/orders/${code}`, params);
  return response.data;
}
