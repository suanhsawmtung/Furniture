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
import { TabButton } from "@/components/ui/tab-button";
import { USER_ROLES, USER_STATUSES } from "@/constants/user.constant";
import { isRole, isStatus } from "@/lib/utils";
import type { UserFilterFormValues } from "@/types/user.type";
import { UserFilterFormSchema } from "@/validations/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

export function UserFilterForm({ close }: { close: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<UserFilterFormValues>({
    resolver: zodResolver(UserFilterFormSchema),
    defaultValues: {
      search: "",
      role: undefined,
      status: undefined,
    },
  });

  // Sync form with URL params when they change (but not from user interaction)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search") || "";
    const roleParam = searchParams.get("role");
    const role = isRole(roleParam) ? roleParam : undefined;
    const statusParam = searchParams.get("status");
    const status = isStatus(statusParam) ? statusParam : undefined;

    form.reset({
      search,
      role,
      status,
    });
  }, [location.search, form]);

  const onSubmit = (data: UserFilterFormValues) => {
    const searchParams = new URLSearchParams(location.search);

    // Remove page param when filtering
    searchParams.delete("page");

    // Update search param
    if (data.search && data.search.trim()) {
      searchParams.set("search", data.search.trim());
    } else {
      searchParams.delete("search");
    }

    // Update role param
    if (data.role) {
      searchParams.set("role", data.role);
    } else {
      searchParams.delete("role");
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
      role: undefined,
      status: undefined,
    });
    navigate(location.pathname, { replace: true });
    close();
  };

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
                <Input placeholder="Search users..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Filter */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {USER_ROLES.map((role) => (
                    <TabButton
                      key={role.key}
                      text={role.text}
                      isSelected={field.value === role.key}
                      onClick={() => {
                        // Toggle: if already selected, deselect it
                        if (field.value === role.key) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(role.key);
                        }
                      }}
                    />
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
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
                  {USER_STATUSES.map((stat) => (
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
