import { queryClient } from "@/lib/query-client";
import { updateCategory } from "@/services/category/api";
import { categoryQueryKeys } from "@/services/category/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for updating a category
export async function action({ request, params }: ActionFunctionArgs) {
  const { slug } = params;
  const formData = await request.formData();

  if (!slug) {
    throw new Response("Category slug is required", { status: 400 });
  }

  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    toast.error("Category name is required");
    return { error: "Category name is required" };
  }

  try {
    const response = await updateCategory({ slug, name });

    // Show success toast
    toast.success(response.message || "Category updated successfully");

    await queryClient.invalidateQueries({
      queryKey: categoryQueryKeys.detail(slug),
    });

    await queryClient.invalidateQueries({
      queryKey: categoryQueryKeys.lists,
    });

    return redirect("/admin/categories");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to update category");
      return { error: errorData?.message || "Failed to update category" };
    }
    throw error;
  }
}
