export const postQueryKeys = {
  all: ["posts"] as const,

  lists: ["posts", "list"] as const,

  list: (options: {
    offset?: number;
    search?: string;
    limit?: number;
    category?: string;
  }) => ["posts", "list", options] as const,

  detail: (slug: string) => ["posts", "detail", slug] as const,
};
