import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useState } from "react";
import { PaymentFilterForm } from "./payment-filter-form";

interface PaymentFilterDialogProps {
  children: React.ReactNode;
}

export function PaymentFilterDialog({ children }: PaymentFilterDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <DialogWrapper
      title="Filter Payments"
      close={() => setOpen(false)}
      onOpenChange={() => setOpen((prev) => !prev)}
      open={open}
      triggerContent={children}
    >
      <PaymentFilterForm close={() => setOpen(false)} />
    </DialogWrapper>
  );
}
