import api from "@/lib/api";
import type { LoaderFunctionArgs } from "react-router";

// Loader for products list page
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const categories = url.searchParams.get("categories");
  const page = url.searchParams.get("page") || "1";

  try {
    const response = await api.get("/products", {
      params: {
        categories,
        page,
      },
    });

    return {
      products: response.data.products,
      pagination: response.data.pagination,
    };
  } catch (error) {
    // Handle error
    return {
      products: [],
      pagination: null,
      error: "Failed to load products",
    };
  }
}
