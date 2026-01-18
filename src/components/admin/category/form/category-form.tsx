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
import type { CategoryType } from "@/types";
import type { CategoryFormValues } from "@/types/category.type";
import { categorySchema } from "@/validations/common.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useNavigation, useSubmit } from "react-router";

interface CategoryFormProps {
  category?: CategoryType;
  cancelUrl?: string;
  submitButtonText?: string;
}

export function CategoryForm({
  category,
  cancelUrl = "/admin/categories",
  submitButtonText,
}: CategoryFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  const isUpdate = !!category;

  const onSubmit = (values: CategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    submit(formData, {
      method: isUpdate ? "PATCH" : "POST",
    });
  };

  const buttonText = submitButtonText || (isUpdate ? "Update" : "Create");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={category?.name}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(cancelUrl)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
