"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  formatPrice,
  getPaymentStatusVariant,
} from "@/lib/utils";
import type { PaymentType } from "@/types/payment.type";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon, PencilLineIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { DeletePaymentDialog } from "../../actions/delete-payment-dialog";

const ActionsCell = ({ payment }: { payment: PaymentType }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-7 rounded-sm border-none px-2 text-xs font-normal"
        asChild
      >
        <Link
          to={`/admin/payments/${payment.id}`}
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
        <Link to={`/admin/payments/${payment.id}/edit`}>
          <PencilLineIcon size={16} />
        </Link>
      </Button>

      <DeletePaymentDialog payment={payment}>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 rounded-sm border-none bg-red-50 p-1 text-red-400 hover:bg-red-50 hover:text-red-400"
          asChild
        >
          <Trash2Icon size={16} />
        </Button>
      </DeletePaymentDialog>
    </div>
  );
};

export const columns: ColumnDef<PaymentType>[] = [
  {
    accessorKey: "order.code",
    header: "Order Code",
    cell: ({ row }) => {
      const order = row.original.order;
      if (!order) return "-";
      return (
        <Link
          to={`/admin/orders/${order.code}`}
          className="font-medium text-primary hover:underline"
        >
          {order.code}
        </Link>
      );
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as string;
      return <Badge variant="outline">{method.replace("_", " ")}</Badge>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <span className="font-medium">{formatPrice(amount)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as any;
      return (
        <Badge variant={getPaymentStatusVariant(status)}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid At",
    cell: ({ row }) => {
      const paidAt = row.getValue("paidAt") as string;
      return paidAt ? formatDate(paidAt) : "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return formatDate(row.getValue("createdAt"));
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return <ActionsCell payment={row.original} />;
    },
  },
];
