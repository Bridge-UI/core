// ** Local Imports
import type { CarouselProps } from "@/Components/Carousel/carousel.types";
import { CarouselContext } from "@/Components/Carousel/CarouselContext";
import { useCarousel } from "@/Components/Carousel/hooks/useCarousel";
import { Icon } from "@/Components/Icon";

const carouselLibDefaults = {
  gap: 0,
  size: "md",
  loop: false,
  align: "start",
  autoPlay: false,
  defaultIndex: 0,
  indicators: true,
  slidesPerView: 1,
  orientation: "horizontal",
} as const;

function Carousel(props: CarouselProps) {
  const {
    slots,
    children,
    liveBind,
    nextBind,
    prevBind,
    rootBind,
    prevIcon,
    nextIcon,
    trackBind,
    activeIndex,
    controlsBind,
    nextIconBind,
    prevIconBind,
    showControls,
    viewportBind,
    contextValue,
    announcement,
    indicatorsBind,
    showIndicators,
    getIndicatorBind,
  } = useCarousel(props, carouselLibDefaults);

  return (
    <CarouselContext.Provider value={contextValue}>
      <section {...rootBind}>
        <div {...viewportBind}>
          <div {...trackBind}>{children}</div>
          {showControls ? (
            <div {...controlsBind}>
              <button {...prevBind}>
                {slots?.prev ?? <Icon icon={prevIcon} {...prevIconBind} />}
              </button>
              <button {...nextBind}>
                {slots?.next ?? <Icon icon={nextIcon} {...nextIconBind} />}
              </button>
            </div>
          ) : null}
        </div>
        {showIndicators ? (
          <div {...indicatorsBind}>
            {Array.from({ length: contextValue.slideCount }, (_, index) => (
              <button key={index} {...getIndicatorBind(index)}>
                {slots?.indicator?.({
                  index,
                  selected: index === activeIndex,
                })}
              </button>
            ))}
          </div>
        ) : null}
        <div {...liveBind}>{announcement}</div>
      </section>
    </CarouselContext.Provider>
  );
}

export default Carousel;
