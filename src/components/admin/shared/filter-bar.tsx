import { SearchInput } from "@/components/shared/search-input";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FilterBarProps {
  children?: ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={cn("flex items-center justify-start gap-x-2", className)}>
      <SearchInput paramKey="search" className="h-12 w-full flex-1 sm:w-56" />
      {children && <div className="hidden sm:block">{children}</div>}
    </div>
  );
}
