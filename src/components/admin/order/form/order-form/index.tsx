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
import { baseImageUrl } from "@/config/env";
import { cn, formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import type { OrderDetailType, OrderPaymentStatus, OrderStatus } from "@/types/order.type";
import type { OrderFormValues } from "@/validations/order.validation";
import { orderFormSchema } from "@/validations/order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate, useNavigation, useSubmit } from "react-router";
import { toast } from "sonner";
import { AddOrderItemForm } from "./add-order-item-form";
import { OrderItemList } from "./order-item-list";

const statusOptions: Array<{ key: OrderStatus; text: string }> = [
  { key: "PENDING", text: "Pending" },
  { key: "ACCEPTED", text: "Accepted" },
  { key: "REJECTED", text: "Rejected" },
  { key: "CANCELLED", text: "Cancelled" },
  { key: "DONE", text: "Done" },
];

const paymentStatusOptions: Array<{ key: OrderPaymentStatus; text: string }> = [
  { key: "PENDING", text: "Pending" },
  { key: "UNPAID", text: "Unpaid" },
  { key: "PAID", text: "Paid" },
  { key: "FAILED", text: "Failed" },
  { key: "REFUNDED", text: "Refunded" },
  { key: "PARTIALLY_REFUNDED", text: "Partially Refunded" },
];

interface StatusConfig {
  allowedPaymentStatus: readonly OrderPaymentStatus[];
  defaultPaymentStatus: OrderPaymentStatus;
}

export const orderStatusTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["DONE", "CANCELLED"],
  DONE: [],
  REJECTED: [],
  CANCELLED: [],
} as const;

export const paymentStatusTransitions: Record<OrderPaymentStatus, readonly OrderPaymentStatus[]> = {
  PENDING: ["UNPAID", "FAILED", "PAID"],
  UNPAID: ["PENDING", "FAILED"],
  PAID: ["PARTIALLY_REFUNDED", "REFUNDED"],
  PARTIALLY_REFUNDED: ["REFUNDED"],
  FAILED: ["PENDING", "UNPAID"], // allow retry
  REFUNDED: [],
} as const;

export const orderStatusConfig: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    allowedPaymentStatus: ["PENDING"],
    defaultPaymentStatus: "PENDING",
  },

  ACCEPTED: {
    allowedPaymentStatus: ["PAID"],
    defaultPaymentStatus: "PAID",
  },

  DONE: {
    allowedPaymentStatus: ["PAID"],
    defaultPaymentStatus: "PAID",
  },

  REJECTED: {
    allowedPaymentStatus: ["UNPAID", "FAILED", "PENDING"],
    defaultPaymentStatus: "PENDING",
  },

  CANCELLED: {
    allowedPaymentStatus: ["PAID", "REFUNDED", "PARTIALLY_REFUNDED"],
    defaultPaymentStatus: "PAID",
  },
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
  const canUpdate = !isCustomerOrder && (!isEditMode || order?.status === "PENDING");

  const authUserId = useAuthStore((state) => state.authUser?.id);

  const [variantMap, setVariantMap] = useState<Record<number, VariantMetadata>>({});

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: order?.customerName || "",
      customerPhone: order?.customerPhone || "",
      customerAddress: order?.customerAddress || "",
      customerNotes: order?.customerNotes || "",
      status: order?.status || "PENDING",
      paymentStatus: order?.paymentStatus || "PENDING",
      userId: order?.userId || authUserId || 0,
      source: order?.source || "ADMIN",
      items: order?.orderItems?.map(item => ({
        itemId: item.itemId,
        itemType: item.itemType,
        quantity: item.quantity,
        price: Number(item.price),
      })) || [],
      rejectedReason: order?.rejectedReason || "",
      cancelledReason: order?.cancelledReason || "",
      image: undefined,
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
            stock: item.productVariant.stock,
            originalPrice: item.productVariant.price,
          };
        }
      });
      setVariantMap(prev => ({ ...prev, ...initialMap }));
    }
  }, [order]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleImageClick = useCallback(() => {
      if (!canUpdate) return;
      fileInputRef.current?.click();
    }, [canUpdate]);

    const handleImageChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          // Store the File object directly
          form.setValue("image", file, { shouldValidate: true });
        }
      },
      [form],
    );
  
    const imageFile = form.watch("image");
    const imageUrl = useMemo(() => {
      // If a new file is selected, show preview from file
      if (imageFile) {
        return URL.createObjectURL(imageFile);
      }
      // If in edit mode and no new file, show existing order image
      if (isEditMode && order?.image) {
        return baseImageUrl + "order/" + order.image;
      }
      return null;
    }, [imageFile, isEditMode, order?.image]);
  
    // Cleanup object URL to prevent memory leaks
    useEffect(() => {
      return () => {
        if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/src")) {
           try {
             URL.revokeObjectURL(imageUrl);
           } catch (e) {
             // Ignore if it wasn't an object URL
           }
        }
      };
    }, [imageUrl]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (values: OrderFormValues) => {
    if (isEditMode) {
      // Identity & Content check
      if (!canUpdate) {
        const isNameChanged = values.customerName !== (order?.customerName || "");
        const isPhoneChanged = values.customerPhone !== (order?.customerPhone || "");
        const isAddressChanged = values.customerAddress !== (order?.customerAddress || "");
        const isNotesChanged = (values.customerNotes || "") !== (order?.customerNotes || "");
        const isUserIdChanged = values.userId !== (order?.userId || 0);
        const isSourceChanged = values.source !== (order?.source || "ADMIN");
        const isImageChanged = !!values.image; 
        
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
          isUserIdChanged ||
          isSourceChanged ||
          isImageChanged || 
          isItemsLengthChanged || 
          isItemsContentChanged
        ) {
          if (isCustomerOrder) {
            toast.error("Cannot update customer details or items for orders from CUSTOMER source.");
          } else {
            toast.error("Cannot update order details or items for orders that are not in PENDING status.");
          }
          return;
        }
      }
    }

    // Validation: Order Status Transition
    if (isEditMode && order?.status) {
      const allowedTransitions = orderStatusTransitions[order.status];
      if (values.status !== order.status && !allowedTransitions.includes(values.status as OrderStatus)) {
        toast.error(`Cannot change order status from ${order.status} to ${values.status}`);
        return;
      }
    }

    // Validation: Status Compatibility
    const statusConfig = orderStatusConfig[values.status as OrderStatus];
    if (statusConfig && !statusConfig.allowedPaymentStatus.includes(values.paymentStatus as OrderPaymentStatus)) {
      toast.error(`Payment status ${values.paymentStatus} is not allowed for order status ${values.status}`);
      return;
    }

    // Validation: Payment Status Transition
    if (isEditMode && order?.paymentStatus) {
      const allowedTransitions = paymentStatusTransitions[order.paymentStatus];
      if (values.paymentStatus !== order.paymentStatus && !allowedTransitions.includes(values.paymentStatus as OrderPaymentStatus)) {
        toast.error(`Cannot change payment status from ${order.paymentStatus} to ${values.paymentStatus}`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("customerName", values.customerName);
    formData.append("customerPhone", values.customerPhone);
    formData.append("customerAddress", values.customerAddress);
    formData.append("status", values.status);
    formData.append("paymentStatus", values.paymentStatus);
    formData.append("userId", String(values.userId));
    formData.append("source", values.source);
    formData.append("items", JSON.stringify(values.items));

    if(values.customerNotes) {
      formData.append("customerNotes", values.customerNotes);
    }

    if(values.rejectedReason && values.status === "REJECTED") {
      formData.append("rejectedReason", values.rejectedReason);
    }

    if(values.cancelledReason && values.status === "CANCELLED") {
      formData.append("cancelledReason", values.cancelledReason);
    }

    if(values.image) {
      formData.append("image", values.image);
    }

    submit(formData, {
      method: isEditMode ? "PATCH" : "POST",
      encType: "multipart/form-data",
    });
  };

  const currentStatus = useWatch({
    control: form.control,
    name: "status",
  });

  const watchedItems = useWatch({
    control: form.control,
    name: "items",
    defaultValue: [],
  });

  // Handle automatic payment status update when order status changes
  useEffect(() => {
    if (!currentStatus) return;
    
    const config = orderStatusConfig[currentStatus as OrderStatus];
    if (!config) return;

    const currentPaymentStatus = form.getValues("paymentStatus");
    
    // Check if current payment status is allowed for the new order status
    if (!config.allowedPaymentStatus.includes(currentPaymentStatus as OrderPaymentStatus)) {
      form.setValue("paymentStatus", config.defaultPaymentStatus);
    }
  }, [currentStatus, form]);

  const filteredStatusOptions = useMemo(() => {
    if (!isEditMode || !order?.status) {
      return statusOptions;
    }

    const transitions = orderStatusTransitions[order.status];
    return statusOptions.filter(
      (option) => option.key === order.status || transitions.includes(option.key)
    );
  }, [isEditMode, order?.status]);

  const filteredPaymentStatusOptions = useMemo(() => {
    let options = paymentStatusOptions;

    // Filter by Order Status requirements
    if (currentStatus) {
      const config = orderStatusConfig[currentStatus as OrderStatus];
      if (config) {
        options = options.filter((option) =>
          config.allowedPaymentStatus.includes(option.key)
        );
      }
    }

    // Filter by Payment Status Transition rules (Edit Mode only)
    if (isEditMode && order?.paymentStatus) {
      const transitions = paymentStatusTransitions[order.paymentStatus];
      options = options.filter(
        (option) =>
          option.key === order.paymentStatus || transitions.includes(option.key)
      );
    }

    return options;
  }, [currentStatus, isEditMode, order?.paymentStatus]);

  const totalPrice = watchedItems.reduce(
    (acc, field) => acc + (field.price || 0) * (field.quantity || 0),
    0
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <div className="w-full">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel className="hidden lg:block">Image</FormLabel>
                  <FormControl>
                    <div
                      onClick={handleImageClick}
                      className={cn(
                        "bg-muted/10 flex h-auto w-full flex-col items-center justify-center gap-3 rounded-lg",
                        imageUrl
                          ? (canUpdate && "cursor-pointer")
                          : (canUpdate ? "border-muted-foreground/25 cursor-pointer border-2 border-dashed p-8" : "border-muted-foreground/10 border-2 border-dashed p-8"),
                      )}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isSubmitting || !canUpdate}
                      />
                      {imageUrl ? (
                        <div className="relative w-full overflow-hidden rounded-lg">
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="h-auto w-full rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                          <ImageIcon className="text-muted-foreground h-6 w-6" />
                          <p className="text-muted-foreground text-xs font-normal">
                            Choose an Image
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} disabled={!canUpdate} />
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
                    <Input placeholder="Enter customer phone" {...field} disabled={!canUpdate} />
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
                      disabled={!canUpdate}
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
                    <Textarea placeholder="Add any special instructions" {...field} disabled={!canUpdate} />
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

            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                       {filteredPaymentStatusOptions.map((option) => (
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
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Order Items</h3>
            <p className="text-lg font-bold text-primary">
              Total: {formatPrice(totalPrice)}
            </p>
          </div>

          {/* <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}> */}
           <OrderItemList
            fields={fields} 
            remove={remove} 
            variantMap={variantMap}
            control={form.control}
            disabled={!canUpdate}
          />

          {canUpdate && (
            <AddOrderItemForm
              onAdd={(item, metadata) => {
                setVariantMap(prev => ({ ...prev, [item.itemId]: metadata }));
                append(item);
              }} 
            />
          )}
          {/* </Suspense> */}
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
}

