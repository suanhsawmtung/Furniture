import { queryClient } from "@/lib/query-client";
import { deleteType } from "@/services/type/api";
import { typeQueryKeys } from "@/services/type/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for deleting a type
export async function action({ params }: ActionFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Type slug is required", { status: 400 });
  }

  try {
    const response = await deleteType({ slug });

    queryClient.removeQueries({
      queryKey: typeQueryKeys.detail(slug),
    });

    await queryClient.invalidateQueries({
      queryKey: typeQueryKeys.lists,
    });

    // Show success toast
    toast.success(response.message || "Type deleted successfully");

    // Redirect to types list page
    return redirect("/admin/types");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to delete type");
      return { error: errorData?.message || "Failed to delete type" };
    }
    throw error;
  }
}
