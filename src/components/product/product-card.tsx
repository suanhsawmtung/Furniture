import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Plus } from "lucide-react";
import type { HTMLAttributes } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";

interface Props extends HTMLAttributes<HTMLDivElement> {
  product: Product;
}

const ProductCard = ({ product, className }: Props) => {
  return (
    <Card className={cn("w-full overflow-hidden rounded-lg p-0", className)}>
      <div className="space-y-2">
        <Link to={`/products/${product.id}`} className="space-y-2">
          <CardHeader className="p-0">
            <AspectRatio ratio={1 / 1} className="w-full">
              <img
                src={product.images[0]}
                alt={product.name}
                className="size-full object-cover"
              />
            </AspectRatio>
          </CardHeader>
          <CardContent className="space-y-1.5 px-4">
            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            <CardDescription className="line-clamp-1 flex items-center gap-x-2">
              {formatPrice(product.price)}
              {product.discount > 0 && (
                <span className="font-extralight line-through">
                  {formatPrice(product.discount)}
                </span>
              )}
            </CardDescription>
          </CardContent>
        </Link>
        <CardFooter className="w-full p-4">
          {product.inventory > 0 && product.status === "active" ? (
            <Button
              type="button"
              size="sm"
              className="bg-hero w-full cursor-pointer rounded-sm font-bold"
            >
              <Plus />
              Add To Cart
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              className="size-sm bg-hero w-full rounded-sm font-bold"
              disabled
            >
              Sold Out
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
