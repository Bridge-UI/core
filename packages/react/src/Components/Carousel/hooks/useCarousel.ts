// ** External Imports
import { get, omit } from "es-toolkit/compat";
import type {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
} from "react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ** Core Imports
import type { SemanticIconName } from "@bridge-ui/core/Adapters";
import {
  canMoveCarousel,
  clampCarouselIndex,
  getAdjacentCarouselIndex,
  getCarouselMaxIndex,
  getCarouselSlideStyle,
  getCarouselTrackStyle,
  resolveCarouselAutoPlayInterval,
  resolveCarouselSwipeDirection,
  shouldPauseCarouselAutoPlay,
} from "@bridge-ui/core/Domain";
import {
  carouselSizeProps as sizeProps,
  type IconSize,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type { CarouselContextValue } from "@/Components/Carousel/CarouselContext";
import type {
  CarouselOwnProps,
  CarouselProps,
} from "@/Components/Carousel/carousel.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const carouselBridgeKeys = [
  "gap",
  "loop",
  "size",
  "align",
  "index",
  "slots",
  "classes",
  "autoPlay",
  "children",
  "indicators",
  "customProps",
  "orientation",
  "defaultIndex",
  "onIndexChange",
  "slidesPerView",
] as const satisfies readonly ("onIndexChange" | keyof CarouselOwnProps)[];

type CarouselLibDefaults = LibDefaultsShape<
  CarouselOwnProps,
  | "gap"
  | "loop"
  | "size"
  | "align"
  | "autoPlay"
  | "indicators"
  | "orientation"
  | "defaultIndex"
  | "slidesPerView"
>;

type CarouselMerged = MergeLibDefaults<CarouselOwnProps, CarouselLibDefaults> &
  Pick<CarouselProps, "onIndexChange">;

const rootEventKeys = [
  "onBlur",
  "onFocus",
  "onKeyDown",
  "onMouseEnter",
  "onMouseLeave",
] as const;

const viewportEventKeys = [
  "onPointerUp",
  "onPointerDown",
  "onPointerCancel",
] as const;

function isEditableTarget(target: null | EventTarget): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tag = target.tagName;

  return tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";
}

export function useCarousel(
  props: CarouselProps,
  libDefaults: CarouselLibDefaults,
) {
  const resolveMessage = useResolveMessage();
  const reactId = useId();
  const carouselId = `bridge-carousel${reactId.replace(/:/g, "")}`;
  const counterRef = useRef(0);
  const seenIndexRef = useRef<null | number>(null);
  const swipeStart = useRef<null | {
    pointerId: number;
    x: number;
    y: number;
  }>(null);

  counterRef.current = 0;

  const { componentProps, inheritedAttrs } = splitComponentProps<
    CarouselProps,
    typeof carouselBridgeKeys
  >({
    props,
    bridgeKeys: carouselBridgeKeys,
  });

  const { merged, entry: bridgeCarousel } = useBridgeUIComponent<
    CarouselMerged,
    "Carousel"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Carousel",
  });

  const isControlled = props.index !== undefined;

  const [uncontrolled, setUncontrolled] = useState(
    () => props.defaultIndex ?? libDefaults.defaultIndex ?? 0,
  );
  const [slideCount, setSlideCount] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const rawIndex = isControlled ? (props.index ?? 0) : uncontrolled;

  const activeIndex = derived(() => {
    if (slideCount <= 0) {
      return rawIndex;
    }

    const max = getCarouselMaxIndex(
      slideCount,
      merged.slidesPerView,
      merged.align,
    );

    return clampCarouselIndex(rawIndex, max + 1);
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeCarousel,
    props: componentProps,
  });

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(sizeProps, bridgeCarousel?.tokens?.size);
  }, [bridgeCarousel?.tokens?.size]);

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  const iconSize = derived(() => {
    return (get(sizeItem, "icon") ?? "sm") as keyof IconSize;
  });

  const takeIndex = useCallback(() => {
    const index = counterRef.current;

    counterRef.current += 1;

    return index;
  }, []);

  const selectIndex = useCallback(
    (index: number) => {
      const count = counterRef.current || slideCount;
      const max =
        count <= 0
          ? null
          : getCarouselMaxIndex(count, merged.slidesPerView, merged.align);
      const next = max == null ? index : clampCarouselIndex(index, max + 1);

      if (next === activeIndex) {
        return;
      }

      if (!isControlled) {
        setUncontrolled(next);
      }

      merged.onIndexChange?.(next);
    },
    [merged, slideCount, activeIndex, isControlled],
  );

  const go = useCallback(
    (direction: 1 | -1) => {
      const count = counterRef.current || slideCount;

      if (
        !canMoveCarousel(
          activeIndex,
          count,
          direction,
          merged.loop,
          merged.slidesPerView,
          merged.align,
        )
      ) {
        return;
      }

      selectIndex(
        getAdjacentCarouselIndex(
          activeIndex,
          count,
          direction,
          merged.loop,
          merged.slidesPerView,
          merged.align,
        ),
      );
    },
    [
      slideCount,
      activeIndex,
      merged.loop,
      selectIndex,
      merged.align,
      merged.slidesPerView,
    ],
  );

  useLayoutEffect(() => {
    const next = counterRef.current;

    setSlideCount((current) => {
      return current === next ? current : next;
    });
  });

  useLayoutEffect(() => {
    if (isControlled || slideCount <= 0) {
      return;
    }

    setUncontrolled((current) => {
      const max = getCarouselMaxIndex(
        slideCount,
        merged.slidesPerView,
        merged.align,
      );
      const next = clampCarouselIndex(current, max + 1);

      return next === current ? current : next;
    });
  }, [slideCount, isControlled, merged.align, merged.slidesPerView]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setReducedMotion(media.matches);
    };

    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const interval = resolveCarouselAutoPlayInterval(merged.autoPlay);

    if (
      interval == null ||
      shouldPauseCarouselAutoPlay({ focused, hovered, reducedMotion })
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      go(1);
    }, interval);

    return () => {
      window.clearInterval(timer);
    };
  }, [go, focused, hovered, reducedMotion, merged.autoPlay]);

  useEffect(() => {
    if (slideCount <= 0) {
      return;
    }

    if (seenIndexRef.current === null) {
      seenIndexRef.current = activeIndex;

      return;
    }

    if (seenIndexRef.current === activeIndex) {
      return;
    }

    seenIndexRef.current = activeIndex;

    setAnnouncement(
      resolveMessage("Slide {{index}} of {{count}}", {
        count: slideCount,
        index: activeIndex + 1,
      }),
    );
  }, [slideCount, activeIndex, resolveMessage]);

  const showControls =
    getCarouselMaxIndex(slideCount, merged.slidesPerView, merged.align) > 0;
  const showIndicators = merged.indicators !== false && slideCount > 1;
  const prevDisabled = !canMoveCarousel(
    activeIndex,
    slideCount,
    -1,
    merged.loop,
    merged.slidesPerView,
    merged.align,
  );
  const nextDisabled = !canMoveCarousel(
    activeIndex,
    slideCount,
    1,
    merged.loop,
    merged.slidesPerView,
    merged.align,
  );
  const vertical = merged.orientation === "vertical";
  const rtl = !vertical && inheritedAttrs.dir === "rtl";
  const prevKey = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
  const nextKey = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [...rootEventKeys]);
  });

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (isEditableTarget(event.target)) {
      inheritedAttrs.onKeyDown?.(event);

      return;
    }

    if (event.key === nextKey) {
      event.preventDefault();
      go(1);
    } else if (event.key === prevKey) {
      event.preventDefault();
      go(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      const count = counterRef.current || slideCount;

      selectIndex(
        getCarouselMaxIndex(count, merged.slidesPerView, merged.align),
      );
    }

    inheritedAttrs.onKeyDown?.(event);
  };

  const onFocus = (event: FocusEvent<HTMLElement>) => {
    setFocused(true);
    inheritedAttrs.onFocus?.(event);
  };

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget;

    if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
      setFocused(false);
    }

    inheritedAttrs.onBlur?.(event);
  };

  const onMouseEnter = (event: MouseEvent<HTMLElement>) => {
    setHovered(true);
    inheritedAttrs.onMouseEnter?.(event);
  };

  const onMouseLeave = (event: MouseEvent<HTMLElement>) => {
    setHovered(false);
    inheritedAttrs.onMouseLeave?.(event);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      customProps?.viewport?.onPointerDown?.(event);

      return;
    }

    swipeStart.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    customProps?.viewport?.onPointerDown?.(event);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;

    swipeStart.current = null;

    if (start && start.pointerId === event.pointerId) {
      const direction = resolveCarouselSwipeDirection(
        event.clientX - start.x,
        event.clientY - start.y,
        {
          rtl,
          orientation: merged.orientation,
        },
      );

      if (direction) {
        go(direction);
      }
    }

    customProps?.viewport?.onPointerUp?.(event);
  };

  const onPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    swipeStart.current = null;
    customProps?.viewport?.onPointerCancel?.(event);
  };

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      onBlur,
      onFocus,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      role: "region" as const,
      "aria-roledescription": "carousel",
      "data-orientation": merged.orientation,
      "aria-label": inheritedAttrs["aria-label"] ?? resolveMessage("Carousel"),
      className: cn({
        [get(sizeItem, "root") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const viewportBind = derived(() => {
    return mergePartBind(
      omit(customProps?.viewport, [...viewportEventKeys]),
      {},
      {
        onPointerUp,
        onPointerDown,
        onPointerCancel,
        "data-part": "viewport",
        className: cn({
          [get(sizeItem, "viewport") ?? ""]: true,
          [get(mergedClasses, "viewport") ?? ""]: true,
          [get(sizeItem, "viewportVertical") ?? ""]: vertical,
        }),
      },
    );
  });

  const trackBind = derived(() => {
    return mergePartBind(
      customProps?.track,
      {},
      {
        "data-part": "track",
        className: cn({
          [get(sizeItem, "track") ?? ""]: true,
          [get(mergedClasses, "track") ?? ""]: true,
          [get(sizeItem, "trackVertical") ?? ""]: vertical,
        }),
        style: getCarouselTrackStyle(activeIndex, {
          rtl,
          gap: merged.gap,
          align: merged.align,
          orientation: merged.orientation,
          slidesPerView: merged.slidesPerView,
        }),
      },
    );
  });

  const controlsBind = derived(() => {
    return mergePartBind(
      customProps?.controls,
      {},
      {
        "data-part": "controls",
        className: cn({
          [get(sizeItem, "controls") ?? ""]: true,
          [get(mergedClasses, "controls") ?? ""]: true,
          [get(sizeItem, "controlsVertical") ?? ""]: vertical,
        }),
      },
    );
  });

  const prevBind = derived(() => {
    return mergePartBind(
      customProps?.prev,
      {},
      {
        "data-part": "prev",
        disabled: prevDisabled,
        type: "button" as const,
        onClick: () => {
          go(-1);
        },
        "aria-label": resolveMessage("Previous slide"),
        className: cn({
          [get(sizeItem, "control") ?? ""]: true,
          [get(mergedClasses, "prev") ?? ""]: true,
          [get(mergedClasses, "control") ?? ""]: true,
        }),
      },
    );
  });

  const nextBind = derived(() => {
    return mergePartBind(
      customProps?.next,
      {},
      {
        "data-part": "next",
        disabled: nextDisabled,
        type: "button" as const,
        "aria-label": resolveMessage("Next slide"),
        onClick: () => {
          go(1);
        },
        className: cn({
          [get(sizeItem, "control") ?? ""]: true,
          [get(mergedClasses, "next") ?? ""]: true,
          [get(mergedClasses, "control") ?? ""]: true,
        }),
      },
    );
  });

  const prevIconBind = derived(() => {
    return mergePartBind(
      customProps?.prevIcon,
      {},
      {
        size: iconSize,
        "aria-hidden": true,
        className: vertical ? undefined : "rtl:rotate-180",
      },
    );
  });

  const nextIconBind = derived(() => {
    return mergePartBind(
      customProps?.nextIcon,
      {},
      {
        size: iconSize,
        "aria-hidden": true,
        className: vertical ? undefined : "rtl:rotate-180",
      },
    );
  });

  const indicatorsBind = derived(() => {
    return mergePartBind(
      customProps?.indicators,
      {},
      {
        role: "group" as const,
        "data-part": "indicators",
        "aria-label": resolveMessage("Slides"),
        className: cn({
          [get(sizeItem, "indicators") ?? ""]: true,
          [get(mergedClasses, "indicators") ?? ""]: true,
        }),
      },
    );
  });

  const liveBind = derived(() => {
    return mergePartBind(
      customProps?.live,
      {},
      {
        "aria-atomic": true,
        "data-part": "live",
        "aria-live": "polite" as const,
        className: cn({
          [get(sizeItem, "live") ?? ""]: true,
          [get(mergedClasses, "live") ?? ""]: true,
        }),
      },
    );
  });

  const getIndicatorBind = useCallback(
    (index: number) => {
      const selected = index === activeIndex;

      return mergePartBind(
        customProps?.indicator,
        {},
        {
          type: "button" as const,
          "data-part": "indicator",
          "aria-current": selected ? ("true" as const) : undefined,
          onClick: () => {
            selectIndex(index);
          },
          "aria-label": resolveMessage("Go to slide {{index}}", {
            index: index + 1,
          }),
          className: cn({
            [get(sizeItem, "indicator") ?? ""]: true,
            [get(sizeItem, "indicatorSelected") ?? ""]: selected,
            [get(mergedClasses, "indicator") ?? ""]: true,
          }),
        },
      );
    },
    [
      sizeItem,
      activeIndex,
      selectIndex,
      mergedClasses,
      resolveMessage,
      customProps?.indicator,
    ],
  );

  const contextValue = useMemo<CarouselContextValue>(() => {
    return {
      sizeItem,
      takeIndex,
      slideCount,
      activeIndex,
      id: carouselId,
      align: merged.align,
      slidePartProps: customProps?.slide,
      slidesPerView: merged.slidesPerView,
      slideClassName: get(mergedClasses, "slide") ?? "",
      slideStyle: getCarouselSlideStyle(
        merged.slidesPerView,
        merged.gap,
        merged.orientation,
      ),
    };
  }, [
    sizeItem,
    takeIndex,
    carouselId,
    merged.gap,
    slideCount,
    activeIndex,
    merged.align,
    mergedClasses,
    customProps?.slide,
    merged.orientation,
    merged.slidesPerView,
  ]);

  return {
    slots,
    children,
    liveBind,
    nextBind,
    prevBind,
    rootBind,
    iconSize,
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
    prevIcon: (vertical ? "chevronUp" : "chevronLeft") as SemanticIconName,
    nextIcon: (vertical ? "chevronDown" : "chevronRight") as SemanticIconName,
  };
}
