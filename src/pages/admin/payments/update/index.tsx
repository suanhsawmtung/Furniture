import { PaymentForm } from "@/components/admin/payment/form/payment-form";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetPayment } from "@/services/payment/queries/useGetPayment";
import { useParams, useSubmit } from "react-router";

const AdminPaymentUpdatePage = () => {
  const { id } = useParams();
  const submit = useSubmit();

  if (!id) {
    throw new Response("Payment ID is required", { status: 400 });
  }

  const { data: payment } = useGetPayment(id);

  const handleSubmit = (values: any) => {
    submit(values, { method: "patch" });
  };

  return (
    <section className="w-full">
      <AdminHeaderSection title="Edit Payment" />

      <div className="space-y-5">
        <BackButton to="/admin/payments" />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 py-6">
            <PaymentForm 
              initialValues={payment} 
              onSubmit={handleSubmit} 
              isUpdate 
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminPaymentUpdatePage;
