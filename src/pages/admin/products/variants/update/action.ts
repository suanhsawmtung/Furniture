import { queryClient } from "@/lib/query-client";
import { updateProductVariant } from "@/services/product/api";
import { productQueryKeys } from "@/services/product/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for updating a product variant
export async function action({ request, params }: ActionFunctionArgs) {
  const { slug, variantSlug } = params;
  const formData = await request.formData();

  if (!slug) {
    throw new Response("Product slug is required", { status: 400 });
  }

  if (!variantSlug) {
    throw new Response("Variant slug is required", { status: 400 });
  }

  const size = formData.get("size") as string;
  const price = formData.get("price") as string;
  // images are optional in update mode if they exist on backend

  if (!size || size.trim().length === 0) {
    toast.error("Size is required");
    return { error: "Size is required" };
  }

  if (!price || price.trim().length === 0) {
    toast.error("Price is required");
    return { error: "Price is required" };
  }

  try {
    const response = await updateProductVariant(slug, variantSlug, formData);

    await queryClient.invalidateQueries({
      queryKey: productQueryKeys.variants(slug),
    });

    await queryClient.invalidateQueries({
      queryKey: productQueryKeys.detail(slug),
    });

    await queryClient.invalidateQueries({
      queryKey: productQueryKeys.variantDetail(slug, variantSlug),
    });

    toast.success(response.message || "Product variant updated successfully");

    return redirect(`/admin/products/${slug}/variants`);
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to update product variant");
      return {
        error: errorData?.message || "Failed to update product variant",
      };
    }
    throw error;
  }
}
