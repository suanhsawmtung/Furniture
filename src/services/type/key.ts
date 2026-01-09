export const typeQueryKeys = {
  all: ["types"] as const,

  lists: ["types", "list"] as const,

  list: (options: { offset?: number; search?: string; limit?: number }) =>
    ["types", "list", options] as const,

  detail: (slug: string) => ["types", "detail", slug] as const,
};
