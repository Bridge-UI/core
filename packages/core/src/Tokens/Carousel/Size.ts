/**
 * Per-token sizing for carousel viewport, slides, controls, and indicators.
 */
export interface CarouselSizeItem {
  /**
   * Classes for previous/next buttons.
   */
  "control": string;

  /**
   * Classes for the previous and next control group.
   */
  "controls": string;

  /**
   * Classes added to the control group when `orientation` is `vertical`.
   */
  "controlsVertical": string;

  /**
   * Classes for the frame around the viewport. Reserves a side gutter for the controls.
   */
  "frame": string;

  /**
   * Classes for the frame when `orientation` is `vertical`.
   */
  "frameVertical": string;

  /**
   * Icon size token for previous/next `Icon` (`size` prop).
   */
  "icon": string;

  /**
   * Classes for an indicator button.
   */
  "indicator": string;

  /**
   * Classes for the indicator group.
   */
  "indicators": string;

  /**
   * Classes added to the active indicator.
   */
  "indicatorSelected": string;

  /**
   * Classes for the live region.
   */
  "live": string;

  /**
   * Classes for the region root.
   */
  "root": string;

  /**
   * Classes for each slide.
   */
  "slide": string;

  /**
   * Classes for the sliding track.
   */
  "track": string;

  /**
   * Classes added to the track when `orientation` is `vertical`.
   */
  "trackVertical": string;

  /**
   * Classes for the clipping viewport.
   */
  "viewport": string;

  /**
   * Classes added to the viewport when `orientation` is `vertical`.
   */
  "viewportVertical": string;
}

/**
 * Carousel size scale.
 */
export interface CarouselSize {
  /**
   * Large size token.
   */
  "lg": CarouselSizeItem;

  /**
   * Medium size token (default).
   */
  "md": CarouselSizeItem;

  /**
   * Small size token.
   */
  "sm": CarouselSizeItem;
}

/**
 * Default carousel size classes.
 */
export const sizeProps: CarouselSize = {
  "md": {
    "icon": "sm",
    "live": "sr-only",
    "frame": "relative px-14",
    "viewportVertical": "h-64",
    "controlsVertical": "flex-col",
    "frameVertical": "relative py-14",
    "trackVertical": "h-full flex-col",
    "root": "relative flex w-full flex-col gap-3",
    "slide": "min-w-0 shrink-0 grow-0 basis-full",
    "viewport": "relative w-full overflow-hidden",
    "indicators": "flex items-center justify-center gap-2",
    "indicatorSelected":
      "bg-dark-800 hover:bg-dark-800 dark:bg-white dark:hover:bg-white",
    "controls":
      "pointer-events-none absolute inset-0 z-10 flex items-center justify-between",
    "track":
      "flex w-full transition-transform duration-300 ease-out motion-reduce:transition-none",
    "indicator":
      "inline-flex shrink-0 rounded-full bg-dark-300 p-0 transition-colors cursor-pointer hover:bg-dark-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-dark-600 dark:hover:bg-dark-500 h-2 w-2",
    "control":
      "pointer-events-auto inline-flex shrink-0 items-center justify-center rounded-full border border-dark-200 bg-white text-dark-700 shadow-sm transition-colors cursor-pointer hover:bg-dark-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-100 dark:hover:bg-dark-800 h-9 w-9",
  },
  "sm": {
    "icon": "xs",
    "live": "sr-only",
    "frame": "relative px-12",
    "viewportVertical": "h-48",
    "controlsVertical": "flex-col",
    "frameVertical": "relative py-12",
    "trackVertical": "h-full flex-col",
    "root": "relative flex w-full flex-col gap-2",
    "slide": "min-w-0 shrink-0 grow-0 basis-full",
    "viewport": "relative w-full overflow-hidden",
    "indicators": "flex items-center justify-center gap-1.5",
    "indicatorSelected":
      "bg-dark-800 hover:bg-dark-800 dark:bg-white dark:hover:bg-white",
    "controls":
      "pointer-events-none absolute inset-0 z-10 flex items-center justify-between",
    "track":
      "flex w-full transition-transform duration-300 ease-out motion-reduce:transition-none",
    "indicator":
      "inline-flex shrink-0 rounded-full bg-dark-300 p-0 transition-colors cursor-pointer hover:bg-dark-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-dark-600 dark:hover:bg-dark-500 h-1.5 w-1.5",
    "control":
      "pointer-events-auto inline-flex shrink-0 items-center justify-center rounded-full border border-dark-200 bg-white text-dark-700 shadow-sm transition-colors cursor-pointer hover:bg-dark-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-100 dark:hover:bg-dark-800 h-8 w-8",
  },
  "lg": {
    "icon": "md",
    "live": "sr-only",
    "frame": "relative px-16",
    "viewportVertical": "h-80",
    "controlsVertical": "flex-col",
    "frameVertical": "relative py-16",
    "trackVertical": "h-full flex-col",
    "root": "relative flex w-full flex-col gap-4",
    "slide": "min-w-0 shrink-0 grow-0 basis-full",
    "viewport": "relative w-full overflow-hidden",
    "indicators": "flex items-center justify-center gap-2.5",
    "indicatorSelected":
      "bg-dark-800 hover:bg-dark-800 dark:bg-white dark:hover:bg-white",
    "controls":
      "pointer-events-none absolute inset-0 z-10 flex items-center justify-between",
    "track":
      "flex w-full transition-transform duration-300 ease-out motion-reduce:transition-none",
    "indicator":
      "inline-flex shrink-0 rounded-full bg-dark-300 p-0 transition-colors cursor-pointer hover:bg-dark-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-dark-600 dark:hover:bg-dark-500 h-2.5 w-2.5",
    "control":
      "pointer-events-auto inline-flex shrink-0 items-center justify-center rounded-full border border-dark-200 bg-white text-dark-700 shadow-sm transition-colors cursor-pointer hover:bg-dark-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-100 dark:hover:bg-dark-800 h-10 w-10",
  },
};
