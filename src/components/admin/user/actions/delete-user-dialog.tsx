import { Button } from "@/components/ui/button";
import { formatName } from "@/lib/utils";
import type { UserType } from "@/types/user.type";
import { Loader2 } from "lucide-react";
import { Form, useNavigate, useNavigation } from "react-router";

interface DeleteUserDialogProps {
  user: UserType;
  cancelUrl?: string;
}

export function DeleteUserDialog({
  user,
  cancelUrl = "/admin/users",
}: DeleteUserDialogProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const userName = formatName({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
  });

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        Are you sure you want to delete the user{" "}
        <span className="text-foreground font-semibold">
          &quot;{userName}&quot;
        </span>
        ? This action cannot be undone.
      </p>

      <Form method="POST">
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(cancelUrl)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="destructive" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </Form>
    </div>
  );
}
