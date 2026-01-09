import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router";

interface ProductCarouselProps {
  products: Product[];
}

const CardCarousel = ({ products }: ProductCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/2 xl:basis-1/3">
            <Card className="py-0">
              <CardContent className="flex items-center gap-x-4 p-2">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-1/4 rounded-md"
                />
                <div className="flex flex-col items-start justify-between gap-y-2">
                  <h3 className="text-hero line-clamp-1 text-sm font-bold">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {product.description}
                  </p>
                  <Link
                    to={`/products/${product.id}`}
                    className="text-hero text-sm font-bold hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="top-auto -bottom-12 left-1/3 translate-y-0 md:left-2/5 lg:top-1/2 lg:bottom-auto lg:-left-12 lg:-translate-y-1/2" />
      <CarouselNext className="top-auto right-1/3 -bottom-12 translate-y-0 md:right-2/5 lg:top-1/2 lg:-right-12 lg:-translate-y-1/2" />
    </Carousel>
  );
};

export default CardCarousel;
