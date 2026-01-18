import { isRole, isStatus } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/services/user/api";
import { ensureListUsers } from "@/services/user/queries/useGetUsers";

import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

// Loader for users list page - fetches all users with pagination
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
      const cleanUrl = new URL("/admin/users", request.url);
      const searchParam = searchParams.get("search");
      const roleParam = searchParams.get("role");
      const statusParam = searchParams.get("status");
      if (searchParam) {
        cleanUrl.searchParams.set("search", searchParam);
      }
      if (roleParam && isRole(roleParam)) {
        cleanUrl.searchParams.set("role", roleParam);
      }
      if (statusParam && isStatus(statusParam)) {
        cleanUrl.searchParams.set("status", statusParam);
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

  // Parse role parameter
  const roleParam = searchParams.get("role");
  const role = isRole(roleParam) ? roleParam : undefined;

  // Parse status parameter
  const statusParam = searchParams.get("status");
  const status = isStatus(statusParam) ? statusParam : undefined;

  // Convert page to offset (page 1 = offset 0, page 2 = offset 10, etc.)
  const offset = (page - 1) * DEFAULT_LIMIT;

  try {
    await ensureListUsers({
      offset,
      search,
      limit: DEFAULT_LIMIT,
      role,
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
