import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

interface Props {
  rating: number;
}

const Rating = ({ rating }: Props) => {
  return (
    <div className="flex items-center gap-x-1.5">
      {Array.from({ length: 5 }).map((_, indx) => (
        <StarIcon
          key={indx}
          className={cn(
            "size-4",
            rating >= indx + 1 ? "text-yellow-300" : "text-muted-foreground",
          )}
        />
      ))}
    </div>
  );
};

export default Rating;
