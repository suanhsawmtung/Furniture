import { ensureRefund } from "@/services/refund/queries/useGetRefund";
import type { LoaderFunctionArgs } from "react-router";

// Loader for refund edit page - fetches refund data by ID
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    throw new Response("Refund ID is required", { status: 400 });
  }

  const refundId = Number(id);
  if (isNaN(refundId)) {
    throw new Response("Invalid Refund ID", { status: 400 });
  }

  try {
    await ensureRefund(refundId);
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Response("Refund not found", { status: 404 });
    }
    throw error;
  }
}
