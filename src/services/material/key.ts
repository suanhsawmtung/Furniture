export const materialQueryKeys = {
  all: ["materials"] as const,

  lists: ["materials", "list"] as const,

  list: (options: { offset?: number; search?: string; limit?: number }) =>
    ["materials", "list", options] as const,

  detail: (slug: string) => ["materials", "detail", slug] as const,
};

