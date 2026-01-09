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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth.store";
import type { AuthActionResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionData, useNavigation, useSubmit } from "react-router";
import z from "zod";

const confirmPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, "Invalid password!")
      .min(8, "Password must be between 8 and 12 characters")
      .max(12, "Password must be between 8 and 12 characters"),
    confirmedPassword: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

type ConfirmPasswordFormValues = z.infer<typeof confirmPasswordSchema>;

const ConfirmPasswordPage = () => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<AuthActionResponse>();
  const authFlow = useAuthStore((state) => state.authFlow);
  const isSubmitting = navigation.state === "submitting";

  const form = useForm<ConfirmPasswordFormValues>({
    resolver: zodResolver(confirmPasswordSchema),
    defaultValues: {
      password: "",
      confirmedPassword: "",
    },
  });

  const onSubmit = (values: ConfirmPasswordFormValues) => {
    submit(values, {
      method: "POST",
      action: "/confirm-password",
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
          <CardTitle className="text-xl">Confirm Password</CardTitle>
          <CardDescription>
            Enter your new password and confirm it below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmedPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {actionData && actionData.message && (
                    <p className="text-xs text-red-400">{actionData.message}</p>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Confirming..." : "Confirm Password"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmPasswordPage;
