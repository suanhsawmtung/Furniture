import { queryClient } from "@/lib/query-client";
import { getRefund } from "@/services/refund/api";
import { refundQueryKeys } from "@/services/refund/key";
import type { RefundType } from "@/types/refund.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

export function useGetRefund(
  id: number
): UseSuspenseQueryResult<RefundType, Error> {
  return useSuspenseQuery<RefundType, Error>({
    queryKey: refundQueryKeys.detail(id),
    queryFn: () => getRefund(id),
  });
}

export async function ensureRefund(id: number): Promise<void> {
  await queryClient.ensureQueryData({
    queryKey: refundQueryKeys.detail(id),
    queryFn: () => getRefund(id),
  });
}
