import { Button } from "@/components/ui/button";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useDeletePostMutation } from "@/services/post/queries/useDeletePost";
import type { PostType } from "@/types/post.type";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DeletePostDialogProps {
  post: PostType;
  children: React.ReactNode;
}

export function DeletePostDialog({
  post,
  children,
}: DeletePostDialogProps) {
  const deletePostMutation = useDeletePostMutation();
  const [open, setOpen] = useState(false);

  // Close dialog on successful deletion (mutation will navigate on success)
  useEffect(() => {
    if (deletePostMutation.isSuccess) {
      setOpen(false);
    }
  }, [deletePostMutation.isSuccess]);

  const handleDelete = () => {
    deletePostMutation.mutate({ slug: post.slug });
    // Dialog will close via useEffect on success, or stay open on error
  };

  return (
    <DialogWrapper
      title="Delete Post"
      close={() => setOpen(false)}
      onOpenChange={setOpen}
      open={open}
      triggerContent={children}
    >
      <div className="space-y-6">
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete the post{" "}
          <span className="text-foreground font-semibold">
            &quot;{post.title}&quot;
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deletePostMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePostMutation.isPending}
          >
            {deletePostMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Delete
          </Button>
        </div>
      </div>
    </DialogWrapper>
  );
}
