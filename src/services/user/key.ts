export const userQueryKeys = {
  all: ["users"] as const,

  lists: ["users", "list"] as const,

  list: (options: {
    offset?: number;
    search?: string;
    limit?: number;
    role?: string;
    status?: string;
  }) => ["users", "list", options] as const,

  detail: (username: string) => ["users", "detail", username] as const,
};
