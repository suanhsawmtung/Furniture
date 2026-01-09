import api from "@/lib/api";
import type {
  PostListResult,
  PostQueryParams,
  PostType,
} from "@/types/post.type";

export const DEFAULT_LIMIT = 10;

export async function fetchPosts(options: {
  offset?: number;
  search?: string;
  limit?: number;
  category?: string;
}): Promise<PostListResult> {
  const { offset = 0, search, limit = 10, category } = options;

  const queryParams: PostQueryParams = {
    limit,
    offset,
    ...(search && { search }),
    ...(category && { category }),
  };

  const response = await api.get("/admin/posts", {
    params: queryParams,
  });

  // Backend returns: { success: true, data: { posts, currentPage, totalPages, pageSize }, message: null }
  return {
    posts: response.data?.data?.posts || [],
    currentPage: response.data?.data?.currentPage || 0,
    totalPages: response.data?.data?.totalPages || 0,
    pageSize: response.data?.data?.pageSize || 10,
  };
}

export async function fetchPost(slug: string): Promise<PostType> {
  const response = await api.get(`/admin/posts/${slug}`);

  // Backend returns: { success: true, data: { post }, message: null }
  return response.data?.data?.post;
}
