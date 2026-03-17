import { RefundForm } from "@/components/admin/refund/form/refund-form";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetRefund } from "@/services/refund/queries/useGetRefund";
import { useParams } from "react-router";

const AdminRefundEditPage = () => {
  const { id } = useParams();

  if (!id) {
    throw new Response("Refund ID is required", { status: 400 });
  }

  const refundId = Number(id);
  const { data: refund } = useGetRefund(refundId);

  return (
    <section className="w-full">
      <AdminHeaderSection title="Edit Refund" />

      <div className="space-y-5">
        <BackButton to="/admin/refunds" />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 py-2">
            <RefundForm refund={refund} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminRefundEditPage;
