import { queryClient } from "@/lib/query-client";
import { deleteUser } from "@/services/user/api";
import { userQueryKeys } from "@/services/user/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for deleting a user
export async function action({ params }: ActionFunctionArgs) {
  const { username } = params;

  if (!username) {
    throw new Response("User username is required", { status: 400 });
  }

  try {
    const response = await deleteUser({ username });

    queryClient.removeQueries({
      queryKey: userQueryKeys.detail(username),
    });

    await queryClient.invalidateQueries({
      queryKey: userQueryKeys.lists,
    });

    // Show success toast
    toast.success(response.message || "User deleted successfully");

    return redirect("/admin/users");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to delete user");
      return { error: errorData?.message || "Failed to delete user" };
    }
    throw error;
  }
}
