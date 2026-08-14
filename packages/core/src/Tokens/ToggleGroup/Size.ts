/**
 * Per-token sizing for the toggle group track, segments, and icons.
 */
export interface ToggleGroupSizeItem {
  /**
   * Gap between icon and label inside a segment.
   */
  "gap": string;

  /**
   * Icon size token for `Icon` (`size` prop).
   */
  "icon": string;

  /**
   * Classes for each segment trigger.
   */
  "item": string;

  /**
   * Classes for the track root (padding / gap).
   */
  "root": string;
}

/**
 * ToggleGroup size scale.
 */
export interface ToggleGroupSize {
  /**
   * Large size token.
   */
  "lg": ToggleGroupSizeItem;

  /**
   * Medium size token (default).
   */
  "md": ToggleGroupSizeItem;

  /**
   * Small size token.
   */
  "sm": ToggleGroupSizeItem;
}

/**
 * Default toggle group size classes.
 */
export const sizeProps: ToggleGroupSize = {
  "md": {
    "icon": "sm",
    "gap": "gap-2",
    "root": "gap-1 p-1",
    "item": "px-3 py-1.5 text-sm font-medium",
  },
  "sm": {
    "icon": "xs",
    "gap": "gap-1.5",
    "root": "gap-0.5 p-0.5",
    "item": "px-2.5 py-1 text-xs font-medium",
  },
  "lg": {
    "icon": "md",
    "gap": "gap-2.5",
    "root": "gap-1.5 p-1.5",
    "item": "px-4 py-2 text-base font-medium",
  },
};
