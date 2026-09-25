// ** External Imports
import type { ComputedRef, HTMLAttributes, InjectionKey } from "vue";

// ** Core Imports
import type { CarouselAlign } from "@bridge-ui/core/Domain";
import type { CarouselSizeItem } from "@bridge-ui/core/Tokens";

/**
 * Shared carousel state for `CarouselSlide` descendants.
 */
export type CarouselContextValue = {
  /**
   * Bound 0-based active index.
   */
  activeIndex: number;

  /**
   * Snap alignment used to decide which slides are in view.
   */
  align: CarouselAlign;

  /**
   * Resolves a registered slide's 0-based index.
   */
  getIndex: (id: string) => number;

  /**
   * Stable id prefix for slide elements.
   */
  id: string;

  /**
   * Registers a slide id and returns unregister.
   */
  registerSlide: (id: string) => () => void;

  /**
   * Size class map.
   */
  sizeItem: undefined | CarouselSizeItem;

  /**
   * Classes from the carousel `classes.slide` part.
   */
  slideClassName: string;

  /**
   * Number of registered slides.
   */
  slideCount: number;

  /**
   * Props forwarded from `customProps.slide`.
   */
  slidePartProps: undefined | HTMLAttributes;

  /**
   * How many slides fit in the viewport.
   */
  slidesPerView: number;

  /**
   * Inline size for each slide (basis and gap padding).
   */
  slideStyle: Record<string, string>;
};

export const CAROUSEL_INJECTION_KEY = Symbol("bridge-carousel") as InjectionKey<
  ComputedRef<CarouselContextValue>
>;
