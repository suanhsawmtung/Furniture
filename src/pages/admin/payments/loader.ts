import { ensureListPayments } from "@/services/payment/queries/useGetPayments";
import type { PaymentMethod, PaymentStatus } from "@/types/payment.type";
import { redirect, type LoaderFunctionArgs } from "react-router";

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

  const methodParam = searchParams.get("method");
  const method = methodParam || undefined;

  const limit = 10;
  const offset = (page - 1) * limit;

  try {
      await ensureListPayments({
        limit,
        offset,
        search,
        method: method as PaymentMethod,
        status: status as PaymentStatus,
      });
  
      return null;
    } catch (error: any) {
      throw error;
    }
}
