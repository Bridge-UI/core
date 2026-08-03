/**
 * Per-token sizing for Tooltip content padding and typography.
 */
export interface TooltipSizeItem {
  /**
   * Typography and padding for the tooltip content.
   */
  "content": string;
}

/**
 * Tooltip size scale (`xs` … `lg`).
 */
export interface TooltipSize {
  /**
   * Large size token.
   */
  "lg": TooltipSizeItem;

  /**
   * Medium size token (default).
   */
  "md": TooltipSizeItem;

  /**
   * Small size token.
   */
  "sm": TooltipSizeItem;

  /**
   * Extra small size token.
   */
  "xs": TooltipSizeItem;
}

export const sizeProps: TooltipSize = {
  "sm": {
    "content": "px-2 py-0.5 text-xs",
  },
  "md": {
    "content": "px-2.5 py-1 text-sm",
  },
  "lg": {
    "content": "px-3 py-1.5 text-base",
  },
  "xs": {
    "content": "px-1.5 py-0.5 text-2xs",
  },
};
