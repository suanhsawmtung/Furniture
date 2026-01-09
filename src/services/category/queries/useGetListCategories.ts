import { queryClient } from "@/lib/query-client";
import type { CategoryListResult } from "@/types/category.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchCategories } from "../api";
import { categoryQueryKeys } from "../key";

interface UseListCategoriesParams {
  offset: number;
  search?: string;
  limit?: number;
}

export function useListCategories(
  params: UseListCategoriesParams,
): UseSuspenseQueryResult<CategoryListResult, Error> {
  const { offset, search, limit } = params;

  return useSuspenseQuery<CategoryListResult, Error>({
    queryKey: categoryQueryKeys.list({ offset, search, limit }),
    queryFn: () => fetchCategories({ offset, search, limit }),
  });
}

export async function ensureListCategories(
  params: UseListCategoriesParams,
): Promise<void> {
  const { offset, search, limit } = params;

  await queryClient.ensureQueryData({
    queryKey: categoryQueryKeys.list({ offset, search, limit }),
    queryFn: () => fetchCategories({ offset, search, limit }),
  });
}
