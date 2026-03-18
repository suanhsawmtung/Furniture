import type { PaymentQueryParams } from "@/types/payment.type";

export const paymentQueryKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentQueryKeys.all, "list"] as const,
  list: (params: PaymentQueryParams) => [...paymentQueryKeys.lists(), params] as const,
  details: () => [...paymentQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentQueryKeys.details(), id] as const,
};
