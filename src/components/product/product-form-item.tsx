import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Category } from "@/types";
import type { Control, Path } from "react-hook-form";
import type { ProductFilterFormSchemaType } from "./filter-list";

interface Props {
  title: string;
  items: Category[];
  control: Control<ProductFilterFormSchemaType>;
  name: Path<ProductFilterFormSchemaType>;
}

const ProductFormItem = ({ title, items, control, name }: Props) => {
  return (
    <FormItem>
      <div className="mb-2">
        <FormLabel className="text-base">{title}</FormLabel>
      </div>
      {items.map((item) => (
        <FormField
          key={item.id}
          control={control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem
                key={item.id}
                className="flex flex-row items-center gap-2"
              >
                <FormControl>
                  <Checkbox
                    checked={(field.value as string[])?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([
                            ...(field.value as string[]),
                            item.id,
                          ])
                        : field.onChange(
                            (field.value as string[])?.filter(
                              (value) => value !== item.id,
                            ),
                          );
                    }}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  {item.label}
                </FormLabel>
              </FormItem>
            );
          }}
        />
      ))}
      <FormMessage />
    </FormItem>
  );
};

export default ProductFormItem;
