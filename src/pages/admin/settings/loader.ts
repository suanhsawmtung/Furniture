import { ensureGetMe } from "@/services/setting/queries/useGetMe";

export async function loader() {
  try {
    await ensureGetMe();
    return null;
  } catch (error) {
    throw error;
  }
}
