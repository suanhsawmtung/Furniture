import AdminHeaderSection from "@/components/admin/shared/admin-header-section";
import { BackButton } from "@/components/admin/shared/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatImagePath, formatPrice } from "@/lib/utils";
import { useGetProductVariant } from "@/services/product/queries/useGetProductVariant";
import { useParams } from "react-router";

const AdminProductVariantDetailPage = () => {
  const { slug, variantSlug } = useParams();

  if (!slug) {
    throw new Response("Product slug is required", { status: 400 });
  }

  if (!variantSlug) {
    throw new Response("Variant slug is required", { status: 400 });
  }

  const { data: variant } = useGetProductVariant(slug, variantSlug);
  const inventory = variant.inventories[0];
  const hasDiscount = Number(variant.discount) > 0;
  const discountedPrice = hasDiscount
    ? Number(variant.price) - Number(variant.discount)
    : Number(variant.price);

  const detailItems = [
    { label: "SKU", value: variant.sku },
    { label: "Size", value: `${variant.size}ml` },
    { label: "Source", value: variant.source },
    { label: "Stock", value: variant.stock ?? 0 },
    { label: "Reserved", value: inventory?.reserved ?? 0 },
  ];

  return (
    <section className="w-full">
      <AdminHeaderSection title="Product Variant Detail" />

      <div className="space-y-5">
        <BackButton to={`/admin/products/${slug}/variants`} />

        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 py-2">
            <h1 className="text-2xl font-bold lg:text-3xl">
              Variant {variant.sku}
            </h1>

            <div className="flex flex-col gap-4 text-sm">
              {detailItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-x-4 sm:items-center"
                >
                  <div className="flex min-w-26 items-center justify-between">
                    <span className="font-semibold">{item.label}</span>
                    <span className="font-semibold">-</span>
                  </div>
                  <span>{item.value}</span>
                </div>
              ))}

              <div className="flex items-start gap-x-4 sm:items-center">
                <div className="flex min-w-26 items-center justify-between">
                  <span className="font-semibold">Price</span>
                  <span className="font-semibold">-</span>
                </div>
                <span className="flex items-center gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-muted-foreground line-through">
                        {formatPrice(variant.price)}
                      </span>
                      <span>{formatPrice(discountedPrice)}</span>
                    </>
                  ) : (
                    formatPrice(variant.price)
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-start gap-2">
              {variant.isPrimary && <Badge variant="default">Primary</Badge>}
              <Badge variant={variant.isActive ? "default" : "secondary"}>
                {variant.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {variant.images.length > 0 ? (
                [...variant.images]
                  .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
                  .map((image) => (
                    <div
                      key={`${variant.slug}-${image.path}`}
                      className="group relative rounded-md"
                    >
                      {image.isPrimary && (
                        <span className="bg-primary text-primary-foreground absolute top-2 left-2 hidden rounded px-2 py-0.5 text-xs font-semibold group-hover:inline-flex">
                          Primary
                        </span>
                      )}
                      <img
                        src={formatImagePath(image.path, "product")}
                        alt={variant.sku}
                        className="h-24 w-auto rounded-md object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))
              ) : (
                <span className="text-muted-foreground text-sm">
                  No images available.
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminProductVariantDetailPage;
