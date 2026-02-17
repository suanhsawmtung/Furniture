import { queryClient } from "@/lib/query-client";
import type { OrderListResult } from "@/types/order.type";
import {
    useSuspenseQuery,
    type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchOrders } from "../api";
import { orderQueryKeys } from "../key";

interface UseListOrdersParams {
  offset: number;
  search?: string;
  limit?: number;
  status?: string;
  paymentStatus?: string;
}

export function useListOrders(
  params: UseListOrdersParams,
): UseSuspenseQueryResult<OrderListResult, Error> {
  const { offset, search, limit, status, paymentStatus } = params;

  return useSuspenseQuery<OrderListResult, Error>({
    queryKey: orderQueryKeys.list({ offset, search, limit, status, paymentStatus }),
    queryFn: () => fetchOrders({ offset, search, limit, status, paymentStatus }),
  });
}

export async function ensureListOrders(
  params: UseListOrdersParams,
): Promise<void> {
  const { offset, search, limit, status, paymentStatus } = params;

  await queryClient.ensureQueryData({
    queryKey: orderQueryKeys.list({ offset, search, limit, status, paymentStatus }),
    queryFn: () => fetchOrders({ offset, search, limit, status, paymentStatus }),
  });
}

