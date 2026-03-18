import { queryClient } from "@/lib/query-client";
import { getPayment } from "../api";
import { paymentQueryKeys } from "../key";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import type { PaymentType } from "@/types/payment.type";

export function useGetPayment(
  id: string
): UseSuspenseQueryResult<PaymentType, Error> {
  return useSuspenseQuery<PaymentType, Error>({
    queryKey: paymentQueryKeys.detail(id),
    queryFn: () => getPayment(id),
  });
}

export async function ensurePayment(id: string): Promise<void> {
  await queryClient.ensureQueryData({
    queryKey: paymentQueryKeys.detail(id),
    queryFn: () => getPayment(id),
  });
}
