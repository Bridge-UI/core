// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useLayoutEffect } from "react";

// ** Core Imports
import {
  getCarouselSlideId,
  isCarouselSlideInView,
} from "@bridge-ui/core/Domain";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { useCarouselContext } from "@/Components/Carousel/CarouselContext";
import type {
  CarouselSlideOwnProps,
  CarouselSlideProps,
} from "@/Components/CarouselSlide/carouselSlide.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const carouselSlideBridgeKeys = [
  "classes",
  "children",
  "customProps",
] as const satisfies readonly (keyof CarouselSlideOwnProps)[];

export function useCarouselSlide(props: CarouselSlideProps) {
  const carousel = useCarouselContext();
  const resolveMessage = useResolveMessage();

  const index = derived(() => {
    return carousel.takeIndex();
  });

  const selected = derived(() => {
    return index === carousel.activeIndex;
  });

  const inView = derived(() => {
    return isCarouselSlideInView({
      slideIndex: index,
      activeIndex: carousel.activeIndex,
      slidesPerView: carousel.slidesPerView,
    });
  });

  const slideId = derived(() => {
    return getCarouselSlideId(carousel.id, index);
  });

  const { componentProps, inheritedAttrs } = splitComponentProps<
    CarouselSlideProps,
    typeof carouselSlideBridgeKeys
  >({
    props,
    bridgeKeys: carouselSlideBridgeKeys,
  });

  const { merged, entry: bridgeSlide } = useBridgeUIComponent<
    CarouselSlideOwnProps,
    "CarouselSlide"
  >({
    props: componentProps,
    componentName: "CarouselSlide",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeSlide,
    props: componentProps,
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  useLayoutEffect(() => {
    const node = document.getElementById(slideId);

    if (!node) {
      return;
    }

    if (inView) {
      node.removeAttribute("inert");
    } else {
      node.setAttribute("inert", "");
    }
  }, [inView, slideId]);

  const label = derived(() => {
    if (carousel.slideCount > 0) {
      return resolveMessage("Slide {{index}} of {{count}}", {
        index: index + 1,
        count: carousel.slideCount,
      });
    }

    return resolveMessage("Slide {{index}}", { index: index + 1 });
  });

  const rootBind = derived(() => {
    return mergePartBind(
      {
        ...inheritedAttrs,
        ...customProps?.root,
        className: cn(inheritedAttrs.className, customProps?.root?.className),
        style: {
          ...carousel.slideStyle,
          ...inheritedAttrs.style,
          ...carousel.slidePartProps?.style,
          ...customProps?.root?.style,
        },
      },
      omit(carousel.slidePartProps, ["className", "style"]),
      {
        id: slideId,
        "aria-label": label,
        "data-part": "slide",
        role: "group" as const,
        "aria-roledescription": "slide",
        "aria-hidden": inView ? undefined : true,
        className: cn(
          inheritedAttrs.className,
          carousel.slidePartProps?.className,
          {
            [get(carousel.sizeItem, "slide") ?? ""]: true,
            [carousel.slideClassName]: true,
            [get(mergedClasses, "root") ?? ""]: true,
          },
        ),
      },
    );
  });

  return {
    index,
    children,
    rootBind,
    selected,
  };
}
