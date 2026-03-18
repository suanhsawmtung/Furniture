import z from "zod";

export const refundSchema = z.object({
  orderCode: z.string().min(1, "Order code is required"),
  amount: z.coerce.number().min(0.01, "Amount must be at least 0.01"),
  reason: z
    .string()
    .trim()
    .min(1, "Reason is required")
    .max(500, "Reason must be 500 characters or less"),
});

export const updateRefundSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Reason is required")
    .max(500, "Reason must be 500 characters or less"),
});

export const RefundFilterFormSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["PENDING", "SUCCESS", "FAILED", "VOIDED"]).optional(),
});
