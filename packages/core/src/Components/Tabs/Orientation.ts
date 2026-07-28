/**
 * Per-orientation layout classes for tabs root, list, tab indicator, and panel.
 */
export interface TabsOrientationItem {
  /**
   * Classes for the tab list container.
   */
  "list": string;

  /**
   * Classes for the panel region (spacing relative to the list).
   */
  "panel": string;

  /**
   * Classes for the tabs root (list + panels layout).
   */
  "root": string;

  /**
   * Extra classes for each tab trigger (indicator side for vertical).
   */
  "tab": string;
}

/**
 * Orientation of the tab list.
 */
export interface TabsOrientation {
  /**
   * Horizontal tab list (row).
   */
  "horizontal": TabsOrientationItem;

  /**
   * Vertical tab list (column) beside panels.
   */
  "vertical": TabsOrientationItem;
}

/**
 * Layout classes for the tab list / root / panel by orientation.
 */
export const orientationProps: TabsOrientation = {
  "horizontal": {
    "tab": "",
    "root": "",
    "panel": "",
    "list": "flex-row flex-wrap",
  },
  "vertical": {
    "panel": "flex-1 min-w-0 !pt-0 pl-0",
    "root": "flex flex-row items-start gap-4",
    "list":
      "flex-col shrink-0 border-b-0 border-r border-dark-200 dark:border-dark-700 divide-x-0 divide-y divide-dark-200 dark:divide-dark-700",
    "tab":
      "flex-none -mb-0 -mr-px after:inset-x-auto after:inset-y-0 after:left-auto after:right-0 after:-bottom-auto after:h-auto after:w-0.5 rounded-t-none rounded-l-md rounded-r-none",
  },
};
