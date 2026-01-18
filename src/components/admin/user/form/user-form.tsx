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
import type { UserFormValues, UserType } from "@/types/user.type";
import { userSchema } from "@/validations/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useNavigation, useSubmit } from "react-router";

interface UserFormProps {
  user?: UserType;
  cancelUrl?: string;
  submitButtonText?: string;
}

export function UserForm({
  user,
  cancelUrl = "/admin/users",
  submitButtonText,
}: UserFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isEditMode = !!user;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      role: user?.role || "USER",
      status: user?.status || "ACTIVE",
    },
  });

  const onSubmit = (values: UserFormValues) => {
    const formData = new FormData();
    formData.append("email", values.email);
    if (values.firstName) {
      formData.append("firstName", values.firstName);
    }
    if (values.lastName) {
      formData.append("lastName", values.lastName);
    }
    if (values.phone) {
      formData.append("phone", values.phone);
    }
    formData.append("role", values.role);
    // Status is always included (default ACTIVE for create, current value for update)
    formData.append("status", values.status);

    submit(formData, {
      method: isEditMode ? "PATCH" : "POST",
    });
  };

  const buttonText = submitButtonText || (isEditMode ? "Update" : "Create");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email"
                  type="email"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* First Name and Last Name in a row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter first name"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter last name"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Phone Input */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter phone number"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Field - Visible in both create and update */}
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
                        field.onChange(role.key);
                      }}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Field - Only shown in update form */}
        {isEditMode && (
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
                          field.onChange(stat.key);
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Action Buttons */}
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
