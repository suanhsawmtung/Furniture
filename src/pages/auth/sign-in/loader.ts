import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // Add any pre-load logic here
  console.log(request);
  return null;
}
