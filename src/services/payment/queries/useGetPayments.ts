import { queryClient } from "@/lib/query-client";
import type { PaymentListResult, PaymentQueryParams } from "@/types/payment.type";
import { useSuspenseQuery, type UseSuspenseQueryResult } from "@tanstack/react-query";
import { listPayments } from "../api";
import { paymentQueryKeys } from "../key";

export function useListPayments(
  params: PaymentQueryParams
): UseSuspenseQueryResult<PaymentListResult, Error> {
  return useSuspenseQuery<PaymentListResult, Error>({
    queryKey: paymentQueryKeys.list(params),
    queryFn: () => listPayments(params),
  });
}

export async function ensureListPayments(params: PaymentQueryParams): Promise<void> {
  await queryClient.ensureQueryData({
    queryKey: paymentQueryKeys.list(params),
    queryFn: () => listPayments(params),
  });
}
