// ** External Imports
import type { HTMLAttributes } from "react";
import { createContext, useContext } from "react";

// ** Core Imports
import type { CarouselSizeItem } from "@bridge-ui/core/Tokens";

/**
 * Shared carousel state for `CarouselSlide` children.
 */
export type CarouselContextValue = {
  /**
   * Controlled / uncontrolled 0-based active index.
   */
  activeIndex: number;

  /**
   * Stable id prefix for slide elements.
   */
  id: string;

  /**
   * Size class map.
   */
  sizeItem: undefined | CarouselSizeItem;

  /**
   * Classes from the carousel `classes.slide` part.
   */
  slideClassName: string;

  /**
   * Number of registered slides. `0` until slides render.
   */
  slideCount: number;

  /**
   * Props forwarded from `customProps.slide`.
   */
  slidePartProps: undefined | HTMLAttributes<HTMLDivElement>;

  /**
   * How many slides fit in the viewport.
   */
  slidesPerView: number;

  /**
   * Inline size for each slide (basis and gap padding).
   */
  slideStyle: Record<string, string>;

  /**
   * Allocates the next 0-based index during render.
   */
  takeIndex: () => number;
};

export const CarouselContext = createContext<null | CarouselContextValue>(null);

/**
 * Reads the nearest `Carousel` context. Throws when used outside `Carousel`.
 */
export function useCarouselContext(): CarouselContextValue {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("CarouselSlide must be used within a Carousel provider");
  }

  return context;
}
