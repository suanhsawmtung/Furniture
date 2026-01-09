import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import type { ComponentProps } from "react";
import { Link } from "react-router";

interface BackButtonProps extends ComponentProps<typeof Button> {
  to: string;
}

export function BackButton({ to, className, ...props }: BackButtonProps) {
  const buttonContent = (
    <div className="flex w-full items-center justify-between gap-x-2 text-base">
      <ArrowLeft className="size-4" />
      Back
    </div>
  );

  return (
    <Button
      asChild
      className={cn("h-10 flex-1 cursor-pointer px-4 sm:flex-none", className)}
      {...props}
    >
      <Link to={to}>{buttonContent}</Link>
    </Button>
  );
}
