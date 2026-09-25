// ** External Imports
import { clamp, floor } from "es-toolkit/compat";

/**
 * How the active slide sits in the viewport.
 */
export type CarouselAlign = "end" | "start" | "center";

/**
 * Axis the track scrolls on.
 */
export type CarouselOrientation = "vertical" | "horizontal";

/**
 * Inputs for the track `transform`.
 */
export type CarouselTrackOffsetOptions = {
  /**
   * Snap alignment. `start` lines the active slide up with the viewport start.
   */
  align?: CarouselAlign;

  /**
   * Scroll axis.
   */
  orientation?: CarouselOrientation;

  /**
   * Flip the horizontal axis for right-to-left.
   */
  rtl?: boolean;

  /**
   * How many slides fit in the viewport. Values above `1` reveal neighbors.
   */
  slidesPerView?: number;
};

/**
 * Pointer-gesture options. A number is treated as `threshold`.
 */
export type CarouselSwipeOptions = {
  /**
   * Scroll axis. Vertical carousels use the Y delta.
   */
  orientation?: CarouselOrientation;

  /**
   * Flip a horizontal swipe for right-to-left.
   */
  rtl?: boolean;

  /**
   * Minimum travel (px) before the gesture changes slides.
   */
  threshold?: number;
};

/** Minimum travel (px) before a pointer gesture changes slides. */
export const CAROUSEL_SWIPE_THRESHOLD_PX = 40;

/** Interval (ms) used when `autoPlay` is `true`. */
export const DEFAULT_CAROUSEL_AUTOPLAY_INTERVAL = 5000;

/**
 * Inputs that pause auto-advance.
 */
export type ShouldPauseCarouselAutoPlayOptions = {
  /**
   * Focus is inside the carousel.
   */
  focused: boolean;

  /**
   * Pointer is over the carousel.
   */
  hovered: boolean;

  /**
   * User prefers reduced motion.
   */
  reducedMotion: boolean;
};

/**
 * Clamps a 0-based slide index into range. An empty carousel stays at `0`.
 */
export function clampCarouselIndex(index: number, count: number): number {
  if (count <= 0) {
    return 0;
  }

  const normalized = Number.isFinite(index) ? floor(index) : 0;

  return clamp(normalized, 0, count - 1);
}

/**
 * Gap in px. Invalid and negative values become `0`.
 */
export function resolveCarouselGap(gap: number | undefined): number {
  if (typeof gap !== "number" || !Number.isFinite(gap) || gap <= 0) {
    return 0;
  }

  return gap;
}

/**
 * Normalizes how many slides fit in the viewport. Invalid values become `1`.
 */
export function resolveCarouselSlidesPerView(
  slidesPerView: number | undefined,
): number {
  if (
    typeof slidesPerView !== "number" ||
    !Number.isFinite(slidesPerView) ||
    slidesPerView < 1
  ) {
    return 1;
  }

  return slidesPerView;
}

/**
 * Last 0-based snap index.
 * `start` stops once the remaining slides fill the viewport.
 * `center` and `end` can snap every slide.
 */
export function getCarouselMaxIndex(
  count: number,
  slidesPerView?: number,
  align?: CarouselAlign,
): number {
  if (count <= 0) {
    return 0;
  }

  const visible = Math.min(resolveCarouselSlidesPerView(slidesPerView), count);

  if (align === "center" || align === "end") {
    return count - 1;
  }

  return Math.max(0, Math.ceil(count - visible - 1e-9));
}

/**
 * Previous (`-1`) or next (`1`) index. With `loop`, wraps at the ends.
 * Without `loop`, stays on the current edge.
 */
export function getAdjacentCarouselIndex(
  index: number,
  count: number,
  direction: 1 | -1,
  loop: boolean,
  slidesPerView?: number,
  align?: CarouselAlign,
): number {
  if (count <= 0) {
    return 0;
  }

  const max = getCarouselMaxIndex(count, slidesPerView, align);
  const current = clamp(clampCarouselIndex(index, count), 0, max);
  const next = current + direction;

  if (loop && max > 0) {
    const span = max + 1;

    return (next + span) % span;
  }

  return clamp(next, 0, max);
}

/**
 * Whether a previous/next control can change the active slide.
 */
export function canMoveCarousel(
  index: number,
  count: number,
  direction: 1 | -1,
  loop: boolean,
  slidesPerView?: number,
  align?: CarouselAlign,
): boolean {
  const max = getCarouselMaxIndex(count, slidesPerView, align);

  if (max <= 0) {
    return false;
  }

  if (loop) {
    return true;
  }

  const current = clamp(clampCarouselIndex(index, count), 0, max);

  if (direction === -1) {
    return current > 0;
  }

  return current < max;
}

/**
 * Whether `slideIndex` overlaps the viewport for the active snap.
 */
export function isCarouselSlideInView(
  slideIndex: number,
  activeIndex: number,
  slidesPerView?: number,
  align?: CarouselAlign,
): boolean {
  const visible = resolveCarouselSlidesPerView(slidesPerView);
  const active = Number.isFinite(activeIndex) ? activeIndex : 0;
  const slide = Number.isFinite(slideIndex) ? slideIndex : 0;
  let start = active;
  let end = active + visible;

  if (align === "center") {
    const pad = (visible - 1) / 2;

    start = active - pad;
    end = active + 1 + pad;
  } else if (align === "end") {
    start = active + 1 - visible;
    end = active + 1;
  }

  return slide < end && slide + 1 > start;
}

/**
 * `transform` that brings `index` into the viewport.
 */
export function getCarouselTrackOffset(
  index: number,
  options: CarouselTrackOffsetOptions = {},
): string {
  const safe = Number.isFinite(index) ? floor(index) : 0;
  const visible = resolveCarouselSlidesPerView(options.slidesPerView);
  const slidePercent = 100 / visible;
  let shift = safe * slidePercent;

  if (options.align === "center") {
    shift -= (100 - slidePercent) / 2;
  } else if (options.align === "end") {
    shift -= 100 - slidePercent;
  }

  if (options.rtl && options.orientation !== "vertical") {
    shift = -shift;
  }

  if (options.orientation === "vertical") {
    return `translate3d(0, ${-shift}%, 0)`;
  }

  return `translate3d(${-shift}%, 0, 0)`;
}

/**
 * Inline size for one slide, including the gap padding trick.
 */
export function getCarouselSlideStyle(
  slidesPerView?: number,
  gap?: number,
  orientation?: CarouselOrientation,
): Record<string, string> {
  const visible = resolveCarouselSlidesPerView(slidesPerView);
  const space = resolveCarouselGap(gap);
  const style: Record<string, string> = {
    flexBasis: `calc(100% / ${visible})`,
  };

  if (space <= 0) {
    return style;
  }

  const padding = `${space}px`;

  if (orientation === "vertical") {
    style.paddingBlockStart = padding;
  } else {
    style.paddingInlineStart = padding;
  }

  return style;
}

/**
 * Track `transform` plus the negative margin that cancels slide gap padding.
 */
export function getCarouselTrackStyle(
  index: number,
  options: CarouselTrackOffsetOptions & { gap?: number } = {},
): Record<string, string> {
  const style: Record<string, string> = {
    transform: getCarouselTrackOffset(index, options),
  };
  const space = resolveCarouselGap(options.gap);

  if (space <= 0) {
    return style;
  }

  const margin = `-${space}px`;

  if (options.orientation === "vertical") {
    style.marginBlockStart = margin;
  } else {
    style.marginInlineStart = margin;
  }

  return style;
}

/**
 * Stable DOM id for a slide.
 */
export function getCarouselSlideId(carouselId: string, index: number): string {
  return `${carouselId}-slide-${index}`;
}

/**
 * Resolves `autoPlay` to an interval in ms, or `null` when auto-advance is off.
 */
export function resolveCarouselAutoPlayInterval(
  autoPlay: number | boolean | undefined,
): null | number {
  if (autoPlay === true) {
    return DEFAULT_CAROUSEL_AUTOPLAY_INTERVAL;
  }

  if (
    typeof autoPlay === "number" &&
    Number.isFinite(autoPlay) &&
    autoPlay > 0
  ) {
    return autoPlay;
  }

  return null;
}

/**
 * Maps a pointer delta to a slide direction. `1` is next, `-1` is previous.
 * The cross-axis and short moves return `null`.
 */
export function resolveCarouselSwipeDirection(
  deltaX: number,
  deltaY: number,
  threshold: number | CarouselSwipeOptions = CAROUSEL_SWIPE_THRESHOLD_PX,
): 1 | -1 | null {
  const options: CarouselSwipeOptions =
    typeof threshold === "number" ? { threshold } : threshold;
  const limit = options.threshold ?? CAROUSEL_SWIPE_THRESHOLD_PX;

  if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) {
    return null;
  }

  if (options.orientation === "vertical") {
    if (Math.abs(deltaY) < limit || Math.abs(deltaY) <= Math.abs(deltaX)) {
      return null;
    }

    return deltaY < 0 ? 1 : -1;
  }

  if (Math.abs(deltaX) < limit || Math.abs(deltaX) <= Math.abs(deltaY)) {
    return null;
  }

  const next = deltaX < 0 ? 1 : -1;

  if (options.rtl) {
    return next === 1 ? -1 : 1;
  }

  return next;
}

/**
 * Auto-advance pauses while hovered, focused, or when reduced motion is set.
 */
export function shouldPauseCarouselAutoPlay(
  options: ShouldPauseCarouselAutoPlayOptions,
): boolean {
  return options.focused || options.hovered || options.reducedMotion;
}
