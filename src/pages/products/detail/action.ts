import api from "@/lib/api";
import type { ActionFunctionArgs } from "react-router";

// Action for product-related actions (add to cart, favorite, etc.)
export async function action({ request, params }: ActionFunctionArgs) {
  const { productId } = params;
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    switch (intent) {
      case "add-to-cart":
        const quantity = formData.get("quantity");
        const response = await api.post(`/products/${productId}/cart`, {
          quantity,
        });
        return { success: true, data: response.data };

      case "add-to-favorite":
        const favResponse = await api.post(`/products/${productId}/favorite`);
        return { success: true, data: favResponse.data };

      default:
        return { success: false, error: "Unknown action" };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Action failed",
    };
  }
}
