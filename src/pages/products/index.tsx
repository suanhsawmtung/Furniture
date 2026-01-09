import FilterList from "@/components/product/filter-list";
import PaginatedProductSection from "@/components/product/paginated-product-section";
import ContentWrapper from "@/components/wrapper/content-wrapper";
import { filterList, products } from "@/data/products";

const ProductPage = () => {
  return (
    <ContentWrapper className="py-12">
      <div className="flex flex-col items-start justify-start gap-10 lg:flex-row lg:gap-16">
        <FilterList filterLists={filterList} className="w-full lg:w-1/5" />
        <PaginatedProductSection
          products={products}
          className="w-full lg:w-4/5"
        />
      </div>
    </ContentWrapper>
  );
};

export default ProductPage;
