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
import { TabButton } from "@/components/ui/tab-button";
import { POST_STATUSES } from "@/constants/post.constant";
import { isPostStatus } from "@/lib/utils";
import { useGetAllCategories } from "@/services/category/queries/useGetAllCategories";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import z from "zod";

const PostFilterFormSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

type PostFilterFormValues = z.infer<typeof PostFilterFormSchema>;

export function PostFilterForm({ close }: { close: () => void }) {
  const { data: categories, isLoading: isLoadingCategories } =
    useGetAllCategories();

  const navigate = useNavigate();
  const location = useLocation();

  const authUser = useAuthStore((state) => state.authUser);

  const statuses =
    authUser?.role === "ADMIN" ? POST_STATUSES : POST_STATUSES.slice(0, 2);

  const form = useForm<PostFilterFormValues>({
    resolver: zodResolver(PostFilterFormSchema),
    defaultValues: {
      search: "",
      category: "",
      status: undefined,
    },
  });

  // Sync form with URL params when they change (but not from user interaction)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const statusParam = searchParams.get("status");
    const status = isPostStatus(statusParam) ? statusParam : undefined;

    form.reset({
      search,
      category,
      status,
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

    // Update status param
    if (data.status) {
      searchParams.set("status", data.status);
    } else {
      searchParams.delete("status");
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
      status: undefined,
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

        {/* Status Filter */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {statuses?.map((stat) => (
                    <TabButton
                      key={stat.key}
                      text={stat.text}
                      isSelected={field.value === stat.key}
                      onClick={() => {
                        // Toggle: if already selected, deselect it
                        if (field.value === stat.key) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(stat.key);
                        }
                      }}
                    />
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
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
