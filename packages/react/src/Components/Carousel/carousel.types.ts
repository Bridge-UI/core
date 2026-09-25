// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  CarouselAlign,
  CarouselOrientation,
} from "@bridge-ui/core/Domain";
import type { CarouselSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface CarouselSizeOverrides {}

export interface CarouselCallbacks {
  /**
   * Called when the active slide changes.
   *
   * @default undefined
   */
  onIndexChange?: (index: number) => void;
}

export interface CarouselClasses {
  /**
   * Classes merged onto previous/next buttons.
   */
  control?: string;

  /**
   * Classes merged onto the previous/next overlay.
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
   * Props forwarded to the previous/next overlay.
   *
   * @default undefined
   */
  controls?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to each indicator button.
   *
   * @default undefined
   */
  indicator?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the indicator group.
   *
   * @default undefined
   */
  indicators?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the live region.
   *
   * @default undefined
   */
  live?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the next button.
   *
   * @default undefined
   */
  next?: ButtonHTMLAttributes<HTMLButtonElement>;

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
  prev?: ButtonHTMLAttributes<HTMLButtonElement>;

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
  root?: HTMLAttributes<HTMLElement>;

  /**
   * Props forwarded to each `CarouselSlide`.
   *
   * @default undefined
   */
  slide?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the track.
   *
   * @default undefined
   */
  track?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the viewport.
   *
   * @default undefined
   */
  viewport?: HTMLAttributes<HTMLDivElement>;
}

/**
 * State passed to the indicator slot.
 */
export interface CarouselIndicatorState {
  /**
   * 0-based slide index.
   */
  index: number;

  /**
   * Whether this indicator is the active slide.
   */
  selected: boolean;
}

/**
 * Slideshow region. Compose with `CarouselSlide`.
 */
export interface CarouselOwnProps {
  /**
   * Where the active slide sits in the viewport.
   *
   * @default "start"
   */
  align?: CarouselAlign;

  /**
   * Auto-advance. `true` uses a 5s interval; a number is the interval in ms.
   *
   * @default false
   */
  autoPlay?: number | boolean;

  /**
   * Slide elements (`CarouselSlide`).
   *
   * @default undefined
   */
  children?: ReactNode;

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
   * Controlled active slide (0-based).
   *
   * @default undefined
   */
  index?: number;

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

  /**
   * Custom previous, next, and indicator content.
   *
   * @default undefined
   */
  slots?: CarouselSlots;
}

export interface CarouselSlots {
  /**
   * Custom indicator content. The button chrome stays in place.
   */
  indicator?: (state: CarouselIndicatorState) => ReactNode;

  /**
   * Custom next control content (default chevron icon).
   */
  next?: ReactNode;

  /**
   * Custom previous control content (default chevron icon).
   */
  prev?: ReactNode;
}

export type CarouselProps = MergeHtmlProps<
  CarouselOwnProps & CarouselCallbacks,
  HTMLAttributes<HTMLElement>
>;
