// ** External Imports
import { get, isFunction, omit } from "es-toolkit/compat";
import {
  computed,
  onMounted,
  onScopeDispose,
  provide,
  ref,
  useAttrs,
  useId,
  watch,
  type Ref,
} from "vue";

// ** Core Imports
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
import type {
  CarouselOwnProps,
  CarouselProps,
} from "@/Components/Carousel/carousel.types";
import {
  CAROUSEL_INJECTION_KEY,
  type CarouselContextValue,
} from "@/Components/Carousel/carouselInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const carouselBridgeKeys = [
  "gap",
  "loop",
  "size",
  "classes",
  "autoPlay",
  "indicators",
  "customProps",
  "orientation",
  "defaultIndex",
  "slidesPerView",
] as const satisfies readonly (keyof CarouselOwnProps)[];

type CarouselLibDefaults = LibDefaultsShape<
  CarouselOwnProps,
  | "gap"
  | "loop"
  | "size"
  | "autoPlay"
  | "indicators"
  | "orientation"
  | "defaultIndex"
  | "slidesPerView"
>;

type CarouselMerged = MergeLibDefaults<CarouselOwnProps, CarouselLibDefaults>;

const rootEventKeys = [
  "onBlur",
  "onFocus",
  "onKeydown",
  "onMouseenter",
  "onMouseleave",
] as const;

const viewportEventKeys = [
  "onPointerup",
  "onPointerdown",
  "onPointercancel",
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

function asListener(value: unknown): undefined | ((event: Event) => void) {
  return isFunction(value) ? (value as (event: Event) => void) : undefined;
}

export function useCarousel(
  props: CarouselOwnProps,
  libDefaults: CarouselLibDefaults,
  model: Ref<number | undefined>,
) {
  const resolveMessage = useResolveMessage();
  const attrs = useAttrs();
  const vueId = useId();
  const carouselId = `bridge-carousel${vueId}`;
  const slideIds = ref<string[]>([]);
  const fallback = ref(props.defaultIndex ?? libDefaults.defaultIndex ?? 0);
  const hovered = ref(false);
  const focused = ref(false);
  const reducedMotion = ref(false);
  const announcement = ref("");
  const seenIndex = ref<null | number>(null);
  const swipeStart = ref<null | { pointerId: number; x: number; y: number }>(
    null,
  );

  const split = computed(() => {
    return splitComponentProps<CarouselProps, typeof carouselBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: carouselBridgeKeys,
    });
  });

  const { merged, entry: bridgeCarousel } = useBridgeUIComponent<
    CarouselMerged,
    "Carousel"
  >({
    libDefaults,
    componentName: "Carousel",
    props: () => split.value.componentProps,
  });

  const activeIndex = computed(() => {
    const raw = model.value ?? fallback.value;
    const count = slideIds.value.length;

    if (count <= 0) {
      return raw;
    }

    const max = getCarouselMaxIndex(count, merged.value.slidesPerView);

    return clampCarouselIndex(raw, max + 1);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeCarousel,
    props: () => split.value.componentProps,
  });

  const sizeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeCarousel.value?.tokens?.size,
    );
  });

  const sizeItem = computed(() => {
    return get(sizeClasses.value, merged.value.size);
  });

  const iconSize = computed(() => {
    return (get(sizeItem.value, "icon") ?? "sm") as keyof IconSize;
  });

  function registerSlide(id: string) {
    if (!slideIds.value.includes(id)) {
      slideIds.value = [...slideIds.value, id];
    }

    return () => {
      slideIds.value = slideIds.value.filter((item) => item !== id);
    };
  }

  function getIndex(id: string) {
    return slideIds.value.indexOf(id);
  }

  function commit(index: number) {
    const count = slideIds.value.length;
    const max =
      count <= 0
        ? null
        : getCarouselMaxIndex(count, merged.value.slidesPerView);
    const next = max == null ? index : clampCarouselIndex(index, max + 1);

    if (next === activeIndex.value) {
      return;
    }

    if (model.value === undefined) {
      fallback.value = next;
    }

    model.value = next;
  }

  function go(direction: 1 | -1) {
    const count = slideIds.value.length;
    const loop = merged.value.loop === true;
    const slidesPerView = merged.value.slidesPerView;

    const move = {
      loop,
      count,
      direction,
      slidesPerView,
      index: activeIndex.value,
    };

    if (!canMoveCarousel(move)) {
      return;
    }

    commit(getAdjacentCarouselIndex(move));
  }

  function selectIndex(index: number) {
    commit(index);
  }

  watch(
    () => {
      return {
        count: slideIds.value.length,
        slidesPerView: merged.value.slidesPerView,
      };
    },
    ({ count }) => {
      if (count <= 0 || model.value !== undefined) {
        return;
      }

      fallback.value = clampCarouselIndex(
        fallback.value,
        getCarouselMaxIndex(count, merged.value.slidesPerView) + 1,
      );
    },
  );

  seenIndex.value = activeIndex.value;

  watch(activeIndex, (index) => {
    if (index === seenIndex.value) {
      return;
    }

    seenIndex.value = index;

    const count = slideIds.value.length;

    if (count <= 0) {
      return;
    }

    announcement.value = resolveMessage("Slide {{index}} of {{count}}", {
      count,
      index: index + 1,
    });
  });

  onMounted(() => {
    if (!isFunction(window.matchMedia)) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      reducedMotion.value = media.matches;
    };

    sync();
    media.addEventListener("change", sync);
    onScopeDispose(() => {
      media.removeEventListener("change", sync);
    });
  });

  let timer: number | undefined;

  function clearTimer() {
    if (timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  }

  watch(
    () => [
      hovered.value,
      focused.value,
      merged.value.loop,
      merged.value.autoPlay,
      reducedMotion.value,
      slideIds.value.length,
    ],
    () => {
      clearTimer();

      const interval = resolveCarouselAutoPlayInterval(merged.value.autoPlay);

      if (
        interval == null ||
        shouldPauseCarouselAutoPlay({
          focused: focused.value,
          hovered: hovered.value,
          reducedMotion: reducedMotion.value,
        })
      ) {
        return;
      }

      timer = window.setInterval(() => {
        go(1);
      }, interval);
    },
    { immediate: true },
  );

  onScopeDispose(clearTimer);

  const snapCount = computed(() => {
    const count = slideIds.value.length;

    if (count <= 0) {
      return 0;
    }

    return getCarouselMaxIndex(count, merged.value.slidesPerView) + 1;
  });

  const showControls = computed(() => {
    return snapCount.value > 1;
  });

  const showIndicators = computed(() => {
    return merged.value.indicators !== false && snapCount.value > 1;
  });

  const vertical = computed(() => {
    return merged.value.orientation === "vertical";
  });

  const rtl = computed(() => {
    return !vertical.value && split.value.inheritedAttrs.dir === "rtl";
  });

  const prevKey = computed(() => {
    if (vertical.value) {
      return "ArrowUp";
    }

    if (rtl.value) {
      return "ArrowRight";
    }

    return "ArrowLeft";
  });

  const nextKey = computed(() => {
    if (vertical.value) {
      return "ArrowDown";
    }

    if (rtl.value) {
      return "ArrowLeft";
    }

    return "ArrowRight";
  });

  const prevDisabled = computed(() => {
    return !canMoveCarousel({
      direction: -1,
      index: activeIndex.value,
      count: slideIds.value.length,
      loop: merged.value.loop === true,
      slidesPerView: merged.value.slidesPerView,
    });
  });

  const nextDisabled = computed(() => {
    return !canMoveCarousel({
      direction: 1,
      index: activeIndex.value,
      count: slideIds.value.length,
      loop: merged.value.loop === true,
      slidesPerView: merged.value.slidesPerView,
    });
  });

  const indicatorIndexes = computed(() => {
    return Array.from({ length: snapCount.value }, (_, index) => index);
  });

  const contextValue = computed<CarouselContextValue>(() => {
    return {
      getIndex,
      registerSlide,
      id: carouselId,
      sizeItem: sizeItem.value,
      activeIndex: activeIndex.value,
      slideCount: slideIds.value.length,
      slidesPerView: merged.value.slidesPerView,
      slidePartProps: merged.value.customProps?.slide,
      slideClassName: get(mergedClasses.value, "slide") ?? "",
      slideStyle: getCarouselSlideStyle(
        merged.value.slidesPerView,
        merged.value.gap,
        merged.value.orientation,
      ),
    };
  });

  provide(CAROUSEL_INJECTION_KEY, contextValue);

  const rootBind = computed(() => {
    const userBlur = asListener(split.value.inheritedAttrs.onBlur);
    const userFocus = asListener(split.value.inheritedAttrs.onFocus);
    const userKeydown = asListener(split.value.inheritedAttrs.onKeydown);
    const userEnter = asListener(split.value.inheritedAttrs.onMouseenter);
    const userLeave = asListener(split.value.inheritedAttrs.onMouseleave);
    const inherited = omit(split.value.inheritedAttrs, [...rootEventKeys]);

    return mergePartBind(merged.value.customProps?.root, inherited, {
      role: "region",
      "aria-roledescription": "carousel",
      "data-orientation": merged.value.orientation,
      onFocus: (event: FocusEvent) => {
        focused.value = true;
        userFocus?.(event);
      },
      onMouseenter: (event: MouseEvent) => {
        hovered.value = true;
        userEnter?.(event);
      },
      onMouseleave: (event: MouseEvent) => {
        hovered.value = false;
        userLeave?.(event);
      },
      "aria-label":
        (split.value.inheritedAttrs["aria-label"] as string | undefined) ??
        resolveMessage("Carousel"),
      class: cn({
        [get(sizeItem.value, "root") ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
      onBlur: (event: FocusEvent) => {
        const next = event.relatedTarget;
        const current = event.currentTarget;

        if (
          !(next instanceof Node) ||
          !(current instanceof Node) ||
          !current.contains(next)
        ) {
          focused.value = false;
        }

        userBlur?.(event);
      },
      onKeydown: (event: KeyboardEvent) => {
        if (!isEditableTarget(event.target)) {
          if (event.key === nextKey.value) {
            event.preventDefault();
            go(1);
          } else if (event.key === prevKey.value) {
            event.preventDefault();
            go(-1);
          } else if (event.key === "Home") {
            event.preventDefault();
            selectIndex(0);
          } else if (event.key === "End") {
            event.preventDefault();
            selectIndex(
              getCarouselMaxIndex(
                slideIds.value.length,
                merged.value.slidesPerView,
              ),
            );
          }
        }

        userKeydown?.(event);
      },
    });
  });

  const viewportBind = computed(() => {
    const viewport = merged.value.customProps?.viewport;
    const userUp = asListener(viewport?.onPointerup);
    const userDown = asListener(viewport?.onPointerdown);
    const userCancel = asListener(viewport?.onPointercancel);

    return mergePartBind(
      omit(viewport, [...viewportEventKeys]),
      {},
      {
        "data-part": "viewport",
        onPointercancel: (event: PointerEvent) => {
          swipeStart.value = null;
          userCancel?.(event);
        },
        class: cn({
          [get(sizeItem.value, "viewport") ?? ""]: true,
          [get(mergedClasses.value, "viewport") ?? ""]: true,
          [get(sizeItem.value, "viewportVertical") ?? ""]: vertical.value,
        }),
        onPointerdown: (event: PointerEvent) => {
          if (!(event.pointerType === "mouse" && event.button !== 0)) {
            swipeStart.value = {
              x: event.clientX,
              y: event.clientY,
              pointerId: event.pointerId,
            };
          }

          userDown?.(event);
        },
        onPointerup: (event: PointerEvent) => {
          const start = swipeStart.value;

          swipeStart.value = null;

          if (start && start.pointerId === event.pointerId) {
            const direction = resolveCarouselSwipeDirection(
              event.clientX - start.x,
              event.clientY - start.y,
              {
                rtl: rtl.value,
                orientation: merged.value.orientation,
              },
            );

            if (direction) {
              go(direction);
            }
          }

          userUp?.(event);
        },
      },
    );
  });

  const trackBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.track,
      {},
      {
        "data-part": "track",
        class: cn({
          [get(sizeItem.value, "track") ?? ""]: true,
          [get(mergedClasses.value, "track") ?? ""]: true,
          [get(sizeItem.value, "trackVertical") ?? ""]: vertical.value,
        }),
        style: getCarouselTrackStyle(activeIndex.value, {
          rtl: rtl.value,
          gap: merged.value.gap,
          count: slideIds.value.length,
          orientation: merged.value.orientation,
          slidesPerView: merged.value.slidesPerView,
        }),
      },
    );
  });

  const controlsBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.controls,
      {},
      {
        "data-part": "controls",
        class: cn({
          [get(sizeItem.value, "controls") ?? ""]: true,
          [get(mergedClasses.value, "controls") ?? ""]: true,
          [get(sizeItem.value, "controlsVertical") ?? ""]: vertical.value,
        }),
      },
    );
  });

  const frameClassName = computed(() => {
    if (!showControls.value) {
      return "relative";
    }

    return vertical.value
      ? (get(sizeItem.value, "frameVertical") ?? "relative")
      : (get(sizeItem.value, "frame") ?? "relative");
  });

  const prevBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.prev,
      {},
      {
        "data-part": "prev",
        type: "button" as const,
        disabled: prevDisabled.value,
        onClick: () => {
          go(-1);
        },
        "aria-label": resolveMessage("Previous slide"),
        class: cn({
          [get(sizeItem.value, "control") ?? ""]: true,
          [get(mergedClasses.value, "prev") ?? ""]: true,
          [get(mergedClasses.value, "control") ?? ""]: true,
        }),
      },
    );
  });

  const nextBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.next,
      {},
      {
        "data-part": "next",
        type: "button" as const,
        disabled: nextDisabled.value,
        "aria-label": resolveMessage("Next slide"),
        onClick: () => {
          go(1);
        },
        class: cn({
          [get(sizeItem.value, "control") ?? ""]: true,
          [get(mergedClasses.value, "next") ?? ""]: true,
          [get(mergedClasses.value, "control") ?? ""]: true,
        }),
      },
    );
  });

  const prevIconBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.prevIcon,
      {},
      {
        "aria-hidden": true,
        size: iconSize.value,
        class: vertical.value ? undefined : "rtl:rotate-180",
      },
    );
  });

  const nextIconBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.nextIcon,
      {},
      {
        "aria-hidden": true,
        size: iconSize.value,
        class: vertical.value ? undefined : "rtl:rotate-180",
      },
    );
  });

  const indicatorsBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.indicators,
      {},
      {
        role: "group",
        "data-part": "indicators",
        "aria-label": resolveMessage("Slides"),
        class: cn({
          [get(sizeItem.value, "indicators") ?? ""]: true,
          [get(mergedClasses.value, "indicators") ?? ""]: true,
        }),
      },
    );
  });

  const liveBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.live,
      {},
      {
        "aria-atomic": true,
        "data-part": "live",
        "aria-live": "polite" as const,
        class: cn({
          [get(sizeItem.value, "live") ?? ""]: true,
          [get(mergedClasses.value, "live") ?? ""]: true,
        }),
      },
    );
  });

  function getIndicatorBind(index: number) {
    const selected = index === activeIndex.value;

    return mergePartBind(
      merged.value.customProps?.indicator,
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
        class: cn({
          [get(sizeItem.value, "indicator") ?? ""]: true,
          [get(sizeItem.value, "indicatorSelected") ?? ""]: selected,
          [get(mergedClasses.value, "indicator") ?? ""]: true,
        }),
      },
    );
  }

  const prevIcon = computed(() => {
    return vertical.value ? "chevronUp" : "chevronLeft";
  });

  const nextIcon = computed(() => {
    return vertical.value ? "chevronDown" : "chevronRight";
  });

  return {
    go,
    liveBind,
    nextBind,
    nextIcon,
    prevBind,
    prevIcon,
    rootBind,
    trackBind,
    activeIndex,
    controlsBind,
    nextIconBind,
    prevIconBind,
    showControls,
    viewportBind,
    announcement,
    frameClassName,
    indicatorsBind,
    showIndicators,
    getIndicatorBind,
    indicatorIndexes,
  };
}
