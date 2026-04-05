export const settingQueryKeys = {
  all: ["settings"] as const,
  me: () => [...settingQueryKeys.all, "me"] as const,
};
