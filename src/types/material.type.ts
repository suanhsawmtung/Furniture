export type MaterialType = {
  id: number;
  name: string;
  slug: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  _count: {
    products: number;
  };
};

export interface MaterialListResult {
  materials: MaterialType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface MaterialQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface CreateMaterialParams {
  name: string;
}

export interface CreateMaterialResponse {
  success: boolean;
  message: string;
  data: {
    material: MaterialType;
  };
}

export interface UpdateMaterialParams {
  slug: string;
  name: string;
}

export interface UpdateMaterialResponse {
  success: boolean;
  message: string;
  data: {
    material: MaterialType;
  };
}

export interface DeleteMaterialParams {
  slug: string;
}

export interface DeleteMaterialResponse {
  success: boolean;
  message: string;
}
