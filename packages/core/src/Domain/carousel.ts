// ** External Imports
import { clamp, floor, isNumber } from "es-toolkit/compat";

/**
 * Axis the track scrolls on.
 */
export type CarouselOrientation = "vertical" | "horizontal";

/**
 * Inputs for the track `transform`.
 */
export type CarouselTrackOffsetOptions = {
  /**
   * Total slides. Stops the track once the last slides fill the viewport.
   */
  count?: number;

  /**
   * Space between slides, in px.
   */
  gap?: number;

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
  if (!isNumber(gap) || !Number.isFinite(gap) || gap <= 0) {
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
    !isNumber(slidesPerView) ||
    !Number.isFinite(slidesPerView) ||
    slidesPerView < 1
  ) {
    return 1;
  }

  return slidesPerView;
}

/**
 * Last 0-based snap index. Stops once the remaining slides fill the viewport.
 */
export function getCarouselMaxIndex(
  count: number,
  slidesPerView?: number,
): number {
  if (count <= 0) {
    return 0;
  }

  const visible = Math.min(resolveCarouselSlidesPerView(slidesPerView), count);

  return Math.max(0, Math.ceil(count - visible - 1e-9));
}

/**
 * Inputs for the previous or next slide index.
 */
export type GetAdjacentCarouselIndexOptions = {
  /**
   * Number of slides.
   */
  count: number;

  /**
   * Previous (`-1`) or next (`1`).
   */
  direction: 1 | -1;

  /**
   * Active 0-based slide index.
   */
  index: number;

  /**
   * Wrap at the ends.
   */
  loop: boolean;

  /**
   * How many slides fit in the viewport.
   */
  slidesPerView?: number;
};

/**
 * Previous (`-1`) or next (`1`) index. With `loop`, wraps at the ends.
 * Without `loop`, stays on the current edge.
 */
export function getAdjacentCarouselIndex(
  options: GetAdjacentCarouselIndexOptions,
): number {
  if (options.count <= 0) {
    return 0;
  }

  const max = getCarouselMaxIndex(options.count, options.slidesPerView);
  const current = clamp(
    clampCarouselIndex(options.index, options.count),
    0,
    max,
  );
  const next = current + options.direction;

  if (options.loop && max > 0) {
    const span = max + 1;

    return (next + span) % span;
  }

  return clamp(next, 0, max);
}

/**
 * Inputs for whether a previous or next control can change the slide.
 */
export type CanMoveCarouselOptions = {
  /**
   * Number of slides.
   */
  count: number;

  /**
   * Previous (`-1`) or next (`1`).
   */
  direction: 1 | -1;

  /**
   * Active 0-based slide index.
   */
  index: number;

  /**
   * Wrap at the ends.
   */
  loop: boolean;

  /**
   * How many slides fit in the viewport.
   */
  slidesPerView?: number;
};

/**
 * Whether a previous/next control can change the active slide.
 */
export function canMoveCarousel(options: CanMoveCarouselOptions): boolean {
  const max = getCarouselMaxIndex(options.count, options.slidesPerView);

  if (max <= 0) {
    return false;
  }

  if (options.loop) {
    return true;
  }

  const current = clamp(
    clampCarouselIndex(options.index, options.count),
    0,
    max,
  );

  if (options.direction === -1) {
    return current > 0;
  }

  return current < max;
}

/**
 * Inputs for whether a slide overlaps the active viewport.
 */
export type IsCarouselSlideInViewOptions = {
  /**
   * Active 0-based snap index.
   */
  activeIndex: number;

  /**
   * 0-based index of the slide being tested.
   */
  slideIndex: number;

  /**
   * How many slides fit in the viewport.
   */
  slidesPerView?: number;
};

/**
 * Whether `slideIndex` overlaps the viewport for the active snap.
 */
export function isCarouselSlideInView(
  options: IsCarouselSlideInViewOptions,
): boolean {
  const visible = resolveCarouselSlidesPerView(options.slidesPerView);
  const active = Number.isFinite(options.activeIndex) ? options.activeIndex : 0;
  const slide = Number.isFinite(options.slideIndex) ? options.slideIndex : 0;
  const end = active + visible;

  return slide < end && slide + 1 > active;
}

function roundOffset(value: number): number {
  return Math.round(value * 1000) / 1000;
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

  const maxShift = isNumber(options.count)
    ? Math.max(0, (options.count - visible) * slidePercent)
    : Number.POSITIVE_INFINITY;

  shift = clamp(shift, 0, maxShift);

  if (options.rtl && options.orientation !== "vertical") {
    shift = -shift;
  }

  const space = resolveCarouselGap(options.gap);
  const percent = -shift;
  const pixels = space > 0 ? (percent * space) / 100 : 0;
  const axis =
    space > 0
      ? `calc(${roundOffset(percent)}% + ${roundOffset(pixels)}px)`
      : `${percent}%`;

  if (options.orientation === "vertical") {
    return `translate3d(0, ${axis}, 0)`;
  }

  return `translate3d(${axis}, 0, 0)`;
}

/**
 * Inline size for one slide. Gap is subtracted so the visible count fits.
 */
export function getCarouselSlideStyle(
  slidesPerView?: number,
  gap?: number,
  _orientation?: CarouselOrientation,
): Record<string, string> {
  const visible = resolveCarouselSlidesPerView(slidesPerView);
  const space = resolveCarouselGap(gap);
  const between = space * Math.max(visible - 1, 0);

  return {
    flexBasis:
      between > 0
        ? `calc((100% - ${between}px) / ${visible})`
        : `calc(100% / ${visible})`,
  };
}

/**
 * Track `transform` and the gap between slides.
 */
export function getCarouselTrackStyle(
  index: number,
  options: CarouselTrackOffsetOptions = {},
): Record<string, string> {
  const style: Record<string, string> = {
    transform: getCarouselTrackOffset(index, options),
  };
  const space = resolveCarouselGap(options.gap);

  if (space <= 0) {
    return style;
  }

  if (options.orientation === "vertical") {
    style.rowGap = `${space}px`;
  } else {
    style.columnGap = `${space}px`;
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

  if (isNumber(autoPlay) && Number.isFinite(autoPlay) && autoPlay > 0) {
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
  const options: CarouselSwipeOptions = isNumber(threshold)
    ? { threshold }
    : threshold;
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
