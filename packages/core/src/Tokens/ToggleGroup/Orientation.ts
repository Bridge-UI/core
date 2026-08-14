/**
 * Per-orientation layout classes for the toggle group track.
 */
export interface ToggleGroupOrientationItem {
  /**
   * Classes for each segment (flex grow when `full`).
   */
  "item": string;

  /**
   * Classes for the track root (flex direction).
   */
  "root": string;
}

/**
 * Orientation of the toggle group track.
 */
export interface ToggleGroupOrientation {
  /**
   * Horizontal track (row).
   */
  "horizontal": ToggleGroupOrientationItem;

  /**
   * Vertical track (column).
   */
  "vertical": ToggleGroupOrientationItem;
}

/**
 * Layout classes for the track by orientation.
 */
export const orientationProps: ToggleGroupOrientation = {
  "horizontal": {
    "item": "",
    "root": "flex-row",
  },
  "vertical": {
    "root": "flex-col",
    "item": "w-full justify-start",
  },
};
