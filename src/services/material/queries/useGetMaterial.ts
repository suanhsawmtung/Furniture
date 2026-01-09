import { queryClient } from "@/lib/query-client";
import type { MaterialType } from "@/types/material.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchMaterial } from "../api";
import { materialQueryKeys } from "../key";

export function useMaterial(
  slug: string,
): UseSuspenseQueryResult<MaterialType, Error> {
  return useSuspenseQuery<MaterialType, Error>({
    queryKey: materialQueryKeys.detail(slug),
    queryFn: () => fetchMaterial(slug),
  });
}

export async function ensureMaterial(slug: string): Promise<void> {
  await queryClient.ensureQueryData({
    queryKey: materialQueryKeys.detail(slug),
    queryFn: () => fetchMaterial(slug),
  });
}
