import { ensurePost } from "@/services/post/queries/useGetPost";
import type { LoaderFunctionArgs } from "react-router";

// Loader for post edit page - fetches post data by slug
export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Post slug is required", { status: 400 });
  }

  try {
    await ensurePost(slug);

    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Response("Post not found", { status: 404 });
    }
    throw error;
  }
}
