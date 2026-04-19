import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  formatDateTime,
  formatImagePath,
  formatPrice,
  getOrderStatusVariant,
  getPaymentStatusVariant
} from "@/lib/utils";
import type { OrderDetailType } from "@/types/order.type";
import { ImageIcon } from "lucide-react";

type OrderDetailCardProps = {
  order: OrderDetailType;
};

const OrderDetailCard = ({ order }: OrderDetailCardProps) => {
  const detailItems = [
    { label: "Total Price", value: formatPrice(order.totalPrice) },
    { 
      label: "Total Paid", 
      value: formatPrice(order.totalPaidAmount || 0),
      className: "text-emerald-600 font-bold"
    },
    { 
      label: "Total Refunded", 
      value: formatPrice(order.totalRefundAmount || 0),
      className: "text-rose-600 font-bold"
    },
    { label: "Item Count", value: order.orderItems.length },
    { label: "Order Date", value: formatDateTime(order.createdAt) },
    { label: "Customer Name", value: order.customerName ?? "-" },
    { label: "Customer Phone", value: order.customerPhone ?? "-" },
    { label: "Customer Address", value: order.customerAddress ?? "-" },
  ];

  return (
    <Card className="w-full p-3 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between justify-start items-start gap-8">
        <div className="w-full lg:w-1/2">
          {order.image ? (
            <img
              src={formatImagePath(order.image, "order")}
              alt={order.code}
              className="h-auto w-full rounded-lg object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="bg-muted/10 flex h-auto w-full flex-col items-center justify-center gap-3 rounded-lg border-muted-foreground/25 border-2 border-dashed p-8">
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                <ImageIcon className="text-muted-foreground h-6 w-6" />
                <p className="text-muted-foreground text-xs font-normal">
                  No Payment Slip
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-start items-start gap-8 w-full lg:w-1/2">
          <div className="space-y-4 w-full">
            <div className="flex flex-col gap-2 text-sm">
              {detailItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-x-4 sm:items-center"
                >
                  <div className="flex min-w-32 items-center justify-between">
                    <span className="font-semibold">{item.label}</span>
                    <span className="font-semibold">-</span>
                  </div>
                  <span className={`break-all ${item.className || ""}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-start gap-2">
              <Badge variant={getOrderStatusVariant(order.status)}>
                {order.status}
              </Badge>

              <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                {order.paymentStatus}
              </Badge>
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div className="prose prose-sm dark:prose-invert lg:prose-base max-w-none space-y-1">
              <h4 className="font-semibold">Customer Notes:</h4>
              <p className="opacity-60">{order.customerNotes || "-"}</p>
            </div>

            <div className="prose prose-sm dark:prose-invert lg:prose-base max-w-none text-destructive space-y-1">
              <h4 className="font-semibold">Rejected Reason:</h4>
              <p className="opacity-60">{order.rejectedReason || "-"}</p>
            </div>

            <div className="prose prose-sm dark:prose-invert lg:prose-base max-w-none text-destructive space-y-1">
              <h4 className="font-semibold">Cancelled Reason:</h4>
              <p className="opacity-60">{order.cancelledReason || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderDetailCard;
