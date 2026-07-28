/**
 * Per-token sizing for tabs list, tab triggers, and panels.
 */
export interface TabsSizeItem {
  /**
   * Classes for the tab list container.
   */
  "list": string;

  /**
   * Classes for the panel region.
   */
  "panel": string;

  /**
   * Classes for each tab trigger.
   */
  "tab": string;
}

/**
 * Tabs size scale.
 */
export interface TabsSize {
  /**
   * Large size token.
   */
  "lg": TabsSizeItem;

  /**
   * Medium size token (default).
   */
  "md": TabsSizeItem;

  /**
   * Small size token.
   */
  "sm": TabsSizeItem;
}

/**
 * Default tabs size classes.
 */
export const sizeProps: TabsSize = {
  "md": {
    "list": "gap-1",
    "panel": "pt-3 text-sm",
    "tab": "rounded-md px-3 py-2 text-sm",
  },
  "sm": {
    "list": "gap-0.5",
    "panel": "pt-2 text-sm",
    "tab": "rounded-md px-2 py-1 text-xs",
  },
  "lg": {
    "list": "gap-1.5",
    "panel": "pt-4 text-base",
    "tab": "rounded-md px-4 py-2.5 text-base",
  },
};
