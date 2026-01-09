import { DEFAULT_LIMIT } from "@/services/category/api";
import { ensureListCategories } from "@/services/category/queries/useGetListCategories";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

// Loader for categories list page - fetches all categories with pagination
// Uses page parameter from URL (page 0, 1, 2, ...)
// If page is invalid or not a number, redirects to remove it from URL
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Parse page parameter
  const pageParam = searchParams.get("page");
  let page = 1;

  if (pageParam !== null) {
    const parsedPage = Number(pageParam);
    if (Number.isNaN(parsedPage) || parsedPage < 0) {
      // Invalid page parameter - redirect to remove it from URL
      const cleanUrl = new URL("/admin/categories", request.url);
      const searchParam = searchParams.get("search");
      if (searchParam) {
        cleanUrl.searchParams.set("search", searchParam);
      }
      return redirect(cleanUrl.toString());
    }
    page = parsedPage;
  }

  // Parse search parameter
  const searchParam = searchParams.get("search");
  const search =
    typeof searchParam === "string" && searchParam.trim().length > 0
      ? searchParam.trim()
      : undefined;

  // Convert page to offset (page 0 = offset 0, page 1 = offset 10, etc.)
  const offset = (page - 1) * DEFAULT_LIMIT;

  try {
    await ensureListCategories({
      offset,
      search,
      limit: DEFAULT_LIMIT,
    });

    return null;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Response("Invalid query parameters", { status: 400 });
    }
    throw error;
  }
}
