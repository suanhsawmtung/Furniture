import { isPostStatus } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/services/post/api";
import { ensureListPosts } from "@/services/post/queries/useGetPosts";

import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

// Loader for posts list page - fetches all posts with pagination
// Uses page parameter from URL (page 1, 2, 3, ...)
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
      const cleanUrl = new URL("/admin/posts", request.url);
      const searchParam = searchParams.get("search");
      const categoryParam = searchParams.get("category");
      if (searchParam) {
        cleanUrl.searchParams.set("search", searchParam);
      }
      if (categoryParam) {
        cleanUrl.searchParams.set("category", categoryParam);
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

  // Parse category parameter (slug string)
  const categoryParam = searchParams.get("category");
  const category =
    typeof categoryParam === "string" && categoryParam.trim().length > 0
      ? categoryParam.trim()
      : undefined;

  const statusParam = searchParams.get("status");
  const status = isPostStatus(statusParam) ? statusParam : undefined;

  // Convert page to offset (page 1 = offset 0, page 2 = offset 10, etc.)
  const offset = (page - 1) * DEFAULT_LIMIT;

  try {
    await ensureListPosts({
      offset,
      search,
      limit: DEFAULT_LIMIT,
      category,
      status,
    });

    return null;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Response("Invalid query parameters", { status: 400 });
    }
    throw error;
  }
}
