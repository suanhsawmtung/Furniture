import { ProductForm } from "@/components/admin/product/form/product-form";
import { ProductVariantsList } from "@/components/admin/product/variants/list/variants-list";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { CreateButton } from "@/components/admin/shared/create-button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProduct } from "@/services/product/queries/useGetProduct";
import { useParams } from "react-router";

const AdminProductEditPage = () => {
  const { slug } = useParams();

  if (!slug) {
    throw new Response("Product slug is required", { status: 400 });
  }

  const { data: product } = useGetProduct(slug);

  return (
    <section className="w-full">
      <AdminHeaderSection title="Edit Product" />

      <div className="space-y-18">
        <div className="space-y-5">
          <BackButton to="/admin/products" />
          <Card className="w-full">
            <CardContent className="flex flex-col gap-6 py-2">
              <ProductForm product={product} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="flex w-full items-center justify-end gap-2">
            <CreateButton
              text="Create Variant"
              to={`/admin/products/${slug}/variants/create`}
            />
          </div>
    
          <ProductVariantsList
            brandName={product.brand.name}
            productName={product.name}
            productSlug={product.slug}
            variants={product.variants}
          />
        </div>
      </div>
    </section>
  );
};

export default AdminProductEditPage;
