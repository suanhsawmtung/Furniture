import ProductCard from "@/components/product/product-card";
import SectionHeader from "@/components/shared/section-header";
import type { Product } from "@/types";

interface Props {
  products: Product[];
}

const FeaturedProductsSection = ({ products }: Props) => {
  return (
    <section className="w-full space-y-8 py-16">
      <SectionHeader
        title="Featured Products"
        link={{
          text: "View All Products",
          href: "/products",
        }}
      />

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:gap-y-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
