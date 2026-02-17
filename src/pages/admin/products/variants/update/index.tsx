import { ProductVariantForm } from "@/components/admin/product/variants/form/variant-form";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProductVariant } from "@/services/product/queries/useGetProductVariant";
import { useParams } from "react-router";

const AdminProductVariantUpdatePage = () => {
  const { slug, variantSlug } = useParams();

  if (!slug) {
    throw new Response("Product slug is required", { status: 400 });
  }

  if (!variantSlug) {
    throw new Response("Variant slug is required", { status: 400 });
  }

  const { data: variant } = useGetProductVariant(slug, variantSlug);

  return (
    <section className="w-full">
      <AdminHeaderSection title="Update Product Variant" />

      <div className="space-y-5">
        <BackButton to={`/admin/products/${slug}/variants`} />
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 py-2">
            <ProductVariantForm productSlug={slug} variant={variant} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminProductVariantUpdatePage;
