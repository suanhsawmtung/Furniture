import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useState } from "react";
import { UserFilterForm } from "../form/user-filter-form";

interface UserFilterDialogProps {
  children: React.ReactNode;
}

export function UserFilterDialog({ children }: UserFilterDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <DialogWrapper
      title="Filter Users"
      close={() => setOpen(false)}
      onOpenChange={() => setOpen((prev) => !prev)}
      open={open}
      triggerContent={children}
    >
      <UserFilterForm close={() => setOpen(false)} />
    </DialogWrapper>
  );
}
