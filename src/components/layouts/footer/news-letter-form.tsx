import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SendHorizonal } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const subscriberSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
});

const NewsLetterForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof subscriberSchema>>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof subscriberSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Form submitted with values:", values);
        resolve(true);
      }, 4000);
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 sm:w-3/5 xl:w-full 2xl:w-3/5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Subscribe to our newsletter
              </FormLabel>
              <div className="relative">
                <FormLabel className="sr-only">
                  Enter your email address
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <div className="absolute top-1 right-1">
                  <Button
                    type="submit"
                    disabled={
                      form.formState.isSubmitting || !form.formState.isValid
                    }
                    className="size-7 cursor-pointer"
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <SendHorizonal />
                    )}
                  </Button>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default NewsLetterForm;
