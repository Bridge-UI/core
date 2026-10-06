/**
 * Per-orientation classes for the resizable group, its panels, and handles.
 */
export interface ResizableOrientationItem {
  /**
   * Classes for the visible grip inside a handle.
   */
  "grip": string;

  /**
   * Classes for each handle.
   */
  "handle": string;

  /**
   * Classes added to a disabled handle.
   */
  "handleDisabled": string;

  /**
   * Classes for each panel.
   */
  "panel": string;

  /**
   * Classes for the group root.
   */
  "root": string;
}

/**
 * Axis the panels are laid out on.
 */
export interface ResizableOrientation {
  /**
   * Panels side by side, resized with vertical handles.
   */
  "horizontal": ResizableOrientationItem;

  /**
   * Panels stacked, resized with horizontal handles.
   */
  "vertical": ResizableOrientationItem;
}

/**
 * Layout classes for the group by orientation.
 */
export const orientationProps: ResizableOrientation = {
  "horizontal": {
    "handleDisabled": "cursor-default",
    "root": "flex h-full w-full flex-row",
    "panel": "relative min-w-0 overflow-hidden",
    "grip": "h-6 w-1.5 shrink-0 rounded-full bg-dark-300 dark:bg-dark-500",
    "handle":
      "relative z-10 flex w-px shrink-0 cursor-col-resize touch-none select-none items-center justify-center bg-dark-200 outline-none transition-colors after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2 focus-visible:bg-dark-500 focus-visible:ring-1 focus-visible:ring-dark-500 dark:bg-dark-600 dark:focus-visible:bg-dark-300 dark:focus-visible:ring-dark-300",
  },
  "vertical": {
    "handleDisabled": "cursor-default",
    "root": "flex h-full w-full flex-col",
    "panel": "relative min-h-0 overflow-hidden",
    "grip": "h-1.5 w-6 shrink-0 rounded-full bg-dark-300 dark:bg-dark-500",
    "handle":
      "relative z-10 flex h-px w-full shrink-0 cursor-row-resize touch-none select-none items-center justify-center bg-dark-200 outline-none transition-colors after:absolute after:inset-x-0 after:top-1/2 after:h-2 after:-translate-y-1/2 focus-visible:bg-dark-500 focus-visible:ring-1 focus-visible:ring-dark-500 dark:bg-dark-600 dark:focus-visible:bg-dark-300 dark:focus-visible:ring-dark-300",
  },
};
