import api from "@/lib/api";
import type {
  TypeListResult,
  TypeQueryParams,
  ProductTypeType,
  CreateTypeParams,
  CreateTypeResponse,
  DeleteTypeParams,
  DeleteTypeResponse,
  UpdateTypeParams,
  UpdateTypeResponse,
} from "@/types/type.type";

export const DEFAULT_LIMIT = 10;

export async function fetchTypes(options: {
  offset?: number;
  search?: string;
  limit?: number;
}): Promise<TypeListResult> {
  const { offset = 0, search, limit = 10 } = options;

  const queryParams: TypeQueryParams = {
    limit,
    offset,
    ...(search && { search }),
  };

  const response = await api.get("/admin/types", {
    params: queryParams,
  });

  // Backend returns: { success: true, data: { types, currentPage, totalPages, pageSize }, message: null }
  return {
    types: response.data?.data?.types || [],
    currentPage: response.data?.data?.currentPage || 0,
    totalPages: response.data?.data?.totalPages || 0,
    pageSize: response.data?.data?.pageSize || 10,
  };
}

export async function fetchType(slug: string): Promise<ProductTypeType> {
  const response = await api.get(`/admin/types/${slug}`);

  // Backend returns: { success: true, data: { type }, message: null }
  return response.data?.data?.type;
}

export async function createType(
  params: CreateTypeParams,
): Promise<CreateTypeResponse> {
  const response = await api.post("/admin/types", {
    name: params.name.trim(),
  });

  // Backend returns: { success: true, data: { type }, message: string }
  return response.data;
}

export async function updateType(
  params: UpdateTypeParams,
): Promise<UpdateTypeResponse> {
  const response = await api.patch(`/admin/types/${params.slug}`, {
    name: params.name.trim(),
  });

  // Backend returns: { success: true, data: { type }, message: string }
  return response.data;
}

export async function deleteType(
  params: DeleteTypeParams,
): Promise<DeleteTypeResponse> {
  const response = await api.delete(`/admin/types/${params.slug}`);

  // Backend returns: { success: true, message: string }
  return response.data;
}

