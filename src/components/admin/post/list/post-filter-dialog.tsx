import DialogWrapper from "@/components/wrapper/dialog-wrapper";
import { useState } from "react";
import { PostFilterForm } from "../form/post-filter-form";

interface PostFilterDialogProps {
  children: React.ReactNode;
}

export function PostFilterDialog({ children }: PostFilterDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <DialogWrapper
      title="Filter Posts"
      close={() => setOpen(false)}
      onOpenChange={() => setOpen((prev) => !prev)}
      open={open}
      triggerContent={children}
    >
      <PostFilterForm close={() => setOpen(false)} />
    </DialogWrapper>
  );
}
