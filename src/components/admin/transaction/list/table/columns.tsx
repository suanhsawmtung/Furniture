import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cn,
  formatDateTime,
  formatPrice,
  getTransactionTypeVariant
} from "@/lib/utils";
import type { TransactionType } from "@/types/transaction.type";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon, PencilLineIcon } from "lucide-react";
import { Link } from "react-router";

const ActionsCell = ({ transaction }: { transaction: TransactionType }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-7 rounded-sm border-none px-2 text-xs font-normal"
        asChild
      >
        <Link
          to={`/admin/transactions/${transaction.id}`}
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
        <Link to={`/admin/transactions/${transaction.id}/edit`}>
          <PencilLineIcon size={16} />
        </Link>
      </Button>
    </div>
  );
};

export const columns: ColumnDef<TransactionType>[] = [
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const direction = row.original.direction;
      const plusOrMinus = direction === "IN" ? "+" : "-";
      return (
        <span className={cn("font-semibold", direction === "IN" ? "text-green-500" : "text-red-500")}>
          {plusOrMinus} {formatPrice(row.original.amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return <Badge variant={getTransactionTypeVariant(type)}>{type}</Badge>;
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <div className={cn("text-sm", !row.original.createdBy?.username && "ml-4")}>
         {row.original.createdBy?.username || "-"}
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return <ActionsCell transaction={row.original} />;
    },
  },
];
