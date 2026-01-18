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
import type { ProductTypeType } from "@/types";
import type { TypeFormValues } from "@/types/type.type";
import { typeSchema } from "@/validations/common.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useNavigation, useSubmit } from "react-router";

interface TypeFormProps {
  type?: ProductTypeType;
  cancelUrl?: string;
  submitButtonText?: string;
}

export function TypeForm({
  type,
  cancelUrl = "/admin/types",
  submitButtonText,
}: TypeFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const form = useForm<TypeFormValues>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      name: type?.name || "",
    },
  });

  const onSubmit = (values: TypeFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    submit(formData, {
      method: "POST",
    });
  };

  const isUpdate = !!type;
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
                  placeholder={type?.name}
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

