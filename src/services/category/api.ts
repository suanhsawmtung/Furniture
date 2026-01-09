import api from "@/lib/api";
import type {
  CategoryListResult,
  CategoryQueryParams,
  CategoryType,
  CommonCategoryType,
  CreateCategoryParams,
  CreateCategoryResponse,
  DeleteCategoryParams,
  DeleteCategoryResponse,
  UpdateCategoryParams,
  UpdateCategoryResponse,
} from "@/types/category.type";

export const DEFAULT_LIMIT = 10;

export async function fetchCategories(options: {
  offset?: number;
  search?: string;
  limit?: number;
}): Promise<CategoryListResult> {
  const { offset = 0, search, limit = 10 } = options;

  const queryParams: CategoryQueryParams = {
    limit,
    offset,
    ...(search && { search }),
  };

  const response = await api.get("/admin/categories", {
    params: queryParams,
  });

  // Backend returns: { success: true, data: { categories, currentPage, totalPages, pageSize }, message: null }
  return {
    categories: response.data?.data?.categories || [],
    currentPage: response.data?.data?.currentPage || 0,
    totalPages: response.data?.data?.totalPages || 0,
    pageSize: response.data?.data?.pageSize || 10,
  };
}

export async function fetchCategory(slug: string): Promise<CategoryType> {
  const response = await api.get(`/admin/categories/${slug}`);

  // Backend returns: { success: true, data: { category }, message: null }
  return response.data?.data?.category;
}

export async function createCategory(
  params: CreateCategoryParams,
): Promise<CreateCategoryResponse> {
  const response = await api.post("/admin/categories", {
    name: params.name.trim(),
  });

  // Backend returns: { success: true, data: { category }, message: string }
  return response.data;
}

export async function updateCategory(
  params: UpdateCategoryParams,
): Promise<UpdateCategoryResponse> {
  const response = await api.patch(`/admin/categories/${params.slug}`, {
    name: params.name.trim(),
  });

  // Backend returns: { success: true, data: { category }, message: string }
  return response.data;
}

export async function deleteCategory(
  params: DeleteCategoryParams,
): Promise<DeleteCategoryResponse> {
  const response = await api.delete(`/admin/categories/${params.slug}`);

  // Backend returns: { success: true, message: string }
  return response.data;
}

export async function fetchAllCategories(): Promise<CommonCategoryType[]> {
  const response = await api.get("/categories");

  return response.data?.data?.categories || [];
}
