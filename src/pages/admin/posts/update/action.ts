import { queryClient } from "@/lib/query-client";
import { updatePost } from "@/services/post/api";
import { postQueryKeys } from "@/services/post/key";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";

// Action for updating a post
export async function action({ request, params }: ActionFunctionArgs) {
  const { slug } = params;
  const formData = await request.formData();

  if (!slug) {
    throw new Response("Post slug is required", { status: 400 });
  }

  const title = formData.get("title") as string;
  const categoryId = formData.get("categoryId") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;

  if (!title || title.trim().length === 0) {
    toast.error("Title is required");
    return { error: "Title is required" };
  }

  if (!categoryId || categoryId.trim().length === 0) {
    toast.error("Category is required");
    return { error: "Category is required" };
  }

  if (!excerpt || excerpt.trim().length === 0) {
    toast.error("Excerpt is required");
    return { error: "Excerpt is required" };
  }

  if (!content || content.trim().length === 0) {
    toast.error("Content is required");
    return { error: "Content is required" };
  }

  try {
    const response = await updatePost(slug, formData);

    // Invalidate queries
    await queryClient.invalidateQueries({
      queryKey: postQueryKeys.detail(slug),
    });

    await queryClient.invalidateQueries({
      queryKey: postQueryKeys.all,
    });

    // Show success toast
    toast.success(response.message || "Post updated successfully");

    // Redirect to posts list page
    return redirect("/admin/posts");
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || "Failed to update post");
      return { error: errorData?.message || "Failed to update post" };
    }
    throw error;
  }
}
