import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { ProductVariantSummaryType } from "@/types/product.type";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon, PencilLineIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { DeleteVariantDialog } from "../../actions/delete-variant-dialog";

const ActionsCell = ({
  productSlug,
  variant,
  totalVariantCount,
}: {
  productSlug: string;
  variant: ProductVariantSummaryType;
  totalVariantCount: number;
}) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-7 rounded-sm border-none px-2 text-xs font-normal"
        asChild
      >
        <Link
          to={`/admin/products/${productSlug}/variants/${variant.slug}`}
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
        <Link
          to={`/admin/products/${productSlug}/variants/${variant.slug}/edit`}
        >
          <PencilLineIcon size={16} />
        </Link>
      </Button>

      <DeleteVariantDialog variant={variant} totalVariantCount={totalVariantCount}>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 rounded-sm border-none bg-red-50 p-1 text-red-400 hover:bg-red-50 hover:text-red-400"
          asChild
        >
          <Trash2Icon size={16} />
        </Button>
      </DeleteVariantDialog>
    </div>
  );
};

export const getVariantColumns = ({
  productSlug,
  totalVariantCount,
}: {
  productSlug: string;
  totalVariantCount: number;
}): ColumnDef<ProductVariantSummaryType>[] => [
  {
    accessorKey: "sku",
    header: () => (
      <div className="text-primary flex items-center justify-start text-sm font-semibold">
        SKU
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm font-semibold">
        {row.getValue("sku")}
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: () => (
      <div className="text-primary flex items-center justify-center text-sm font-semibold">
        Size
      </div>
    ),
    cell: ({ row }) => {
      const size = row.getValue("size") as number;
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {size}ml
        </div>
      );
    },
  },
  {
    accessorKey: "source",
    header: () => (
      <div className="text-primary flex items-center justify-center text-sm font-semibold">
        Source
      </div>
    ),
    cell: ({ row }) => {
      const source = row.getValue("source") as string;
      return (
        <div className="flex items-center justify-center">
          <Badge variant="outline">{source}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => (
      <div className="text-primary flex items-center justify-center text-sm font-semibold">
        Price
      </div>
    ),
    cell: ({ row }) => {
      const price = Number(row.getValue("price"));
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {Number.isFinite(price) ? formatPrice(price) : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "discount",
    header: () => (
      <div className="text-primary flex items-center justify-center text-sm font-semibold">
        Discount
      </div>
    ),
    cell: ({ row }) => {
      const discount = Number(row.getValue("discount"));
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {Number.isFinite(discount) && discount > 0
            ? formatPrice(discount)
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "isPrimary",
    header: () => (
      <div className="text-primary flex items-center justify-center text-sm font-semibold">
        Primary
      </div>
    ),
    cell: ({ row }) => {
      const isPrimary = row.getValue("isPrimary") as boolean;
      return (
        <div className="flex items-center justify-center">
          <Badge variant={isPrimary ? "default" : "secondary"}>
            {isPrimary ? "Yes" : "No"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => (
      <div className="text-primary flex items-center justify-center text-sm font-semibold">
        Status
      </div>
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <div className="flex items-center justify-center">
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "quantity",
    header: () => (
      <div className="text-primary flex items-center justify-center text-sm font-semibold">
        Stock
      </div>
    ),
    cell: ({ row }) => {
      const inventory = row.original.inventories[0];
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {inventory?.quantity ?? 0}
        </div>
      );
    },
  },
  {
    id: "reserved",
    header: () => (
      <div className="text-primary flex items-center justify-center text-sm font-semibold">
        Reserved
      </div>
    ),
    cell: ({ row }) => {
      const inventory = row.original.inventories[0];
      return (
        <div className="text-muted-foreground text-center text-sm font-normal">
          {inventory?.reserved ?? 0}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <ActionsCell productSlug={productSlug} variant={row.original} totalVariantCount={totalVariantCount} />
    ),
  },
];
