import { queryClient } from "@/lib/query-client";
import { deleteMaterial } from "@/services/material/api";
import { materialQueryKeys } from "@/services/material/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for deleting a material
export async function action({ params }: ActionFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Material slug is required", { status: 400 });
  }

  try {
    const response = await deleteMaterial({ slug });

    queryClient.removeQueries({
      queryKey: materialQueryKeys.detail(slug),
    });

    await queryClient.invalidateQueries({
      queryKey: materialQueryKeys.lists,
    });

    // Show success toast
    toast.success(response.message || "Material deleted successfully");

    // Redirect to materials list page
    return redirect("/admin/materials");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to delete material");
      return { error: errorData?.message || "Failed to delete material" };
    }
    throw error;
  }
}
