import { RefundFilterDialog } from "@/components/admin/refund/list/refund-filter-dialog";
import { RefundsList } from "@/components/admin/refund/list/refunds-list";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { CreateButton } from "@/components/admin/shared/create-button";
import { FilterBar } from "@/components/admin/shared/filter-bar";
import { MoreFilterButton } from "@/components/admin/shared/more-filter-button";
import { isRefundStatus } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/services/refund/api";
import { useListRefunds } from "@/services/refund/queries/useGetRefunds";
import { useSearchParams } from "react-router";

export default function AdminRefundsPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") ?? 1);
  
  const statusParam = searchParams.get("status");
  const status = isRefundStatus(statusParam) ? statusParam : undefined;

  const offset = (page - 1) * DEFAULT_LIMIT;

  const { data } = useListRefunds({
    limit: DEFAULT_LIMIT,
    offset,
    search,
    status,
  });

  return (
    <section className="w-full">
      <AdminHeaderSection title="Refunds" />

      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-x-2">
            <CreateButton text="Create Refund" to="/admin/refunds/create" />

            <div className="block sm:hidden">
              <RefundFilterDialog>
                <MoreFilterButton />
              </RefundFilterDialog>
            </div>
          </div>

          <FilterBar>
            <RefundFilterDialog>
              <MoreFilterButton />
            </RefundFilterDialog>
          </FilterBar>
        </div>

        {data && (
          <RefundsList
            refunds={data.refunds}
            total={data.totalPages}
            page={data.currentPage}
          />
        )}
      </div>
    </section>
  );
}
