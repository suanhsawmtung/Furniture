import { queryClient } from "@/lib/query-client";
import { updateType } from "@/services/type/api";
import { typeQueryKeys } from "@/services/type/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for updating a type
export async function action({ request, params }: ActionFunctionArgs) {
  const { slug } = params;
  const formData = await request.formData();

  if (!slug) {
    throw new Response("Type slug is required", { status: 400 });
  }

  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    toast.error("Type name is required");
    return { error: "Type name is required" };
  }

  try {
    const response = await updateType({ slug, name });

    // Show success toast
    toast.success(response.message || "Type updated successfully");

    await queryClient.invalidateQueries({
      queryKey: typeQueryKeys.detail(slug),
    });

    await queryClient.invalidateQueries({
      queryKey: typeQueryKeys.lists,
    });

    // Redirect to types list page
    return redirect("/admin/types");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to update type");
      return { error: errorData?.message || "Failed to update type" };
    }
    throw error;
  }
}

