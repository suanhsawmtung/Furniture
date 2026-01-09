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
import type { MaterialType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useNavigation, useSubmit } from "react-router";
import z from "zod";

const materialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Material name is required")
    .max(52, "Material name must be 52 characters or less"),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

interface MaterialFormProps {
  material?: MaterialType;
  cancelUrl?: string;
  submitButtonText?: string;
}

export function MaterialForm({
  material,
  cancelUrl = "/admin/materials",
  submitButtonText,
}: MaterialFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: material?.name || "",
    },
  });

  const onSubmit = (values: MaterialFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    submit(formData, {
      method: "POST",
    });
  };

  const isUpdate = !!material;
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
                  placeholder={material?.name}
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

