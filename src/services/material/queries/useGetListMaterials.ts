import { queryClient } from "@/lib/query-client";
import type { MaterialListResult } from "@/types/material.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchMaterials } from "../api";
import { materialQueryKeys } from "../key";

interface UseListMaterialsParams {
  offset: number;
  search?: string;
  limit?: number;
}

export function useListMaterials(
  params: UseListMaterialsParams,
): UseSuspenseQueryResult<MaterialListResult, Error> {
  const { offset, search, limit } = params;

  return useSuspenseQuery<MaterialListResult, Error>({
    queryKey: materialQueryKeys.list({ offset, search, limit }),
    queryFn: () => fetchMaterials({ offset, search, limit }),
  });
}

export async function ensureListMaterials(
  params: UseListMaterialsParams,
): Promise<void> {
  const { offset, search, limit } = params;

  await queryClient.ensureQueryData({
    queryKey: materialQueryKeys.list({ offset, search, limit }),
    queryFn: () => fetchMaterials({ offset, search, limit }),
  });
}
