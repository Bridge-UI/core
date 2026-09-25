// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { CarouselOrientation } from "@bridge-ui/core/Domain";
import type { CarouselSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface CarouselSizeOverrides {}

export interface CarouselClasses {
  /**
   * Classes merged onto previous/next buttons.
   */
  control?: string;

  /**
   * Classes merged onto the previous and next control group.
   */
  controls?: string;

  /**
   * Classes merged onto each indicator button.
   */
  indicator?: string;

  /**
   * Classes merged onto the indicator group.
   */
  indicators?: string;

  /**
   * Classes merged onto the live region.
   */
  live?: string;

  /**
   * Classes merged onto the next button.
   */
  next?: string;

  /**
   * Classes merged onto the previous button.
   */
  prev?: string;

  /**
   * Classes merged onto the region root.
   */
  root?: string;

  /**
   * Classes merged onto each slide.
   */
  slide?: string;

  /**
   * Classes merged onto the track.
   */
  track?: string;

  /**
   * Classes merged onto the viewport.
   */
  viewport?: string;
}

export interface CarouselCustomProps {
  /**
   * Props forwarded to the previous and next control group.
   *
   * @default undefined
   */
  controls?: HTMLAttributes;

  /**
   * Props forwarded to each indicator button.
   *
   * @default undefined
   */
  indicator?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the indicator group.
   *
   * @default undefined
   */
  indicators?: HTMLAttributes;

  /**
   * Props forwarded to the live region.
   *
   * @default undefined
   */
  live?: HTMLAttributes;

  /**
   * Props forwarded to the next button.
   *
   * @default undefined
   */
  next?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the next `Icon`.
   *
   * @default undefined
   */
  nextIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the previous button.
   *
   * @default undefined
   */
  prev?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the previous `Icon`.
   *
   * @default undefined
   */
  prevIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the region root.
   *
   * @default undefined
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to each `CarouselSlide`.
   *
   * @default undefined
   */
  slide?: HTMLAttributes;

  /**
   * Props forwarded to the track.
   *
   * @default undefined
   */
  track?: HTMLAttributes;

  /**
   * Props forwarded to the viewport.
   *
   * @default undefined
   */
  viewport?: HTMLAttributes;
}

export interface CarouselEmits {
  /**
   * Emitted when the active slide changes (`v-model:index`).
   */
  "update:index": [index: number];
}

/**
 * State passed to the indicator slot.
 */
export interface CarouselIndicatorState {
  /**
   * 0-based snap index.
   */
  index: number;

  /**
   * Whether this indicator is the active snap.
   */
  selected: boolean;
}

/**
 * Slideshow region. Compose with `CarouselSlide`.
 */
export interface CarouselOwnProps {
  /**
   * Auto-advance. `true` uses a 5s interval; a number is the interval in ms.
   *
   * @default false
   */
  autoPlay?: number | boolean;

  /**
   * Classes for carousel parts.
   *
   * @default undefined
   */
  classes?: CarouselClasses;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: CarouselCustomProps;

  /**
   * Initial slide when uncontrolled.
   *
   * @default 0
   */
  defaultIndex?: number;

  /**
   * Space between slides, in px. Padding sits on the slide so the snap
   * distance stays even.
   *
   * @default 0
   */
  gap?: number;

  /**
   * Show dot indicators.
   *
   * @default true
   */
  indicators?: boolean;

  /**
   * Wrap from the last slide to the first and back.
   *
   * @default false
   */
  loop?: boolean;

  /**
   * Scroll axis. Vertical carousels use up/down keys and a vertical swipe.
   *
   * @default "horizontal"
   */
  orientation?: CarouselOrientation;

  /**
   * Control and indicator scale.
   *
   * @default "md"
   */
  size?: MergeProps<CarouselSize, CarouselSizeOverrides>;

  /**
   * How many slides fit in the viewport. `1` shows one slide. A larger
   * number, including fractions, reveals the next slide.
   *
   * @default 1
   */
  slidesPerView?: number;
}

export interface CarouselSlots {
  /**
   * Slide elements (`CarouselSlide`).
   */
  default?: Slot<undefined>;

  /**
   * Custom indicator content. The button chrome stays in place.
   */
  indicator?: Slot<CarouselIndicatorState>;

  /**
   * Custom next control content (default chevron icon).
   */
  next?: Slot<undefined>;

  /**
   * Custom previous control content (default chevron icon).
   */
  prev?: Slot<undefined>;
}

export type CarouselProps = MergeHtmlProps<CarouselOwnProps, HTMLAttributes> & {
  /**
   * Bound with `v-model:index`.
   */
  index?: number;
};
