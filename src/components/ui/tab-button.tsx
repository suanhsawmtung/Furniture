import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface TabButtonProps {
  text?: string;
  isSelected: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({
  text,
  isSelected,
  onClick,
  children,
}) => {
  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      onClick={() => onClick?.()}
      className={cn(
        isSelected &&
          "bg-primary hover:bg-primary text-white hover:text-white dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
      )}
    >
      {children ?? text ?? ""}
    </Button>
  );
};
