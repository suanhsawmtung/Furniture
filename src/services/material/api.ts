import api from "@/lib/api";
import type {
    CreateMaterialParams,
    CreateMaterialResponse,
    DeleteMaterialParams,
    DeleteMaterialResponse,
    MaterialListResult,
    MaterialQueryParams,
    MaterialType,
    UpdateMaterialParams,
    UpdateMaterialResponse,
} from "@/types/material.type";

export const DEFAULT_LIMIT = 10;

export async function fetchMaterials(options: {
  offset?: number;
  search?: string;
  limit?: number;
}): Promise<MaterialListResult> {
  const { offset = 0, search, limit = 10 } = options;

  const queryParams: MaterialQueryParams = {
    limit,
    offset,
    ...(search && { search }),
  };

  const response = await api.get("/admin/materials", {
    params: queryParams,
  });

  // Backend returns: { success: true, data: { materials, currentPage, totalPages, pageSize }, message: null }
  return {
    materials: response.data?.data?.materials || [],
    currentPage: response.data?.data?.currentPage || 0,
    totalPages: response.data?.data?.totalPages || 0,
    pageSize: response.data?.data?.pageSize || 10,
  };
}

export async function fetchMaterial(slug: string): Promise<MaterialType> {
  const response = await api.get(`/admin/materials/${slug}`);

  // Backend returns: { success: true, data: { material }, message: null }
  return response.data?.data?.material;
}

export async function createMaterial(
  params: CreateMaterialParams,
): Promise<CreateMaterialResponse> {
  const response = await api.post("/admin/materials", {
    name: params.name.trim(),
  });

  // Backend returns: { success: true, data: { material }, message: string }
  return response.data;
}

export async function updateMaterial(
  params: UpdateMaterialParams,
): Promise<UpdateMaterialResponse> {
  const response = await api.patch(`/admin/materials/${params.slug}`, {
    name: params.name.trim(),
  });

  // Backend returns: { success: true, data: { material }, message: string }
  return response.data;
}

export async function deleteMaterial(
  params: DeleteMaterialParams,
): Promise<DeleteMaterialResponse> {
  const response = await api.delete(`/admin/materials/${params.slug}`);

  // Backend returns: { success: true, message: string }
  return response.data;
}

