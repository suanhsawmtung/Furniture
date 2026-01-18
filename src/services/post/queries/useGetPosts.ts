import { queryClient } from "@/lib/query-client";
import type { PostListResult } from "@/types/post.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchPosts } from "../api";
import { postQueryKeys } from "../key";

interface UseListPostsParams {
  offset: number;
  search?: string;
  limit?: number;
  category?: string;
  status?: string;
}

export function useListPosts(
  params: UseListPostsParams,
): UseSuspenseQueryResult<PostListResult, Error> {
  const { offset, search, limit, category, status } = params;

  return useSuspenseQuery<PostListResult, Error>({
    queryKey: postQueryKeys.list({ offset, search, limit, category, status }),
    queryFn: () => fetchPosts({ offset, search, limit, category, status }),
  });
}

export async function ensureListPosts(
  params: UseListPostsParams,
): Promise<void> {
  const { offset, search, limit, category, status } = params;

  await queryClient.ensureQueryData({
    queryKey: postQueryKeys.list({ offset, search, limit, category, status }),
    queryFn: () => fetchPosts({ offset, search, limit, category, status }),
  });
}
