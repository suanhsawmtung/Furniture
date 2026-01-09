import api from "@/lib/api";

// Loader for home page
export async function loader() {
  try {
    // Fetch featured products, recent blogs, etc.
    const [productsResponse, blogsResponse] = await Promise.all([
      api.get("/products/featured"),
      api.get("/blogs/recent"),
    ]);

    return {
      featuredProducts: productsResponse.data,
      recentBlogs: blogsResponse.data,
    };
  } catch (error) {
    // Return empty data on error, or handle differently
    return {
      featuredProducts: [],
      recentBlogs: [],
    };
  }
}
