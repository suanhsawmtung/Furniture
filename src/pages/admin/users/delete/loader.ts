import { ensureUser } from "@/services/user/queries/useGetUser";
import type { LoaderFunctionArgs } from "react-router";

// Loader for user delete page - fetches user data by username
export async function loader({ params }: LoaderFunctionArgs) {
  const { username } = params;

  if (!username) {
    throw new Response("User username is required", { status: 400 });
  }

  try {
    await ensureUser(username);

    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Response("User not found", { status: 404 });
    }
    throw error;
  }
}
