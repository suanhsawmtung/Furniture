import { queryClient } from "@/lib/query-client";
import type { TypeListResult } from "@/types/type.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchTypes } from "../api";
import { typeQueryKeys } from "../key";

interface UseListTypesParams {
  offset: number;
  search?: string;
  limit?: number;
}

export function useListTypes(
  params: UseListTypesParams,
): UseSuspenseQueryResult<TypeListResult, Error> {
  const { offset, search, limit } = params;

  return useSuspenseQuery<TypeListResult, Error>({
    queryKey: typeQueryKeys.list({ offset, search, limit }),
    queryFn: () => fetchTypes({ offset, search, limit }),
  });
}

export async function ensureListTypes(
  params: UseListTypesParams,
): Promise<void> {
  const { offset, search, limit } = params;

  await queryClient.ensureQueryData({
    queryKey: typeQueryKeys.list({ offset, search, limit }),
    queryFn: () => fetchTypes({ offset, search, limit }),
  });
}
