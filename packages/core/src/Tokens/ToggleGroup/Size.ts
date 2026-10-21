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
    "item": "h-6.5 px-3 text-sm font-medium",
  },
  "lg": {
    "icon": "md",
    "gap": "gap-2.5",
    "root": "gap-1 p-1",
    "item": "h-7.5 px-3.5 text-sm font-medium",
  },
  "sm": {
    "icon": "xs",
    "gap": "gap-1.5",
    "root": "gap-0.5 p-0.5",
    "item": "h-6.5 px-2.5 text-xs font-medium",
  },
};
