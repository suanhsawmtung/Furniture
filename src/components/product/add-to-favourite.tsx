import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeartIcon } from "lucide-react";
import type { ComponentProps } from "react";

interface Props extends ComponentProps<"button"> {
  productId: string;
  rating: number;
}

const AddToFavourite = ({ productId, rating, className, ...props }: Props) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn("size-8 shrink-0", className)}
      {...props}
    >
      <HeartIcon className="size-4" />
    </Button>
  );
};

export default AddToFavourite;
