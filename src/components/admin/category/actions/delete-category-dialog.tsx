import { Button } from "@/components/ui/button";
import type { CategoryType } from "@/types";
import { Loader2 } from "lucide-react";
import { Form, useNavigate, useNavigation } from "react-router";

interface DeleteCategoryDialogProps {
  category: CategoryType;
  cancelUrl?: string;
}

export function DeleteCategoryDialog({
  category,
  cancelUrl = "/admin/categories",
}: DeleteCategoryDialogProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        Are you sure you want to delete the category{" "}
        <span className="text-foreground font-semibold">
          &quot;{category.name}&quot;
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
