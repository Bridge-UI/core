/**
 * Drawer edge placement → wrapper flex alignment classes.
 */
export interface DrawerPlacement {
  /**
   * Dock the panel to the bottom edge.
   */
  "bottom": string;

  /**
   * Dock the panel to the left edge.
   */
  "left": string;

  /**
   * Dock the panel to the right edge.
   */
  "right": string;

  /**
   * Dock the panel to the top edge.
   */
  "top": string;
}

/**
 * Flex alignment for the drawer wrapper by placement.
 */
export const placementProps: DrawerPlacement = {
  "top": "items-start justify-stretch",
  "right": "items-stretch justify-end",
  "left": "items-stretch justify-start",
  "bottom": "items-end justify-stretch",
};

/**
 * Panel axis classes (full cross-axis) by placement.
 */
export const placementPanelProps: DrawerPlacement = {
  "left": "h-dvh max-h-dvh",
  "right": "h-dvh max-h-dvh",
  "top": "w-full max-w-full",
  "bottom": "w-full max-w-full",
};
