import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getRefundStatusVariant } from "@/lib/utils";
import type { RefundType } from "@/types/refund.type";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon, PencilLineIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { DeleteRefundDialog } from "../../actions/delete-refund-dialog";

const ActionsCell = ({ refund }: { refund: RefundType }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-7 rounded-sm border-none px-2 text-xs font-normal"
        asChild
      >
        <Link
          to={`/admin/refunds/${refund.id}`}
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
        <Link to={`/admin/refunds/${refund.id}/edit`}>
          <PencilLineIcon size={16} />
        </Link>
      </Button>

      <DeleteRefundDialog refund={refund}>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 rounded-sm border-none bg-red-50 p-1 text-red-400 hover:bg-red-50 hover:text-red-400"
          asChild
        >
          <Trash2Icon size={16} />  
        </Button>        
      </DeleteRefundDialog>
    </div>
  );
};

export const columns: ColumnDef<RefundType>[] = [
  {
    accessorKey: "order",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-start text-sm font-semibold">
          Order Code
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm font-semibold">
        {row.original.order?.code || "-"}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Amount
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          ${amount.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Reason
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground line-clamp-1 max-w-[200px] text-center text-sm font-normal">
        {row.getValue("reason") || "-"}
      </div>
    ),
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
      const status = row.getValue("status") as RefundType["status"];
      const statusVariant = getRefundStatusVariant(status);
      return (
        <div className="flex items-center justify-center">
          <Badge variant={statusVariant}>{status}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Created Date
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground text-center text-sm font-normal">
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return <ActionsCell refund={row.original} />;
    },
  },
];
