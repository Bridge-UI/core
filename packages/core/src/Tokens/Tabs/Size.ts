/**
 * Per-token sizing for tabs list, tab triggers, icons, and panels.
 */
export interface TabsSizeItem {
  /**
   * Gap between icon and label inside a tab.
   */
  "gap": string;

  /**
   * Icon size token for `Icon` (`size` prop).
   */
  "icon": string;

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
    "list": "",
    "icon": "md",
    "gap": "gap-2",
    "panel": "pt-4 text-sm",
    "tab": "px-3 py-1.5 text-sm font-medium",
  },
  "sm": {
    "list": "",
    "icon": "sm",
    "gap": "gap-1.5",
    "panel": "pt-3 text-sm",
    "tab": "px-2.5 py-1 text-xs font-medium",
  },
  "lg": {
    "list": "",
    "icon": "lg",
    "gap": "gap-2.5",
    "panel": "pt-5 text-base",
    "tab": "px-4 py-2 text-base font-medium",
  },
};
