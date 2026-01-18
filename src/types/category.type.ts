import type { categorySchema } from "@/validations/common.validation";
import type z from "zod";

export type CategoryType = {
  id: number;
  name: string;
  slug: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  _count: {
    posts: number;
  };
};

export type CommonCategoryType = {
  id: number;
  name: string;
  slug: string;
};

export interface CategoryListResult {
  categories: CategoryType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface CategoryQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface CreateCategoryParams {
  name: string;
}

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data: {
    category: CategoryType;
  };
}

export interface UpdateCategoryParams {
  slug: string;
  name: string;
}

export interface UpdateCategoryResponse {
  success: boolean;
  message: string;
  data: {
    category: CategoryType;
  };
}

export interface DeleteCategoryParams {
  slug: string;
}

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}

export type CategoryFormValues = z.infer<typeof categorySchema>;
