import { queryClient } from "@/lib/query-client";
import { updateUser } from "@/services/user/api";
import { userQueryKeys } from "@/services/user/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for updating a user
export async function action({ request, params }: ActionFunctionArgs) {
  const { username } = params;
  const formData = await request.formData();

  if (!username) {
    throw new Response("User username is required", { status: 400 });
  }

  try {
    const response = await updateUser(username, formData);

    await queryClient.invalidateQueries({
      queryKey: userQueryKeys.detail(username),
    });

    await queryClient.invalidateQueries({
      queryKey: userQueryKeys.lists,
    });

     // Show success toast
    toast.success(response.message || "User updated successfully");

    return redirect("/admin/users");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to update user");
      return { error: errorData?.message || "Failed to update user" };
    }
    throw error;
  }
}
