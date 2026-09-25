// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface CarouselSlideClasses {
  /**
   * Classes merged onto the slide root.
   */
  root?: string;
}

export interface CarouselSlideCustomProps {
  /**
   * Props forwarded to the slide root.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * One slide inside `Carousel`.
 */
export interface CarouselSlideOwnProps {
  /**
   * Classes for the slide.
   *
   * @default undefined
   */
  classes?: CarouselSlideClasses;

  /**
   * Extra props for the slide root.
   *
   * @default undefined
   */
  customProps?: CarouselSlideCustomProps;
}

export interface CarouselSlideSlots {
  /**
   * Slide content.
   */
  default?: Slot<undefined>;
}

export type CarouselSlideProps = MergeHtmlProps<
  CarouselSlideOwnProps,
  HTMLAttributes
>;
