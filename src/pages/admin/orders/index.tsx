import { OrderList } from "@/components/admin/order/list/order-list";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { isOrderStatus, isPaymentStatus } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/services/order/api";
import { useListOrders } from "@/services/order/queries/useGetOrders";
import { useSearchParams } from "react-router";

const AdminOrdersPage = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") ?? 1);
  
  const statusParam = searchParams.get("status");
  const status = isOrderStatus(statusParam) ? statusParam : undefined;

  const paymentStatusParam = searchParams.get("paymentStatus");
  const paymentStatus = isPaymentStatus(paymentStatusParam) ? paymentStatusParam : undefined;

  const offset = (page - 1) * DEFAULT_LIMIT;

  const { data } = useListOrders({
    offset,
    search,
    limit: DEFAULT_LIMIT,
    status,
    paymentStatus,
  });

  return (
    <section className="w-full">
      <AdminHeaderSection title="Orders" />

      <div className="space-y-5">
        
        {data && (
          <OrderList
            orders={data.orders}
            total={data.totalPages}
            page={data.currentPage}
            size={data.pageSize}
          />
        )}

      </div>
    </section>
  );
};

export default AdminOrdersPage;
