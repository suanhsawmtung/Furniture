import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatDate,
  formatPrice,
  getPaymentStatusVariant,
} from "@/lib/utils";
import { useGetPayment } from "@/services/payment/queries/useGetPayment";
import { Link, useParams } from "react-router";

export default function AdminPaymentDetailPage() {
  const { id } = useParams();

  if (!id) {
    throw new Response("Payment ID is required", { status: 400 });
  }

  const { data: payment } = useGetPayment(id);

  if (!payment) return <div>Payment not found</div>;

  return (
    <section className="w-full">
      <AdminHeaderSection title="Payment Details" />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <BackButton to="/admin/payments" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-lg font-bold">
                  {formatPrice(payment.amount)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={getPaymentStatusVariant(payment.status as any)}>
                  {payment.status}
                </Badge>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Method</span>
                <Badge variant="outline">
                  {payment.method.replace("_", " ")}
                </Badge>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Paid At</span>
                <span>{payment.paidAt ? formatDate(payment.paidAt) : "-"}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-muted-foreground">Created At</span>
                <span>{formatDate(payment.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Order Code</span>
                {payment.order ? (
                  <Link
                    to={`/admin/orders/${payment.order.code}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {payment.order.code}
                  </Link>
                ) : (
                  "-"
                )}
              </div>
              <div className="space-y-2">
                <span className="text-muted-foreground">Reference</span>
                <p className="rounded-md bg-muted p-3 text-sm italic">
                  {payment.reference || "No reference provided"}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-muted-foreground">Internal Note</span>
                <p className="rounded-md bg-muted p-3 text-sm">
                  {payment.note || "No notes"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
