import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .transform((val) => val.toLowerCase()),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  role: z.enum(["USER", "ADMIN", "AUTHOR"]),
  status: z.enum(["ACTIVE", "INACTIVE", "FREEZE"]),
});

export const UserFilterFormSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["USER", "ADMIN", "AUTHOR"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "FREEZE"]).optional(),
});