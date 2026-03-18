import { PaymentForm } from "@/components/admin/payment/form/payment-form";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { action as createAction } from "./action";
import { useSubmit } from "react-router";

export default function AdminPaymentCreatePage() {
  const submit = useSubmit();

  const handleSubmit = (values: any) => {
    submit(values, { method: "post" });
  };

  return (
    <section className="w-full">
      <AdminHeaderSection title="Record Payment" />

      <div className="space-y-5">
        <BackButton to="/admin/payments" />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 py-6">
            <PaymentForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
