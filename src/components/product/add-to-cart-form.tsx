import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MinusIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

interface Props {
  canBuy: boolean;
}

const addToCartSchema = z.object({
  quantity: z.number().min(1).default(1),
});

const AddToCartForm = ({ canBuy }: Props) => {
  // 1. Define your form.
  const form = useForm<z.input<typeof addToCartSchema>>({
    resolver: zodResolver(addToCartSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.input<typeof addToCartSchema>) => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex flex-col gap-y-2.5">
          <div className="flex items-center gap-0">
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-r-none"
              type="button"
            >
              <MinusIcon className="size-4" />
              <span className="sr-only">Remove one item</span>
            </Button>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      className="h-8 w-16 rounded-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-l-none"
              type="button"
            >
              <PlusIcon className="size-4" />
              <span className="sr-only">Add one item</span>
            </Button>
          </div>
        </div>

        <div className="flex w-full items-center gap-x-2">
          <Button
            type="button"
            disabled={!canBuy}
            aria-label="Buy Now"
            className="bg-hero min-w-[150px] cursor-pointer font-bold"
            size="sm"
          >
            Buy Now
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
            className="min-w-[150px] cursor-pointer font-semibold"
            size="sm"
            aria-label="Add To Cart"
            variant={canBuy ? "outline" : "default"}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Add To Cart</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddToCartForm;
