import z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  categoryId: z.string().min(1, "Category is required"),
  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt must be 500 characters or less"),
  content: z.string().trim().min(1, "Content is required"),
  image: z.instanceof(File).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});