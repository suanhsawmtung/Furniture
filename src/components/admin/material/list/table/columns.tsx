import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { MaterialType } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon, PencilLineIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";

export const columns: ColumnDef<MaterialType>[] = [
  {
    accessorKey: "name",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-start text-sm font-semibold">
          Name
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm font-semibold">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    id: "productCount",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Product Count
        </div>
      );
    },
    cell: ({ row }) => {
      const productCount = row.original._count?.products ?? 0;
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {productCount}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Created At
        </div>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date | string;
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {formatDate(createdAt)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-sm border-none px-2 text-xs font-normal"
            asChild
          >
            <Link
              to={`/admin/materials/${row.original.slug}`}
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
            <Link to={`/admin/materials/${row.original.slug}/edit`}>
              <PencilLineIcon size={16} />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 rounded-sm border-none bg-red-50 p-1 text-red-400 hover:bg-red-50 hover:text-red-400"
            asChild
          >
            <Link to={`/admin/materials/${row.original.slug}/delete`}>
              <Trash2Icon size={16} />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
