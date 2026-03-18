import { AdminPagination } from "@/components/admin/shared/pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PaymentType } from "@/types/payment.type";
import { FilterTags } from "../../shared/filter-tags";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

export function PaymentsList({
  payments = [],
  total,
  page,
}: {
  payments?: PaymentType[];
  total?: number;
  page?: number;
}) {
  const currentPage = page || 1;
  const totalPages = total || 1;

  return (
    <Card>
      <CardHeader className="flex flex-col items-start justify-start gap-2 px-4 md:flex-row md:justify-between md:px-6">
        <CardTitle className="w-full text-lg font-semibold md:w-1/4 md:text-2xl">
          All Payments
        </CardTitle>

        <div className="w-full md:w-3/4">
          <FilterTags
            allowedFilters={{
              search: true,
              status: ["PENDING", "SUCCESS", "FAILED", "VOIDED"],
              method: ["BANK_TRANSFER", "CASH", "CARD", "E_WALLET"],
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="min-h-[600px] px-4 md:px-6">
        <DataTable columns={columns} data={payments} />
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className="px-4 md:px-6">
          <div className="w-full lg:w-1/2">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/admin/payments"
              className="flex justify-center lg:justify-start"
            />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
