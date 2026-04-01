import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatPrice, getOrderSourceVariant, getOrderStatusVariant, getPaymentStatusVariant } from "@/lib/utils";
import type { OrderType } from "@/types/order.type";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon, PencilLineIcon } from "lucide-react";
import { Link } from "react-router";

// Actions cell component
const ActionsCell = ({ order }: { order: OrderType }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-7 rounded-sm border-none px-2 text-xs font-normal"
        asChild
      >
        <Link
          to={`/admin/orders/${order.code}`}
          className="flex items-center justify-center gap-1 bg-blue-50 text-blue-400 hover:bg-blue-50 hover:text-blue-400"
        >
          Details
          <ArrowRightIcon size={12} />
        </Link>
      </Button>

       <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 rounded-sm border-none bg-blue-50 text-blue-400 hover:bg-blue-50 hover:text-blue-400"
          asChild
        >
          <Link to={`/admin/orders/${order.code}/edit`}>
            <PencilLineIcon size={16} />
          </Link>
        </Button>
    </div>
  );
};

export const columns: ColumnDef<OrderType>[] = [
  {
    accessorKey: "code",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-start text-sm font-semibold">
          Code
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm font-semibold">
        {row.getValue("code")}
      </div>
    ),
  },
  {
    id: "customer",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Customer
        </div>
      );
    },
    cell: ({ row }) => {
      const customerName = row.original.customerName || row.original.user.username || row.original.user.email;
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {customerName}
        </div>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Total
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {formatPrice(row.getValue("totalPrice"))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Status
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderType["status"];
      const variant = getOrderStatusVariant(status);

      return (
        <div className="flex items-center justify-center">
          <Badge variant={variant}>{status}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
         Payment
        </div>
      );
    },
    cell: ({ row }) => {
        const paymentStatus = row.getValue("paymentStatus") as OrderType["paymentStatus"];
        const variant = getPaymentStatusVariant(paymentStatus);

        return (
          <div className="flex items-center justify-center">
            <Badge variant={variant}>{paymentStatus}</Badge>
          </div>
        );
      },
  },
  {
    accessorKey: "source",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Source
        </div>
      );
    },
    cell: ({ row }) => {
        const source = row.getValue("source") as OrderType["source"];
        const variant = getOrderSourceVariant(source);

        return (
          <div className="flex items-center justify-center">
            <Badge variant={variant}>{source}</Badge>
          </div>
        );
      },
  },
  {
    accessorKey: "createdAt",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Date
        </div>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {formatDateTime(date)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return <ActionsCell order={row.original} />;
    },
  },
];
