import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductVariantSummaryType } from "@/types/product.type";
import { getVariantColumns } from "./table/columns";
import { DataTable } from "./table/data-table";

export function ProductVariantsList({
  brandName,
  productName,
  productSlug,
  variants,
}: {
  brandName: string;
  productName: string;
  productSlug: string;
  variants: ProductVariantSummaryType[];
}) {
  const columns = getVariantColumns({ productSlug, totalVariantCount: variants.length });

  return (
    <Card>
      <CardHeader className="flex flex-col items-start justify-start gap-2 px-4 md:flex-row md:justify-between md:px-6">
        <CardTitle className="w-full text-lg font-semibold md:text-2xl">
          Variants list of "{brandName}" brand's product "{productName}"
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-[400px] px-4 md:px-6">
        <DataTable columns={columns} data={variants} />
      </CardContent>
    </Card>
  );
}
