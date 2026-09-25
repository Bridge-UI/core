// ** Local Imports
import type { CarouselSlideProps } from "@/Components/CarouselSlide/carouselSlide.types";
import { useCarouselSlide } from "@/Components/CarouselSlide/hooks/useCarouselSlide";

function CarouselSlide(props: CarouselSlideProps) {
  const { children, rootBind } = useCarouselSlide(props);

  return <div {...rootBind}>{children}</div>;
}

export default CarouselSlide;
