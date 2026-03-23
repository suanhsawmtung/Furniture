import { z } from "zod";

export const transactionTypeEnum = [
  "PAYMENT",
  "REFUND",
  "ADJUSTMENT",
  "REVERSAL",
  "EXPENSE",
  "WITHDRAWAL",
  "OTHER",
] as const;
export const transactionDirectionEnum = ["IN", "OUT"] as const;

export const transactionSchema = z.object({
  type: z.enum(transactionTypeEnum, {
    message: "Type is required",
  }),
  direction: z.enum(transactionDirectionEnum, {
    message: "Direction is required",
  }),
  amount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Amount must be a positive number")
  ),
  source: z.string().min(1, "Source is required").max(255),
  reference: z.string().max(255).optional().nullable().or(z.literal("")),
  note: z.string().max(500).optional().nullable().or(z.literal("")),
});

export const updateTransactionSchema = z.object({
  source: z.string().min(1, "Source is required").max(255),
  reference: z.string().max(255).optional().nullable().or(z.literal("")),
  note: z.string().max(500).optional().nullable().or(z.literal("")),
});

export const TransactionFilterFormSchema = z.object({
  search: z.string().optional(),
  type: z.enum(transactionTypeEnum).optional(),
  direction: z.enum(transactionDirectionEnum).optional(),
});
