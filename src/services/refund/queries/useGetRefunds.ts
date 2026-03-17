import { queryClient } from "@/lib/query-client";
import { listRefunds } from "@/services/refund/api";
import { refundQueryKeys } from "@/services/refund/key";
import type { RefundListResult, RefundQueryParams } from "@/types/refund.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

export function useListRefunds(
  params: RefundQueryParams
): UseSuspenseQueryResult<RefundListResult, Error> {
  return useSuspenseQuery<RefundListResult, Error>({
    queryKey: refundQueryKeys.list(params),
    queryFn: () => listRefunds(params),
  });
}

export async function ensureListRefunds(params: RefundQueryParams): Promise<void> {
  await queryClient.ensureQueryData({
    queryKey: refundQueryKeys.list(params),
    queryFn: () => listRefunds(params),
  });
}
