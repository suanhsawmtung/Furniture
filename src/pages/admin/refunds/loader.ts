import { ensureListRefunds } from "@/services/refund/queries/useGetRefunds";
import type { RefundStatus } from "@/types/refund.type";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const pageParam = searchParams.get("page");
  let page = 1;

  if (pageParam !== null) {
    const parsedPage = Number(pageParam);
    if (Number.isNaN(parsedPage) || parsedPage < 0) {
      const cleanUrl = new URL("/admin/refunds", request.url);
      const searchParam = searchParams.get("search");
      const statusParam = searchParams.get("status");
      if (searchParam) {
        cleanUrl.searchParams.set("search", searchParam);
      }
      if (statusParam) {
        cleanUrl.searchParams.set("status", statusParam);
      }
      return redirect(cleanUrl.toString());
    }
    page = parsedPage;
  }

  const searchParam = searchParams.get("search");
  const search =
    typeof searchParam === "string" && searchParam.trim().length > 0
      ? searchParam.trim()
      : undefined;

  const statusParam = searchParams.get("status");
  const status = statusParam || undefined;

  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    await ensureListRefunds({
      limit,
      offset,
      search,
      status: status as RefundStatus,
    });

    return null;
  } catch (error: any) {
    throw error;
  }
}
