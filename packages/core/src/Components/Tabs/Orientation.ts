/**
 * Orientation of the tab list.
 */
export interface TabsOrientation {
  /**
   * Horizontal tab list (row).
   */
  "horizontal": string;

  /**
   * Vertical tab list (column).
   */
  "vertical": string;
}

/**
 * Flex direction classes for the tab list by orientation.
 */
export const orientationProps: TabsOrientation = {
  "vertical": "flex-col",
  "horizontal": "flex-row flex-wrap",
};
