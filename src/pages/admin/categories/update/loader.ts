import { ensureCategory } from "@/services/category/queries/useGetCategory";
import type { LoaderFunctionArgs } from "react-router";

// Loader for category update page - fetches category data by slug
export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Category slug is required", { status: 400 });
  }

  try {
    await ensureCategory(slug);

    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Response("Category not found", { status: 404 });
    }
    throw error;
  }
}
