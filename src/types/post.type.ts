import type { PostFilterFormSchema, postSchema } from "@/validations/post.validation";
import type z from "zod";

// PostStatus enum from backend
export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PostType = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  authorId: number;
  categoryId: number;
  status: PostStatus;
  publishedAt: string | null; // ISO date string, nullable
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  author: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    email: string;
    username: string | null;
  };
  category: {
    id: number;
    slug: string;
    createdAt: string;
    updatedAt: string;
    name: string;
  };
};

export interface PostListResult {
  posts: PostType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface PostQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
  status?: string;
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}

export interface UpdatePostResponse {
  success: boolean;
  message: string;
  data: {
    post: PostType;
  };
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data: {
    post: PostType;
  };
}

export type PostFormValues = z.infer<typeof postSchema>;

export type PostFilterFormValues = z.infer<typeof PostFilterFormSchema>;