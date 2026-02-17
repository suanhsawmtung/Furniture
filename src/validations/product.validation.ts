import type {
    Concentration,
    Gender,
    VariantSource,
} from "@/types/product.type";
import { z } from "zod";

const concentrationValues: Concentration[] = ["EDC", "EDT", "EDP", "PARFUM"];
const genderValues: Gender[] = ["MALE", "FEMALE", "UNISEX"];
const variantSourceValues: VariantSource[] = ["ORIGINAL", "DECANT"];
const currentYear = new Date().getFullYear();

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  description: z.string().trim().min(1, "Description is required"),
  concentration: z.enum(concentrationValues, {
    message: "Concentration is required",
  }),
  gender: z.enum(genderValues, { message: "Gender is required" }),
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
  gender: z.enum(genderValues).optional(),
  concentration: z.enum(concentrationValues).optional(),
  isActive: z.boolean().optional(),
  isLimited: z.boolean().optional(),
});

export type ProductFilterFormValues = z.infer<typeof ProductFilterFormSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;

export const productVariantSchema = z.object({
  size: z
    .number()
    .int("Size must be a valid number")
    .min(1, "Size is required"),
  source: z.enum(variantSourceValues).optional(),
  price: z
    .number()
    .min(0, "Price must be a positive number")
    .refine((value) => Number.isFinite(value), "Price must be a valid number"),
  discount: z.number().min(0, "Discount must be a positive number").optional(),
  stock: z
    .number()
    .int("Stock must be a valid number")
    .min(0, "Stock must be a non-negative integer")
    .optional(),
  isPrimary: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "At least one image is required as the primary product image")
    .max(4, "You can upload up to 4 images"),
});

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;
