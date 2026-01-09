import { ensureType } from "@/services/type/queries/useGetType";
import type { LoaderFunctionArgs } from "react-router";

// Loader for type update page - fetches type data by slug
export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Type slug is required", { status: 400 });
  }

  try {
    await ensureType(slug);

    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Response("Type not found", { status: 404 });
    }
    throw error;
  }
}
