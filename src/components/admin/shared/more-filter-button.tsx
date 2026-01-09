import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import type { ComponentProps } from "react";

interface MoreFilterButtonProps extends ComponentProps<typeof Button> {
  onClick?: () => void;
}

export function MoreFilterButton({
  onClick,
  className,
  ...props
}: MoreFilterButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        "h-12 w-12 cursor-pointer bg-white lg:w-auto lg:px-4",
        className,
      )}
      {...props}
    >
      <SlidersHorizontal className="size-4 lg:mr-2 lg:hidden" />
      <span className="hidden lg:inline">More Filters</span>
    </Button>
  );
}
