import { queryClient } from "@/lib/query-client";
import { deleteCategory } from "@/services/category/api";
import { categoryQueryKeys } from "@/services/category/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for deleting a category
export async function action({ params }: ActionFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Category slug is required", { status: 400 });
  }

  try {
    const response = await deleteCategory({ slug });

    // Show success toast
    toast.success(response.message || "Category deleted successfully");

    queryClient.removeQueries({
      queryKey: categoryQueryKeys.detail(slug),
    });

    await queryClient.invalidateQueries({
      queryKey: categoryQueryKeys.lists,
    });

    return redirect("/admin/categories");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to delete category");
      return { error: errorData?.message || "Failed to delete category" };
    }
    throw error;
  }
}
