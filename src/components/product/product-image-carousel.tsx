import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  images: string[];
}

const ProductImageCarousel = ({ images, className }: Props) => {
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
      className={className}
    >
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image}>
            <img
              src={image}
              className="w-full rounded-xl object-cover"
              alt="Product Image"
              aria-label="Product Image"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ProductImageCarousel;
