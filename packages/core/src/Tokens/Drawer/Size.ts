/**
 * Per-token sizing for horizontal (`left`/`right`) and vertical (`top`/`bottom`) drawers.
 */
export interface DrawerSizeItem {
  /**
   * Width classes when `placement` is `left` or `right`.
   */
  "horizontal": string;

  /**
   * Height / max-height classes when `placement` is `top` or `bottom`.
   */
  "vertical": string;
}

/**
 * Drawer size scale (`xs` … `xl`, `full`).
 */
export interface DrawerSize {
  /**
   * Full edge size (viewport axis).
   */
  "full": DrawerSizeItem;

  /**
   * Large size token.
   */
  "lg": DrawerSizeItem;

  /**
   * Medium size token (default, ~18rem).
   */
  "md": DrawerSizeItem;

  /**
   * Small size token.
   */
  "sm": DrawerSizeItem;

  /**
   * Extra large size token.
   */
  "xl": DrawerSizeItem;

  /**
   * Extra small size token.
   */
  "xs": DrawerSizeItem;
}

/**
 * Default drawer size classes by token.
 */
export const sizeProps: DrawerSize = {
  "full": {
    "vertical": "h-dvh max-h-dvh",
    "horizontal": "w-full max-w-full",
  },
  "xs": {
    "vertical": "h-48 max-h-[min(12rem,50dvh)]",
    "horizontal": "w-64 max-w-[min(16rem,88vw)]",
  },
  "sm": {
    "vertical": "h-56 max-h-[min(14rem,55dvh)]",
    "horizontal": "w-72 max-w-[min(18rem,88vw)]",
  },
  "md": {
    "vertical": "h-64 max-h-[min(16rem,60dvh)]",
    "horizontal": "w-80 max-w-[min(20rem,88vw)]",
  },
  "lg": {
    "vertical": "h-80 max-h-[min(20rem,70dvh)]",
    "horizontal": "w-96 max-w-[min(24rem,92vw)]",
  },
  "xl": {
    "vertical": "h-96 max-h-[min(24rem,80dvh)]",
    "horizontal": "w-[28rem] max-w-[min(28rem,96vw)]",
  },
};
