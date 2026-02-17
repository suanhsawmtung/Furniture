import api from "@/lib/api";
import type {
  Concentration,
  CreateProductParams,
  CreateProductResponse,
  CreateProductVariantResponse,
  DeleteProductResponse,
  DeleteProductVariantResponse,
  Gender,
  ProductDetailType,
  ProductListResult,
  ProductQueryParams,
  ProductVariantDetailType,
  ProductVariantsSummaryType,
  UpdateProductParams,
  UpdateProductResponse,
} from "@/types/product.type";

export const DEFAULT_LIMIT = 10;

export async function fetchProducts(options: {
  offset?: number;
  search?: string;
  limit?: number;
  brand?: string;
  gender?: Gender;
  concentration?: Concentration;
  isActive?: boolean;
  isLimited?: boolean;
}): Promise<ProductListResult> {
  const {
    offset = 0,
    search,
    limit = 10,
    brand,
    gender,
    concentration,
    isActive,
    isLimited,
  } = options;

  const queryParams: ProductQueryParams = {
    limit,
    offset,
    ...(search && { search }),
    ...(brand && { brandSlug: brand }),
    ...(gender && { gender }),
    ...(concentration && { concentration }),
    ...(typeof isActive === "boolean" && { isActive }),
    ...(typeof isLimited === "boolean" && { isLimited }),
  };

  const response = await api.get("/admin/products", {
    params: queryParams,
  });

  // Backend returns: { success: true, data: { products, currentPage, totalPages, pageSize }, message: null }
  return {
    products: response.data?.data?.products || [],
    currentPage: response.data?.data?.currentPage || 0,
    totalPages: response.data?.data?.totalPages || 0,
    pageSize: response.data?.data?.pageSize || 10,
  };
}

export async function fetchProduct(slug: string): Promise<ProductDetailType> {
  const response = await api.get(`/admin/products/${slug}`);

  // Backend returns: { success: true, data: { product }, message: null }
  return response.data?.data?.product;
}

export async function fetchProductVariants(
  slug: string,
): Promise<ProductVariantsSummaryType> {
  const response = await api.get(`/admin/products/${slug}/variants`);

  // Backend returns: { success: true, data: { product }, message: null }
  return response.data?.data?.product;
}

export async function fetchProductVariant(
  slug: string,
  variantSlug: string,
): Promise<ProductVariantDetailType> {
  const response = await api.get(
    `/admin/products/${slug}/variants/${variantSlug}`,
  );

  // Backend returns: { success: true, data: { variant }, message: null }
  return response.data?.data?.variant;
}

export async function createProduct(
  params: CreateProductParams,
): Promise<CreateProductResponse> {
  const response = await api.post("/admin/products", params);

  // Backend returns: { success: true, data: { product }, message: string }
  return response.data;
}

export async function updateProduct(
  slug: string,
  params: UpdateProductParams,
): Promise<UpdateProductResponse> {
  const response = await api.patch(`/admin/products/${slug}`, params);

  // Backend returns: { success: true, data: { product }, message: string }
  return response.data;
}

export async function deleteProduct({
  slug,
}: {
  slug: string;
}): Promise<DeleteProductResponse> {
  const response = await api.delete(`/admin/products/${slug}`);

  // Backend returns: { success: true, message: string }
  return response.data;
}

export async function createProductVariant(
  slug: string,
  formData: FormData,
): Promise<CreateProductVariantResponse> {
  const response = await api.post(
    `/admin/products/${slug}/variants/create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  // Backend returns: { success: true, data: { variant }, message: string }
  return response.data;
}

export async function updateProductVariant(
  slug: string,
  variantSlug: string,
  formData: FormData,
): Promise<CreateProductVariantResponse> {
  const response = await api.patch(
    `/admin/products/${slug}/variants/${variantSlug}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  // Backend returns: { success: true, data: { variant }, message: string }
  return response.data;
}

export async function deleteProductVariant({
  productSlug,
  variantSlug,
}: {
  productSlug: string;
  variantSlug: string;
}): Promise<DeleteProductVariantResponse> {
  const response = await api.delete(
    `/admin/products/${productSlug}/variants/${variantSlug}`,
  );

  // Backend returns: { success: true, message: string }
  return response.data;
}
