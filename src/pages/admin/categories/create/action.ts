import { queryClient } from "@/lib/query-client";
import { createCategory } from "@/services/category/api";
import { categoryQueryKeys } from "@/services/category/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for creating a category
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    toast.error("Category name is required");
    return { error: "Category name is required" };
  }

  try {
    const response = await createCategory({ name });

    await queryClient.invalidateQueries({
      queryKey: categoryQueryKeys.all,
    });

    // Show success toast
    toast.success(response.message || "Category created successfully");

    // Redirect to categories list page
    return redirect("/admin/categories");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to create category");
      return { error: errorData?.message || "Failed to create category" };
    }
    throw error;
  }
}
