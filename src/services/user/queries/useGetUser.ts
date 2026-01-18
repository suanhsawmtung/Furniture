import { queryClient } from "@/lib/query-client";
import type { UserType } from "@/types/user.type";
import {
    useSuspenseQuery,
    type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchUser } from "../api";
import { userQueryKeys } from "../key";

export function useGetUser(
  username: string,
): UseSuspenseQueryResult<UserType, Error> {
  return useSuspenseQuery<UserType, Error>({
    queryKey: userQueryKeys.detail(username),
    queryFn: () => fetchUser(username),
  });
}

export async function ensureUser(username: string): Promise<void> {
  await queryClient.ensureQueryData({
    queryKey: userQueryKeys.detail(username),
    queryFn: () => fetchUser(username),
  });
}
