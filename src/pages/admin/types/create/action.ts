import { queryClient } from "@/lib/query-client";
import { createType } from "@/services/type/api";
import { typeQueryKeys } from "@/services/type/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for creating a type
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    toast.error("Type name is required");
    return { error: "Type name is required" };
  }

  try {
    const response = await createType({ name });

    // Show success toast
    toast.success(response.message || "Type created successfully");

    await queryClient.invalidateQueries({
      queryKey: typeQueryKeys.all,
    });

    // Redirect to types list page
    return redirect("/admin/types");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to create type");
      return { error: errorData?.message || "Failed to create type" };
    }
    throw error;
  }
}

