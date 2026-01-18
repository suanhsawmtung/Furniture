import { queryClient } from "@/lib/query-client";
import type { UserListResult } from "@/types/user.type";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchUsers } from "../api";
import { userQueryKeys } from "../key";

interface UseListUsersParams {
  offset: number;
  search?: string;
  limit?: number;
  role?: string;
  status?: string;
}

export function useListUsers(
  params: UseListUsersParams,
): UseSuspenseQueryResult<UserListResult, Error> {
  const { offset, search, limit, role, status } = params;

  return useSuspenseQuery<UserListResult, Error>({
    queryKey: userQueryKeys.list({ offset, search, limit, role, status }),
    queryFn: () => fetchUsers({ offset, search, limit, role, status }),
  });
}

export async function ensureListUsers(
  params: UseListUsersParams,
): Promise<void> {
  const { offset, search, limit, role, status } = params;

  await queryClient.ensureQueryData({
    queryKey: userQueryKeys.list({ offset, search, limit, role, status }),
    queryFn: () => fetchUsers({ offset, search, limit, role, status }),
  });
}
