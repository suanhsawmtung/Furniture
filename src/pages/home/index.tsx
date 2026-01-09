import Couch from "@/assets/images/couch.png";
import CardCarousel from "@/components/home/card-carousel";
import FeaturedProductsSection from "@/components/home/sections/featured-products-section";
import RecentBlogsSection from "@/components/home/sections/recent-blogs-section";
import { Button } from "@/components/ui/button";
import ContentWrapper from "@/components/wrapper/content-wrapper";
import { posts } from "@/data/posts";
import { products } from "@/data/products";
import { Link } from "react-router";

const HomePage = () => {
  return (
    <ContentWrapper className="h-full w-full">
      <section className="mdx:py-16 w-full py-12 lg:h-[calc(100vh-4rem)] lg:py-4">
        <div className="flex flex-col items-center justify-between lg:h-4/5 lg:flex-row">
          <div className="xs:pb-10 mdx:pb-20 mdx:gap-y-8 flex w-full flex-col items-start gap-y-6 sm:gap-y-4 sm:pb-0 lg:w-1/2 2xl:w-2/5">
            <h1 className="text-hero text-4xl font-extrabold lg:mb-2 lg:text-5xl xl:text-6xl">
              Modern Interior Design Studio
            </h1>
            <p className="text-hero">
              Furniture is an essential component of any living space, providing
              functionality, comfort, and aesthetic appeal.
            </p>
            <div className="flex items-center gap-x-4">
              <Button
                asChild
                className="w-36 rounded-full bg-orange-300 py-6 text-base font-bold"
              >
                <Link to="#">Shop Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="text-hero w-36 rounded-full py-6 text-base font-bold"
              >
                <Link to="#">Explore</Link>
              </Button>
            </div>
          </div>

          <div className="xs:mb-10 w-full sm:mb-0 lg:w-1/2 2xl:w-3/5">
            <img
              src={Couch}
              alt="Couch"
              className="aspect-[4/3] object-contain"
            />
          </div>
        </div>

        <CardCarousel products={products} />
      </section>

      <FeaturedProductsSection products={products} />

      <RecentBlogsSection posts={posts} />
    </ContentWrapper>
  );
};

export default HomePage;
