import { ensureProductVariant } from "@/services/product/queries/useGetProductVariant";
import type { LoaderFunctionArgs } from "react-router";

// Loader for product variant detail page - fetches variant by product slug and variant slug
export async function loader({ params }: LoaderFunctionArgs) {
  const { slug, variantSlug } = params;

  if (!slug) {
    throw new Response("Product slug is required", { status: 400 });
  }

  if (!variantSlug) {
    throw new Response("Variant slug is required", { status: 400 });
  }

  try {
    await ensureProductVariant(slug, variantSlug);

    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Response("Product variant not found", { status: 404 });
    }
    throw error;
  }
}
