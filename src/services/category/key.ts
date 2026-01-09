export const categoryQueryKeys = {
  all: ["categories"] as const,

  lists: ["categories", "list"] as const,

  list: (options: { offset?: number; search?: string; limit?: number }) =>
    ["categories", "list", options] as const,

  detail: (slug: string) => ["categories", "detail", slug] as const,
};
