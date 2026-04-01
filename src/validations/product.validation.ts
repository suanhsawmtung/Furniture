import { z } from "zod";

const currentYear = new Date().getFullYear();

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  description: z.string().trim().min(1, "Description is required"),
  concentration: z.enum(["EDC", "EDT", "EDP", "PARFUM"], {
    message: "Concentration is required",
  }),
  gender: z.enum(["MALE", "FEMALE", "UNISEX"], { message: "Gender is required" }),
  brandId: z.string().min(1, "Brand is required"),
  isActive: z.boolean().optional(),
  isLimited: z.boolean().optional(),
  releasedYear: z
    .number()
    .int("Released year must be a valid year")
    .min(1900, "Released year must be 1900 or later")
    .max(currentYear, "Released year must not be in the future")
    .optional(),
});

export const ProductFilterFormSchema = z.object({
  search: z.string().optional(),
  brand: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "UNISEX"]).optional(),
  concentration: z.enum(["EDC", "EDT", "EDP", "PARFUM"]).optional(),
  isActive: z.boolean().optional(),
  isLimited: z.boolean().optional(),
});

export const productVariantSchema = z.object({
  size: z
    .number()
    .int("Size must be a valid number")
    .min(1, "Size is required"),
  source: z.enum(["ORIGINAL", "DECANT"]).optional(),
  price: z
    .number()
    .min(0, "Price must be a positive number")
    .refine((value) => Number.isFinite(value), "Price must be a valid number"),
  discount: z.number().min(0, "Discount must be a positive number").optional(),
  isPrimary: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "At least one image is required as the primary product image")
    .max(4, "You can upload up to 4 images"),
})
.refine((data) => (data.discount ?? 0) <= data.price, {
  message: "Discount cannot be greater than price",
  path: ["discount"],
});

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;
