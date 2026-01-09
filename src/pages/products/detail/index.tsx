import AddToCartForm from "@/components/product/add-to-cart-form";
import AddToFavourite from "@/components/product/add-to-favourite";
import ProductCard from "@/components/product/product-card";
import ProductImageCarousel from "@/components/product/product-image-carousel";
import Rating from "@/components/product/rating";
import SectionHeader from "@/components/shared/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ContentWrapper from "@/components/wrapper/content-wrapper";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";

const ProductDetailPage = () => {
  const { productId } = useParams();

  if (!productId) {
    throw new Response("Not Found", { status: 404 });
  }

  const product = products.find((product) => product.id === productId);

  if (!product) throw new Response("Not Found", { status: 404 });

  return (
    <ContentWrapper className="py-12">
      <div className="flex w-full flex-col items-start gap-y-8">
        <Button asChild variant="outline">
          <Link to="/products">
            <div className="flex items-center gap-x-4">
              <ArrowLeft />
              All Products
            </div>
          </Link>
        </Button>

        <section className="flex w-full flex-col justify-between gap-x-16 lg:flex-row">
          <div className="flex w-full flex-col gap-y-16 lg:w-1/2">
            <ProductImageCarousel images={product.images} className="w-full" />

            <Separator className="block lg:hidden" />
          </div>

          <div className="flex w-full flex-col gap-y-8 pt-12 lg:w-1/2 lg:pt-0">
            <div className="space-y-1.5">
              <h3 className="line-clamp-1 text-2xl font-bold">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-base">
                {formatPrice(product.price)}
              </p>
            </div>

            <Separator />

            <div className="space-y-6">
              <p className="text-muted-foreground text-base">
                {product.inventory} in stock
              </p>

              <div className="flex items-center justify-between">
                <Rating rating={product.rating} />

                <AddToFavourite
                  productId={product.id}
                  rating={product.rating}
                />
              </div>

              <AddToCartForm canBuy={product.status === "active"} />
            </div>

            <Separator />

            <Accordion type="single" collapsible defaultValue="description">
              <AccordionItem value="description">
                <AccordionTrigger className="text-lg font-semibold">
                  Description
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="w-full space-y-8 py-8">
          <SectionHeader title="More Products from Furniture Shops" />

          <ScrollArea>
            <div className="flex space-x-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="min-w-[280px]"
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      </div>
    </ContentWrapper>
  );
};

export default ProductDetailPage;
