import z from "zod";

export const paymentSchema = z.object({
  orderCode: z.string().min(1, "Order code is required"),
  method: z.enum(["BANK_TRANSFER", "CASH", "CARD", "E_WALLET"]),
  amount: z.preprocess((val) => Number(val), z.number().min(0.01, "Amount must be at least 0.01")),
  reference: z.string().trim().max(255, "Reference must be 255 characters or less").optional().nullable(),
  note: z.string().trim().max(500, "Note must be 500 characters or less").optional().nullable(),
  paidAt: z.string().optional().nullable(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const updatePaymentSchema = z.object({
  method: z.enum(["BANK_TRANSFER", "CASH", "CARD", "E_WALLET"]).optional(),
  reference: z.string().trim().max(255, "Reference must be 255 characters or less").optional().nullable(),
  note: z.string().trim().max(500, "Note must be 500 characters or less").optional().nullable(),
  paidAt: z.string().optional().nullable(),
});

export const paymentFilterFormSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["PENDING", "SUCCESS", "FAILED", "VOIDED"]).optional(),
  method: z.enum(["BANK_TRANSFER", "CASH", "CARD", "E_WALLET"]).optional(),
});
