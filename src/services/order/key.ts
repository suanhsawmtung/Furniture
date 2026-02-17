export const orderQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...orderQueryKeys.lists(), { ...filters }] as const,
  details: () => [...orderQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...orderQueryKeys.details(), id] as const,
};
