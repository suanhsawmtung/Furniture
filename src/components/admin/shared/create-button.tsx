import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { ComponentProps } from "react";
import { Link } from "react-router";

interface CreateButtonProps extends ComponentProps<typeof Button> {
  text: string;
  to?: string;
}

export function CreateButton({
  text,
  to,
  className,
  ...props
}: CreateButtonProps) {
  const buttonContent = (
    <div className="flex w-full items-center justify-between px-2 text-base">
      {text}
      <Plus className="size-4" />
    </div>
  );

  if (to) {
    return (
      <Button
        asChild
        className={cn(
          "h-12 flex-1 cursor-pointer sm:w-56 sm:flex-none",
          className,
        )}
        {...props}
      >
        <Link to={to}>{buttonContent}</Link>
      </Button>
    );
  }

  return (
    <Button
      className={cn(
        "h-12 flex-1 cursor-pointer sm:w-56 sm:flex-none",
        className,
      )}
      {...props}
    >
      {buttonContent}
    </Button>
  );
}
