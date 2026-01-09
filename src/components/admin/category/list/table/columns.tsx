import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { CategoryType } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon, PencilLineIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";

export const columns: ColumnDef<CategoryType>[] = [
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
    id: "postCount",
    header: () => {
      return (
        <div className="text-primary flex items-center justify-center text-sm font-semibold">
          Post Count
        </div>
      );
    },
    cell: ({ row }) => {
      const postCount = row.original._count?.posts ?? 0;
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {postCount}
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
              to={`/admin/categories/${row.original.slug}`}
              className="flex items-center justify-center gap-1 bg-blue-50 text-blue-400 hover:bg-blue-50 hover:text-blue-400"
            >
              Details
              <ArrowRightIcon size={12} />
            </Link>
          </Button>

          {/* <MoreApplicationActionsMenuDropdown
            triggerContent={
              <Button
                variant="outline"
                size="sm"
                className="bg-secondary-light text-info h-6 w-6 rounded-lg border-none p-1"
              >
                <DotsThreeVerticalIcon size={16} className="text-secondary" />
              </Button>
            }
          /> */}
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 rounded-sm border-none bg-blue-50 text-blue-400 hover:bg-blue-50 hover:text-blue-400"
            asChild
          >
            <Link to={`/admin/categories/${row.original.slug}/edit`}>
              <PencilLineIcon size={16} />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 rounded-sm border-none bg-red-50 p-1 text-red-400 hover:bg-red-50 hover:text-red-400"
            asChild
          >
            <Link to={`/admin/categories/${row.original.slug}/delete`}>
              <Trash2Icon size={16} />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
