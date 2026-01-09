import { queryClient } from "@/lib/query-client";
import type { PostType } from "@/types/post.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchPost } from "../api";
import { postQueryKeys } from "../key";

export function usePost(slug: string): UseSuspenseQueryResult<PostType, Error> {
  return useSuspenseQuery<PostType, Error>({
    queryKey: postQueryKeys.detail(slug),
    queryFn: () => fetchPost(slug),
  });
}

export async function ensurePost(slug: string): Promise<void> {
  await queryClient.ensureQueryData({
    queryKey: postQueryKeys.detail(slug),
    queryFn: () => fetchPost(slug),
  });
}
