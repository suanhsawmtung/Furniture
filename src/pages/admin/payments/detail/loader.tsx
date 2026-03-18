import { ensurePayment } from "@/services/payment/queries/useGetPayment";
import type { LoaderFunctionArgs } from "react-router";

// Loader for payment detail page - fetches payment data by ID
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    throw new Response("Payment ID is required", { status: 400 });
  }

  try {
    await ensurePayment(id);

    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Response("Payment not found", { status: 404 });
    }
    throw error;
  }
}
