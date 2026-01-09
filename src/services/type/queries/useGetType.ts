import { queryClient } from "@/lib/query-client";
import type { ProductTypeType } from "@/types/type.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchType } from "../api";
import { typeQueryKeys } from "../key";

export function useType(
  slug: string,
): UseSuspenseQueryResult<ProductTypeType, Error> {
  return useSuspenseQuery<ProductTypeType, Error>({
    queryKey: typeQueryKeys.detail(slug),
    queryFn: () => fetchType(slug),
  });
}

export async function ensureType(slug: string): Promise<void> {
  await queryClient.ensureQueryData({
    queryKey: typeQueryKeys.detail(slug),
    queryFn: () => fetchType(slug),
  });
}
