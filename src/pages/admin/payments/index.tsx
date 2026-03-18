import { PaymentFilterDialog } from "@/components/admin/payment/list/payment-filter-dialog";
import { PaymentsList } from "@/components/admin/payment/list/payments-list";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { CreateButton } from "@/components/admin/shared/create-button";
import { FilterBar } from "@/components/admin/shared/filter-bar";
import { MoreFilterButton } from "@/components/admin/shared/more-filter-button";
import { isPaymentStatus } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/services/payment/api";
import { useListPayments } from "@/services/payment/queries/useGetPayments";
import { useSearchParams } from "react-router";

export default function AdminPaymentsPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") ?? 1);
  const statusParam = searchParams.get("status");
  const methodParam = searchParams.get("method");
  
  const status = isPaymentStatus(statusParam) ? statusParam : undefined;
  const method = methodParam || undefined;

  const offset = (page - 1) * DEFAULT_LIMIT;

  const { data } = useListPayments({
    limit: DEFAULT_LIMIT,
    offset,
    search,
    status,
    method,
  });

  console.log(data);

  return (
    <section className="w-full">
      <AdminHeaderSection title="Payments" />

      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-x-2">
            <CreateButton text="Create Payment" to="/admin/payments/create" />

            <div className="block sm:hidden">
              <PaymentFilterDialog>
                <MoreFilterButton />
              </PaymentFilterDialog>
            </div>
          </div>

          <FilterBar>
            <PaymentFilterDialog>
              <MoreFilterButton />
            </PaymentFilterDialog>
          </FilterBar>
        </div>

        {data && (
          <PaymentsList
            payments={data.items}
            total={data.totalPages}
            page={data.currentPage}
          />
        )}
      </div>
    </section>
  );
}
