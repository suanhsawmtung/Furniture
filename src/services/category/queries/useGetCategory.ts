import { queryClient } from "@/lib/query-client";
import type { CategoryType } from "@/types/category.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchCategory } from "../api";
import { categoryQueryKeys } from "../key";

export function useCategory(
  slug: string,
): UseSuspenseQueryResult<CategoryType, Error> {
  return useSuspenseQuery<CategoryType, Error>({
    queryKey: categoryQueryKeys.detail(slug),
    queryFn: () => fetchCategory(slug),
  });
}

export async function ensureCategory(slug: string): Promise<void> {
  await queryClient.ensureQueryData({
    queryKey: categoryQueryKeys.detail(slug),
    queryFn: () => fetchCategory(slug),
  });
}
