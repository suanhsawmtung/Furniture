import { Button } from "@/components/ui/button";
import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useDeletePayment } from "@/services/payment/queries/useDeletePayment";
import type { PaymentType } from "@/types/payment.type";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DeletePaymentDialogProps {
  payment: PaymentType;
  children: React.ReactNode;
}

export function DeletePaymentDialog({
  payment,
  children,
}: DeletePaymentDialogProps) {
  const deletePaymentMutation = useDeletePayment();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (deletePaymentMutation.isSuccess) {
      setOpen(false);
    }
  }, [deletePaymentMutation.isSuccess]);

  const handleDelete = () => {
    deletePaymentMutation.mutate(payment.id);
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      title="Delete Payment"
      close={() => setOpen(false)}
      triggerContent={children}
    >
      <div className="space-y-6">
        <p className="text-muted-foreground text-sm">
          Are you sure you want to delete the payment for order{" "}
          <span className="text-foreground font-semibold">
            &quot;{payment?.order?.code}&quot;
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deletePaymentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePaymentMutation.isPending}
          >
            {deletePaymentMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Delete
          </Button>
        </div>
      </div>
    </DialogWrapper>
  );
}
