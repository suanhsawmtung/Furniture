import api from "@/lib/api";
import type { LoaderFunctionArgs } from "react-router";

// Loader for product detail page
export async function loader({ params }: LoaderFunctionArgs) {
  const { productId } = params;

  try {
    const response = await api.get(`/products/${productId}`);
    return {
      product: response.data,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Response("Product not found", { status: 404 });
    }
    throw error;
  }
}
