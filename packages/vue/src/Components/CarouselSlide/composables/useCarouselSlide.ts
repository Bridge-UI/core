// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  inject,
  onBeforeUnmount,
  useAttrs,
  useId,
  watchEffect,
} from "vue";

// ** Core Imports
import {
  getCarouselSlideId,
  isCarouselSlideInView,
} from "@bridge-ui/core/Domain";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { CAROUSEL_INJECTION_KEY } from "@/Components/Carousel/carouselInjectionKey";
import type {
  CarouselSlideOwnProps,
  CarouselSlideProps,
} from "@/Components/CarouselSlide/carouselSlide.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const carouselSlideBridgeKeys = [
  "classes",
  "customProps",
] as const satisfies readonly (keyof CarouselSlideOwnProps)[];

function cssStyle(value: unknown): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, string>;
  }

  return {};
}

export function useCarouselSlide(props: CarouselSlideOwnProps) {
  const attrs = useAttrs();
  const slideUid = useId();
  const resolveMessage = useResolveMessage();
  const injected = inject(CAROUSEL_INJECTION_KEY, null);

  if (!injected) {
    throw new Error("CarouselSlide must be used within a Carousel provider");
  }

  const carousel = injected;
  let unregister: null | (() => void) = null;

  unregister = carousel.value.registerSlide(slideUid);

  onBeforeUnmount(() => {
    unregister?.();
    unregister = null;
  });

  const index = computed(() => {
    return carousel.value.getIndex(slideUid);
  });

  const selected = computed(() => {
    return index.value === carousel.value.activeIndex;
  });

  const inView = computed(() => {
    return isCarouselSlideInView({
      slideIndex: index.value,
      activeIndex: carousel.value.activeIndex,
      slidesPerView: carousel.value.slidesPerView,
    });
  });

  const slideId = computed(() => {
    return getCarouselSlideId(carousel.value.id, index.value);
  });

  const split = computed(() => {
    return splitComponentProps<
      CarouselSlideProps,
      typeof carouselSlideBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: carouselSlideBridgeKeys,
    });
  });

  const { merged, entry: bridgeSlide } = useBridgeUIComponent<
    CarouselSlideOwnProps,
    "CarouselSlide"
  >({
    componentName: "CarouselSlide",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeSlide,
    props: () => split.value.componentProps,
  });

  const label = computed(() => {
    const slideIndex = index.value + 1;

    if (carousel.value.slideCount > 0) {
      return resolveMessage("Slide {{index}} of {{count}}", {
        index: slideIndex,
        count: carousel.value.slideCount,
      });
    }

    return resolveMessage("Slide {{index}}", { index: slideIndex });
  });

  watchEffect(() => {
    const node = document.getElementById(slideId.value);

    if (!node) {
      return;
    }

    if (inView.value) {
      node.removeAttribute("inert");
    } else {
      node.setAttribute("inert", "");
    }
  });

  const rootBind = computed(() => {
    const own = merged.value.customProps?.root;

    return mergePartBind(
      {
        ...split.value.inheritedAttrs,
        ...own,
        class: cn(split.value.inheritedAttrs.class, own?.class),
        style: {
          ...carousel.value.slideStyle,
          ...cssStyle(split.value.inheritedAttrs.style),
          ...cssStyle(carousel.value.slidePartProps?.style),
          ...cssStyle(own?.style),
        },
      },
      omit(carousel.value.slidePartProps, ["class", "style"]),
      {
        role: "group",
        id: slideId.value,
        "data-part": "slide",
        "aria-label": label.value,
        "aria-roledescription": "slide",
        inert: inView.value ? undefined : true,
        "aria-hidden": inView.value ? undefined : true,
        class: cn(
          split.value.inheritedAttrs.class,
          carousel.value.slidePartProps?.class,
          {
            [carousel.value.slideClassName]: true,
            [get(mergedClasses.value, "root") ?? ""]: true,
            [get(carousel.value.sizeItem, "slide") ?? ""]: true,
          },
        ),
      },
    );
  });

  return {
    index,
    rootBind,
    selected,
  };
}
