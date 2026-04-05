import { queryClient } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";
import { settingQueryKeys } from "../key";

export const useGetMe = () => {
  return useQuery({
    queryKey: settingQueryKeys.me(),
    queryFn: getMe,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const ensureGetMe = async () => {
  return await queryClient.ensureQueryData({
    queryKey: settingQueryKeys.me(),
    queryFn: getMe,
  });
};
