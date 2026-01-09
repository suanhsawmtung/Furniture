import { queryClient } from "@/lib/query-client";
import { updateMaterial } from "@/services/material/api";
import { materialQueryKeys } from "@/services/material/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for updating a material
export async function action({ request, params }: ActionFunctionArgs) {
  const { slug } = params;
  const formData = await request.formData();

  if (!slug) {
    throw new Response("Material slug is required", { status: 400 });
  }

  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    toast.error("Material name is required");
    return { error: "Material name is required" };
  }

  try {
    const response = await updateMaterial({ slug, name });

    // Show success toast
    toast.success(response.message || "Material updated successfully");

    await queryClient.invalidateQueries({
      queryKey: materialQueryKeys.detail(slug),
    });

    await queryClient.invalidateQueries({
      queryKey: materialQueryKeys.lists,
    });

    // Redirect to materials list page
    return redirect("/admin/materials");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to update material");
      return { error: errorData?.message || "Failed to update material" };
    }
    throw error;
  }
}

