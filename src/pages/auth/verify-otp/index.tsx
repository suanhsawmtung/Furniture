import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthActionResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useActionData,
  useFetcher,
  useNavigation,
  useSubmit,
} from "react-router";
import z from "zod";
import { resendOtpSchema, type ResendOtpFormValues } from "./resend-schema";

const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "Invalid Otp!")
    .regex(/^[0-9]+$/, "Invalid Otp!")
    .length(6, "Invalid Otp!"),
});

type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

const VerifyOtpPage = () => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<AuthActionResponse>();
  const resendFetcher = useFetcher<AuthActionResponse>();
  const authFlow = useAuthStore((state) => state.authFlow);
  const isSubmitting = navigation.state === "submitting";
  const isResending = resendFetcher.state === "submitting";

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Resend OTP form
  const resendForm = useForm<ResendOtpFormValues>({
    resolver: zodResolver(resendOtpSchema),
    defaultValues: {
      email: authFlow?.email || "",
    },
  });

  const onSubmit = (values: VerifyOtpFormValues) => {
    // Determine action path based on flow
    const actionPath =
      authFlow?.flow === "sign-up" ? "/verify-otp" : "/verify-password-otp";

    submit(values, {
      method: "POST",
      action: actionPath,
    });
  };

  const onResendSubmit = (values: ResendOtpFormValues) => {
    // Determine resend action path based on flow
    const resendActionPath =
      authFlow?.flow === "sign-up"
        ? "/verify-otp/resend"
        : "/verify-password-otp/resend";

    resendFetcher.submit(values, {
      method: "POST",
      action: resendActionPath,
    });
  };

  // Show error if no authFlow
  if (!authFlow) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-6 md:w-1/2 lg:w-2/3 xl:w-1/2">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>OTP Code</FormLabel> */}
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <InputOTPGroup className="flex w-full items-center justify-between">
                            <InputOTPSlot
                              className="rounded-md border"
                              index={0}
                            />
                            <InputOTPSlot
                              className="rounded-md border"
                              index={1}
                            />
                            <InputOTPSlot
                              className="rounded-md border"
                              index={2}
                            />
                            <InputOTPSlot
                              className="rounded-md border"
                              index={3}
                            />
                            <InputOTPSlot
                              className="rounded-md border"
                              index={4}
                            />
                            <InputOTPSlot
                              className="rounded-md border"
                              index={5}
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  {actionData && actionData.message && (
                    <p className="text-xs text-red-400">{actionData.message}</p>
                  )}

                  {resendFetcher.data && resendFetcher.data.message && (
                    <p
                      className={`text-xs ${
                        resendFetcher.data.success
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {resendFetcher.data.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          <div className="text-center text-sm">
            Didn&apos;t receive the code?{" "}
            <Form {...resendForm}>
              <form
                onSubmit={resendForm.handleSubmit(onResendSubmit)}
                className="inline"
              >
                <input type="hidden" {...resendForm.register("email")} />
                <button
                  type="submit"
                  disabled={isResending || isSubmitting}
                  className="cursor-pointer underline underline-offset-4 disabled:opacity-50"
                >
                  {isResending ? "Resending..." : "Resend"}
                </button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtpPage;
