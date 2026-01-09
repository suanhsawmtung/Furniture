import { ensureMaterial } from "@/services/material/queries/useGetMaterial";
import type { LoaderFunctionArgs } from "react-router";

// Loader for material delete page - fetches material data by slug
export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Material slug is required", { status: 400 });
  }

  try {
    await ensureMaterial(slug);

    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Response("Material not found", { status: 404 });
    }
    throw error;
  }
}
