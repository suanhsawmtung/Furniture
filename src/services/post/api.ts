import api from "@/lib/api";
import type {
  CreatePostResponse,
  DeletePostResponse,
  PostListResult,
  PostQueryParams,
  PostType,
  UpdatePostResponse,
} from "@/types/post.type";

export const DEFAULT_LIMIT = 10;

export async function fetchPosts(options: {
  offset?: number;
  search?: string;
  limit?: number;
  category?: string;
  status?: string;
}): Promise<PostListResult> {
  const { offset = 0, search, limit = 10, category, status } = options;
  const queryParams: PostQueryParams = {
    limit,
    offset,
    ...(search && { search }),
    ...(category && { category }),
    ...(status && { status }),
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

export async function createPost(
  formData: FormData,
): Promise<CreatePostResponse> {
  // Axios automatically detects FormData and sets Content-Type to multipart/form-data with boundary
  // When FormData is passed, axios overrides the default Content-Type header automatically
  const response = await api.post("/admin/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Backend returns: { success: true, data: { post }, message: string }
  return response.data;
}

export async function updatePost(
  slug: string,
  formData: FormData,
): Promise<UpdatePostResponse> {
  // Axios automatically detects FormData and sets Content-Type to multipart/form-data with boundary
  // When FormData is passed, axios overrides the default Content-Type header automatically
  const response = await api.patch(`/admin/posts/${slug}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Backend returns: { success: true, data: { post }, message: string }
  return response.data;
}

export async function deletePost({ slug }: { slug: string }): Promise<DeletePostResponse> {
  const response = await api.delete(`/admin/posts/${slug}`);

  // Backend returns: { success: true, message: string }
  return response.data;
}
