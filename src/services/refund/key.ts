import type { RefundQueryParams } from "@/types/refund.type";

export const refundQueryKeys = {
  all: ["refunds"] as const,
  lists: () => [...refundQueryKeys.all, "list"] as const,
  list: (params: RefundQueryParams) => [...refundQueryKeys.lists(), params] as const,
  details: () => [...refundQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...refundQueryKeys.details(), id] as const,
};
