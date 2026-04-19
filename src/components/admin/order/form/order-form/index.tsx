import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabButton } from "@/components/ui/tab-button";
import { Textarea } from "@/components/ui/textarea";
import { formatImagePath, formatPrice } from "@/lib/utils";
import type { OrderDetailType, OrderStatus } from "@/types/order.type";
import type { OrderFormValues } from "@/validations/order.validation";
import { orderFormSchema } from "@/validations/order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate, useNavigation, useSubmit } from "react-router";
import { toast } from "sonner";
import { AddOrderItemForm } from "./add-order-item-form";
import { OrderItemList } from "./order-item-list";

const statusOptions: Array<{ key: OrderStatus; text: string }> = [
  { key: "PENDING", text: "Pending" },
  { key: "ACCEPTED", text: "Accepted" },
  { key: "SHIPPED", text: "Shipped" },
  { key: "DELIVERED", text: "Delivered" },
  { key: "DONE", text: "Done" },
  { key: "REJECTED", text: "Rejected" },
  { key: "CANCELLED", text: "Cancelled" },
];

export const orderStatusTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
  ACCEPTED: ["SHIPPED", "CANCELLED", "PENDING"],
  SHIPPED: ["DELIVERED", "CANCELLED", "ACCEPTED"],
  DELIVERED: ["DONE", "SHIPPED"],
  DONE: [],
  REJECTED: ["PENDING"],
  CANCELLED: [],
} as const;

interface VariantMetadata {
  sku: string;
  size: number;
  productName: string;
  brandName: string;
  stock: number;
  originalPrice: number;
}

export const OrderForm = ({ order }: { order?: OrderDetailType }) => {
  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isEditMode = !!order;
  const isCustomerOrder = isEditMode && order?.source === "CUSTOMER";

  const isContentLocked = useMemo(() => {
    if (!isEditMode) return false;
    if (order?.source === "CUSTOMER") return true;
    
    // For ADMIN source: Lock if status is SHIPPED or further
    const lockedStatuses: OrderStatus[] = ["SHIPPED", "DELIVERED", "DONE", "CANCELLED", "REJECTED"];
    return lockedStatuses.includes(order.status);
  }, [isEditMode, order?.source, order?.status]);

  const isStatusLocked = useMemo(() => {
    if (!isEditMode) return false;
    const terminalStatuses: OrderStatus[] = ["DONE", "CANCELLED"];
    return terminalStatuses.includes(order.status);
  }, [isEditMode, order?.status]);

  const [variantMap, setVariantMap] = useState<Record<number, VariantMetadata>>({});

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: order?.customerName || "",
      customerPhone: order?.customerPhone || "",
      customerAddress: order?.customerAddress || "",
      customerNotes: order?.customerNotes || "",
      status: order?.status || "PENDING",
      source: order?.source || "ADMIN",
      items: order?.orderItems?.map(item => ({
        itemId: item.itemId,
        itemType: item.itemType,
        quantity: item.quantity,
        price: Number(item.price),
      })) || [],
      rejectedReason: order?.rejectedReason || "",
      cancelledReason: order?.cancelledReason || "",
    },
  });

  // Populate variantMap for existing items
  useEffect(() => {
    if (order?.orderItems) {
      const initialMap: Record<number, VariantMetadata> = {};
      order.orderItems.forEach(item => {
        if (item.productVariant) {
          initialMap[item.itemId] = {
            sku: item.productVariant.sku,
            size: item.productVariant.size,
            productName: item.productVariant.product.name,
            brandName: item.productVariant.product.brand.name,
            stock: (item.productVariant.stock - item.productVariant.reserved),
            originalPrice: item.productVariant.price,
          };
        }
      });
      setVariantMap(prev => ({ ...prev, ...initialMap }));
    }
  }, [order]);

  const imageUrl = useMemo(() => {
    // If in edit mode, show existing order image
    if (isEditMode && order?.image) {
      return formatImagePath(order.image, "order");
    }
    return null;
  }, [isEditMode, order?.image]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = useCallback(
    (values: OrderFormValues) => {
      if (isEditMode) {
        // Content preservation check for locked states
        if (isContentLocked) {
          const isNameChanged = values.customerName !== (order?.customerName || "");
          const isPhoneChanged = values.customerPhone !== (order?.customerPhone || "");
          const isAddressChanged = values.customerAddress !== (order?.customerAddress || "");
          const isNotesChanged = (values.customerNotes || "") !== (order?.customerNotes || "");

          const initialItems = order?.orderItems || [];
          const isItemsLengthChanged = values.items.length !== initialItems.length;
          const isItemsContentChanged = values.items.some((item, index) => {
            const original = initialItems[index];
            return (
              !original ||
              item.itemId !== original.itemId ||
              item.quantity !== original.quantity ||
              Number(item.price) !== Number(original.price)
            );
          });

          if (
            isNameChanged ||
            isPhoneChanged ||
            isAddressChanged ||
            isNotesChanged ||
            isItemsLengthChanged || 
            isItemsContentChanged
          ) {
            if (isCustomerOrder) {
              toast.error("Fulfillment details are locked for customer orders.");
            } else {
              toast.error(`Order content is locked in ${order.status} status.`);
            }
            return;
          }
        }

        if (isStatusLocked && values.status !== order.status) {
          toast.error(`Cannot change status once an order is ${order.status}.`);
          return;
        }
      }

      // Validation: Order Status Transition
      if (isEditMode && order?.status) {
        const allowedTransitions = orderStatusTransitions[order.status];
        if (values.status !== order.status && !allowedTransitions.includes(values.status as OrderStatus)) {
          toast.error(`Cannot change order status from ${order.status} to ${values.status}`);
          return;
        }

        if(values.status !== order.status && order.source === "CUSTOMER" && values.status === "CANCELLED") {
          toast.error(`You cannot cancel the customer sourced order.`);
          return;
        }
      }

      if (values.status === "REJECTED" && !values.rejectedReason?.trim()) {
        toast.error("Rejected reason is required");
        return;
      }

      if (values.status === "CANCELLED" && !values.cancelledReason?.trim()) {
        toast.error("Cancelled reason is required");
        return;
      }

      const formData = new FormData();
      formData.append("customerName", values.customerName);
      formData.append("customerPhone", values.customerPhone);
      formData.append("customerAddress", values.customerAddress);
      formData.append("status", values.status);
      formData.append("items", JSON.stringify(values.items));

      if (values.customerNotes) {
        formData.append("customerNotes", values.customerNotes);
      }

      if (values.rejectedReason && values.status === "REJECTED") {
        formData.append("rejectedReason", values.rejectedReason);
      }

      if (values.cancelledReason && values.status === "CANCELLED") {
        formData.append("cancelledReason", values.cancelledReason);
      }

      submit(formData, {
        method: isEditMode ? "PATCH" : "POST",
      });
    },
    [isEditMode, isContentLocked, order, isCustomerOrder, isStatusLocked, submit]
  );

  const watchedItems = useWatch({
    control: form.control,
    name: "items",
    defaultValue: [],
  });

  const filteredStatusOptions = useMemo(() => {
    if (!isEditMode) {
      return statusOptions.filter(opt => ["PENDING", "ACCEPTED"].includes(opt.key));
    }

    const transitions = orderStatusTransitions[order.status as OrderStatus] || [];
    return statusOptions.filter((option) => {
      const isAllowed = option.key === order.status || transitions.includes(option.key);
      
      // Hide CANCELLED status for CUSTOMER source orders in update form
      if (order?.source === "CUSTOMER" && option.key === "CANCELLED") {
        return false;
      }
      
      return isAllowed;
    });
  }, [isEditMode, order?.status, order?.source]);

  const totalPrice = watchedItems.reduce(
    (acc, field) => acc + (field.price || 0) * (field.quantity || 0),
    0
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <div className="w-full">
            {imageUrl ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Order Image</p>
                <div className="relative w-full overflow-hidden rounded-lg">
                  <img
                    src={imageUrl}
                    alt="Order"
                    className="h-auto w-full rounded-lg object-cover"
                  />
                </div>
              </div>
            ): (
              <div className="bg-muted/10 flex h-auto w-full flex-col items-center justify-center gap-3 rounded-lg border-muted-foreground/25 border-2 border-dashed p-8">
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                  <ImageIcon className="text-muted-foreground h-6 w-6" />
                  <p className="text-muted-foreground text-xs font-normal">
                    No payment slip
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} disabled={!!isContentLocked} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer phone" {...field} disabled={!!isContentLocked} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter delivery address" 
                      {...field} 
                      className="min-h-[80px]"
                      disabled={!!isContentLocked}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any special instructions" 
                      {...field} 
                      disabled={isContentLocked} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Status</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                       {filteredStatusOptions.map((option) => (
                         <TabButton
                           key={option.key}
                           text={option.text}
                           isSelected={field.value === option.key}
                           onClick={() => field.onChange(option.key)}
                         />
                       ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("status") === "REJECTED" && (
              <FormField
                control={form.control}
                name="rejectedReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rejected Reason (Optional)</FormLabel>
                    <FormControl>
                    <Textarea placeholder="Reason for rejection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}

            {form.watch("status") === "CANCELLED" && (
              <FormField
                control={form.control}
                name="cancelledReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancelled Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Reason for cancellation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Financial Summary */}
            {isEditMode && (
              <div className="mt-8 grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4 shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Paid</p>
                  <p className="text-lg font-bold text-emerald-600 tabular-nums">
                    {formatPrice(order?.totalPaidAmount || 0)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Refunded</p>
                  <p className="text-lg font-bold text-rose-600 tabular-nums">
                    {formatPrice(order?.totalRefundAmount || 0)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Order Items</h3>
            <p className="text-lg font-bold text-primary">
              Total: {formatPrice(totalPrice)}
            </p>
          </div>

          <OrderItemList
            fields={fields} 
            remove={remove} 
            variantMap={variantMap}
            control={form.control}
            disabled={!!isContentLocked}
          />

          {!isContentLocked && (
            <AddOrderItemForm
              onAdd={(item, metadata) => {
                setVariantMap(prev => ({ ...prev, [item.itemId]: metadata }));
                append(item);
              }} 
            />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/orders")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || fields.length === 0}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEditMode ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
