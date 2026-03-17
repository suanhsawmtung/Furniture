import { RefundForm } from "@/components/admin/refund/form/refund-form";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminRefundCreatePage() {
  return (
    <section className="w-full">
      <AdminHeaderSection title="Create Refund" />

      <div className="space-y-5">
        <BackButton to="/admin/refunds" />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 py-2">
            <RefundForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
