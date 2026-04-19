import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabButton } from "@/components/ui/tab-button";
import { formatImagePath, formatPrice } from "@/lib/utils";
import type { ProductDetailType } from "@/types/product.type";
import { CircleChevronDown, CircleChevronUp } from "lucide-react";
import { useRef, useState } from "react";

type ProductVariantsPanelProps = {
  product: ProductDetailType;
};

const ProductVariantsPanel = ({ product }: ProductVariantsPanelProps) => {
  const [openVariantSlug, setOpenVariantSlug] = useState<string | undefined>(
    undefined,
  );
  const [highlightedSlug, setHighlightedSlug] = useState<string | undefined>(
    undefined,
  );
  const variantRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const highlightDurationMs = 1000;

  const originalVariants = product.variants.filter(
    (variant) => variant.source === "ORIGINAL",
  );
  const decantVariants = product.variants.filter(
    (variant) => variant.source === "DECANT",
  );

  const handleVariantClick = (slug: string) => {
    setOpenVariantSlug(slug);
    setHighlightedSlug(slug);
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedSlug((prev) => (prev === slug ? undefined : prev));
    }, highlightDurationMs);
    requestAnimationFrame(() => {
      variantRefs.current[slug]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const renderVariantTabs = (
    title: string,
    variants: ProductDetailType["variants"],
  ) => (
    <div className="flex flex-col items-start justify-start gap-y-1">
      <h3 className="text-muted-foreground text-base font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <TabButton
            key={variant.slug}
            text={`${variant.size}ml`}
            isSelected={false}
            disabled={!variant.isActive}
            onClick={() => handleVariantClick(variant.slug)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {originalVariants.length > 0 &&
        renderVariantTabs("Original Variants", originalVariants)}
      {decantVariants.length > 0 &&
        renderVariantTabs("Decant Variants", decantVariants)}

      <div className="space-y-4">
        {product.variants.map((variant) => {
          const price = Number(variant.price);
          const discount = Number(variant.discount);
          const hasDiscount = Number.isFinite(discount) && discount > 0;
          const discountedPrice = hasDiscount ? price - discount : price;
          const inventory = variant.inventories[0];

          const detailItems = [
            { label: "SKU", value: variant.sku },
            { label: "Size", value: `${variant.size}ml` },
            { label: "Source", value: variant.source },
            { label: "Stock", value: variant.stock ?? 0 },
            { label: "Reserved", value: inventory?.reserved ?? 0 },
          ];

          return (
            <div
              key={variant.slug}
              ref={(node) => {
                variantRefs.current[variant.slug] = node;
              }}
              className={
                highlightedSlug === variant.slug
                  ? "ring-primary/60 ring-offset-background rounded-lg ring-2 ring-offset-2 transition"
                  : "rounded-lg transition"
              }
            >
              <Card className="w-full p-4">
                <Accordion
                  type="single"
                  collapsible
                  value={openVariantSlug}
                  onValueChange={setOpenVariantSlug}
                >
                  <AccordionItem value={variant.slug} className="border-none">
                    <div className="space-y-4">
                      <div className="flex flex-col items-start justify-start gap-2 text-sm">
                        {detailItems.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-start gap-x-4 sm:items-center"
                          >
                            <div className="flex min-w-26 items-center justify-between">
                              <span className="font-semibold">
                                {item.label}
                              </span>
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
                                  {formatPrice(price)}
                                </span>
                                <span>{formatPrice(discountedPrice)}</span>
                              </>
                            ) : (
                              formatPrice(price)
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center justify-start gap-2">
                          {variant.isPrimary && (
                            <Badge variant="default">Primary</Badge>
                          )}
                          <Badge
                            variant={variant.isActive ? "default" : "secondary"}
                          >
                            {variant.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <AccordionTrigger
                          hideIcon
                          className="ml-auto w-full py-0"
                        >
                          <Button
                            variant="secondary"
                            className="ml-auto flex items-center justify-center gap-4"
                            size="sm"
                          >
                            {openVariantSlug === variant.slug
                              ? "See Less"
                              : "See More"}
                            {openVariantSlug === variant.slug ? (
                              <CircleChevronUp />
                            ) : (
                              <CircleChevronDown />
                            )}
                          </Button>
                        </AccordionTrigger>
                      </div>

                      <AccordionContent>
                        <div className="flex flex-wrap items-center gap-2">
                          {variant.images.length > 0 ? (
                            [...variant.images]
                              .sort(
                                (a, b) =>
                                  Number(b.isPrimary) - Number(a.isPrimary),
                              )
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
                      </AccordionContent>
                    </div>
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariantsPanel;
