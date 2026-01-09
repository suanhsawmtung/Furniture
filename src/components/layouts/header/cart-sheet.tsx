import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cartItems } from "@/data/carts";
import { formatPrice } from "@/lib/utils";
import type { Cart } from "@/types";
import { MinusIcon, PlusIcon, ShoppingCartIcon, TrashIcon } from "lucide-react";

const CartItem = ({ item }: { item: Cart }) => {
  return (
    <div className="w-full space-y-2" key={item.id}>
      <div className="flex items-center gap-x-3">
        <img
          src={item.image.url}
          alt={item.image.name}
          className="w-1/5 rounded-md"
        />

        <div className="flex flex-col items-start justify-between gap-y-0.5">
          <h3 className="line-clamp-1 text-base font-semibold">{item.name}</h3>
          <p className="text-muted-foreground text-xs">
            {`${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`}
          </p>
          <p className="text-muted-foreground text-xs">
            {`${item.category} / ${item.subcategory}`}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between py-1">
        <div className="flex items-center gap-0">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-r-none"
            type="button"
          >
            <MinusIcon className="size-4" />
            <span className="sr-only">Remove one item</span>
          </Button>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            defaultValue={1}
            className="h-8 w-14 rounded-none"
          />
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-l-none"
            type="button"
          >
            <PlusIcon className="size-4" />
            <span className="sr-only">Add one item</span>
          </Button>
        </div>

        <Button variant="outline" size="icon" className="size-8">
          <TrashIcon className="size-4" />
          <span className="sr-only">Remove from Cart</span>
        </Button>
      </div>

      <Separator />
    </div>
  );
};

const CartSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-8 w-8 cursor-pointer rounded-full"
        >
          <ShoppingCartIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open Cart Sheet</span>
          <Badge
            className="absolute -top-2.5 -right-2.5 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
            variant="destructive"
          >
            99
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div>
          <SheetHeader>
            <SheetTitle>Cart 4</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <Separator />
          </div>
        </div>

        <ScrollArea className="h-[65vh] w-full px-4">
          <div className="h-full w-full space-y-4 pb-16">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </ScrollArea>

        <SheetFooter className="space-y-2">
          <Separator />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Shipping</h3>
              <p className="text-sm font-semibold">Free</p>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Taxes</h3>
              <p className="text-sm font-semibold">Calculated at checkout</p>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Total</h3>
              <p className="text-sm font-semibold">$190</p>
            </div>
          </div>
          <Button type="submit">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
