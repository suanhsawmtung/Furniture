import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getRefundStatusVariant } from "@/lib/utils";
import { useGetRefund } from "@/services/refund/queries/useGetRefund";
import type { RefundStatus } from "@/types/refund.type";
import { useParams } from "react-router";

const AdminRefundDetailPage = () => {
  const { id } = useParams();

  if (!id) {
    throw new Response("Refund ID is required", { status: 400 });
  }

  const { data: refund } = useGetRefund(Number(id));

  return (
    <section className="w-full">
      <AdminHeaderSection title="Refund Detail" />

      <div className="space-y-5">
        <BackButton to="/admin/refunds" />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              {/* Main Info section */}
              <div className="flex w-full flex-col gap-4">
                <div>
                  <h1 className="text-2xl font-bold lg:text-3xl">
                    Refund for Order #{refund.order?.code}
                  </h1>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-x-4">
                    <div className="flex min-w-32 items-center justify-between">
                      <span className="font-semibold text-muted-foreground">Order Code</span>
                      <span className="font-semibold text-muted-foreground">-</span>
                    </div>
                    <span className="font-medium text-lg">{refund.order?.code}</span>
                  </div>
                  
                  <div className="flex items-center gap-x-4">
                    <div className="flex min-w-32 items-center justify-between">
                      <span className="font-semibold text-muted-foreground">Amount</span>
                      <span className="font-semibold text-muted-foreground">-</span>
                    </div>
                    <span className="font-bold text-lg text-primary">
                      {Number(refund.amount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-x-4">
                    <div className="flex min-w-32 items-center justify-between">
                      <span className="font-semibold text-muted-foreground">Status</span>
                      <span className="font-semibold text-muted-foreground">-</span>
                    </div>
                    <Badge
                      variant={getRefundStatusVariant(refund.status as RefundStatus)}
                    >
                      {refund.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-x-4">
                    <div className="flex min-w-32 items-center justify-between">
                      <span className="font-semibold text-muted-foreground">Created At</span>
                      <span className="font-semibold text-muted-foreground">-</span>
                    </div>
                    <span>{formatDate(refund.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reason</h3>
                  <div className="bg-secondary/30 p-4 rounded-lg border border-border/50">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {refund.reason || "No reason provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminRefundDetailPage;