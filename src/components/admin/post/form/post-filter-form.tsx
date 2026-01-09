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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllCategories } from "@/services/category/queries/useGetAllCategories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import z from "zod";

const PostFilterFormSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
});

type PostFilterFormValues = z.infer<typeof PostFilterFormSchema>;

export function PostFilterForm({ close }: { close: () => void }) {
  const { data: categories, isLoading: isLoadingCategories } =
    useGetAllCategories();

  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<PostFilterFormValues>({
    resolver: zodResolver(PostFilterFormSchema),
    defaultValues: {
      search: "",
      category: "",
    },
  });

  // Sync form with URL params when they change (but not from user interaction)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    form.reset({
      search,
      category,
    });
  }, [location.search, form]);

  const onSubmit = (data: PostFilterFormValues) => {
    const searchParams = new URLSearchParams(location.search);

    // Remove page param when filtering
    searchParams.delete("page");

    // Update search param
    if (data.search && data.search.trim()) {
      searchParams.set("search", data.search.trim());
    } else {
      searchParams.delete("search");
    }

    // Update category param
    if (data.category && data.category.trim()) {
      searchParams.set("category", data.category.trim());
    } else {
      searchParams.delete("category");
    }

    const queryString = searchParams.toString();
    navigate(`${location.pathname}${queryString ? `?${queryString}` : ""}`, {
      replace: true,
    });

    close();
  };

  const handleClear = () => {
    form.reset({
      search: "",
      category: "",
    });
    navigate(location.pathname, { replace: true });
    close();
  };

  if (isLoadingCategories) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Search Input */}
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search</FormLabel>
              <FormControl>
                <Input placeholder="Search posts..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Select */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => {
            // Convert empty string to undefined for Select component
            // Select needs undefined to show placeholder, not empty string
            const selectValue = field.value || undefined;

            return (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => {
                    if (value !== "") field.onChange(value);
                  }}
                  value={selectValue}
                  disabled={isLoadingCategories}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* <SelectItem value="__clear__">All Categories</SelectItem> */}
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button type="submit">Apply</Button>
        </div>
      </form>
    </Form>
  );
}
