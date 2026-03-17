import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useState } from "react";
import { RefundFilterForm } from "./refund-filter-form";

interface RefundFilterDialogProps {
  children: React.ReactNode;
}

export function RefundFilterDialog({ children }: RefundFilterDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <DialogWrapper
      title="Filter Refunds"
      close={() => setOpen(false)}
      onOpenChange={() => setOpen((prev) => !prev)}
      open={open}
      triggerContent={children}
    >
      <RefundFilterForm close={() => setOpen(false)} />
    </DialogWrapper>
  );
}
