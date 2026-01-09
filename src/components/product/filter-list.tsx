"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import type { CategoryType } from "@/types";
import type { HTMLAttributes } from "react";
import ProductFormItem from "./product-form-item";

interface Props extends HTMLAttributes<HTMLElementTagNameMap["aside"]> {
  filterLists: {
    categories: CategoryType[];
    types: CategoryType[];
  };
}

export const ProductFilterFormSchema = z.object({
  categories: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  types: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export type ProductFilterFormSchemaType = z.infer<
  typeof ProductFilterFormSchema
>;

const FilterList = ({ filterLists, ...props }: Props) => {
  const form = useForm<ProductFilterFormSchemaType>({
    resolver: zodResolver(ProductFilterFormSchema),
    defaultValues: {
      categories: ["recents", "home"],
    },
  });

  function onSubmit(data: ProductFilterFormSchemaType) {
    console.log(data);
  }

  return (
    <aside {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <ProductFormItem
                title="Furniture made by"
                items={filterLists.categories}
                control={form.control}
                name="categories"
              />
            )}
          />

          <FormField
            control={form.control}
            name="types"
            render={() => (
              <ProductFormItem
                title="Furniture types"
                items={filterLists.types}
                control={form.control}
                name="types"
              />
            )}
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className="w-full cursor-pointer"
            variant="outline"
          >
            Filter
          </Button>
        </form>
      </Form>
    </aside>
  );
};

export default FilterList;
