import { isOrderStatus, isPaymentStatus } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/services/order/api";
import { ensureListOrders } from "@/services/order/queries/useGetOrders";

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
      const cleanUrl = new URL("/admin/orders", request.url);
      const searchParam = searchParams.get("search");
      if (searchParam) {
        cleanUrl.searchParams.set("search", searchParam);
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
  const status = statusParam && isOrderStatus(statusParam) ? statusParam : undefined;

  const paymentStatusParam = searchParams.get("paymentStatus");
  const paymentStatus = paymentStatusParam && isPaymentStatus(paymentStatusParam) ? paymentStatusParam : undefined;

  const offset = (page - 1) * DEFAULT_LIMIT;

  try {
    await ensureListOrders({
      offset,
      search,
      limit: DEFAULT_LIMIT,
      status,
      paymentStatus,
    });

    return null;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Response("Invalid query parameters", { status: 400 });
    }
    throw error;
  }
}
