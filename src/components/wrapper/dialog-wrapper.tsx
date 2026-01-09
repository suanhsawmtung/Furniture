import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

interface DialogWrapperProps {
  title?: string;
  className?: string;
  close: () => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  triggerContent?: React.ReactNode;
}

const DialogWrapper = ({
  title = "Dialog Title",
  className,
  close,
  children,
  open = true,
  onOpenChange,
  triggerContent,
}: DialogWrapperProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerContent && (
        <DialogTrigger asChild>{triggerContent}</DialogTrigger>
      )}
      <DialogContent className={cn(className)} showCloseButton={false}>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-primary text-xl font-bold">
            {title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="bg-highlight-bg hover:bg-highlight-hover h-10 w-10 rounded-full"
            onClick={close}
          >
            <XIcon className="text-primary h-6 w-6" />
          </Button>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogWrapper;
