import { Button } from "@/components/ui/button";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useDeleteRefundMutation } from "@/services/refund/queries/useDeleteRefund";
import type { RefundType } from "@/types/refund.type";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DeleteRefundDialogProps {
  refund: RefundType;
  children: React.ReactNode;
}

export function DeleteRefundDialog({
  refund,
  children,
}: DeleteRefundDialogProps) {
  const deleteRefundMutation = useDeleteRefundMutation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (deleteRefundMutation.isSuccess) {
      setOpen(false);
    }
  }, [deleteRefundMutation.isSuccess]);

  const handleDelete = () => {
    deleteRefundMutation.mutate(refund.id);
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      title="Delete Refund"
      close={() => setOpen(false)}
      triggerContent={children}
    >
      <div className="space-y-6">
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete the refund for order{" "}
          <span className="text-foreground font-semibold">
            &quot;{refund.order?.code}&quot;
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteRefundMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteRefundMutation.isPending}
          >
            {deleteRefundMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Delete
          </Button>
        </div>
      </div>
    </DialogWrapper>
  );
}
