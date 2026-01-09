import z from "zod";

export const resendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Invalid email address!")
    .pipe(
      z
        .email({ message: "Invalid email address!" })
        .transform((val) => val.toLowerCase()),
    ),
});

export type ResendOtpFormValues = z.infer<typeof resendOtpSchema>;
