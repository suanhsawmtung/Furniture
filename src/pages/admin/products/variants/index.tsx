import { ProductVariantsList } from "@/components/admin/product/variants/list/variants-list";
import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { CreateButton } from "@/components/admin/shared/create-button";
import { useGetProductVariants } from "@/services/product/queries/useGetProductVariants";
import { useParams } from "react-router";

const AdminProductVariantsPage = () => {
  const { slug } = useParams();

  if (!slug) {
    throw new Response("Product slug is required", { status: 400 });
  }

  const { data: product } = useGetProductVariants(slug);

  return (
    <section className="w-full">
      <AdminHeaderSection title="Product Variants" />

      <div className="space-y-5">
        <div className="flex w-full items-end justify-between gap-2">
          <BackButton to="/admin/products" />
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
    </section>
  );
};

export default AdminProductVariantsPage;
