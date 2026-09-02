/**
 * Per-orientation layout classes for tabs root, list, and panel.
 * Chrome (hairline, indicator side) lives on the variant tokens.
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
   * Extra classes for each tab trigger.
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
    "tab": "flex-none",
    "list": "flex-col shrink-0",
    "panel": "flex-1 min-w-0 !pt-0 pl-0",
    "root": "flex flex-row items-start gap-4",
  },
};
