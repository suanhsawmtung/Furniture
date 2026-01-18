import type { PostStatus } from "@/types/post.type";

export const POST_STATUSES: { text: string; key: PostStatus }[] = [
  { text: "Draft", key: "DRAFT" },
  { text: "Published", key: "PUBLISHED" },
  { text: "Archived", key: "ARCHIVED" },
];
