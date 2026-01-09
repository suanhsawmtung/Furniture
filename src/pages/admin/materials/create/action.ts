import { queryClient } from "@/lib/query-client";
import { createMaterial } from "@/services/material/api";
import { materialQueryKeys } from "@/services/material/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for creating a material
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    toast.error("Material name is required");
    return { error: "Material name is required" };
  }

  try {
    const response = await createMaterial({ name });

    // Show success toast
    toast.success(response.message || "Material created successfully");

    await queryClient.invalidateQueries({
      queryKey: materialQueryKeys.all,
    });

    // Redirect to materials list page
    return redirect("/admin/materials");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to create material");
      return { error: errorData?.message || "Failed to create material" };
    }
    throw error;
  }
}

