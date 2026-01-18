import { queryClient } from "@/lib/query-client";
import { createUser } from "@/services/user/api";
import { userQueryKeys } from "@/services/user/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for creating a user
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  try {
    const response = await createUser(formData);

    await queryClient.invalidateQueries({
      queryKey: userQueryKeys.all,
    });

    // Show success toast
    toast.success(response.message || "User created successfully");

    // Redirect to users list page
    return redirect("/admin/users");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to create user");
      return { error: errorData?.message || "Failed to create user" };
    }
    throw error;
  }
}
