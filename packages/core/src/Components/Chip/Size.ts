/**
 * Per-token sizing for Chip root, label, and dismiss icon.
 */
export interface ChipSizeItem {
  /**
   * Icon size token for the dismiss control (`Icon` `size`).
   */
  "clear": string;

  /**
   * Typography for the chip label.
   */
  "label": string;

  /**
   * Padding, gap, and radius on the chip root.
   */
  "root": string;
}

/**
 * Chip size scale aligned with `FormField` / `Select` (`2xs` … `2xl`).
 */
export interface ChipSize {
  /**
   * Extra extra large size token.
   */
  "2xl": ChipSizeItem;

  /**
   * Extra extra small size token.
   */
  "2xs": ChipSizeItem;

  /**
   * Large size token.
   */
  "lg": ChipSizeItem;

  /**
   * Medium size token (default).
   */
  "md": ChipSizeItem;

  /**
   * Small size token.
   */
  "sm": ChipSizeItem;

  /**
   * Extra large size token.
   */
  "xl": ChipSizeItem;

  /**
   * Extra small size token.
   */
  "xs": ChipSizeItem;
}

export const sizeProps: ChipSize = {
  "xs": {
    "clear": "xs",
    "label": "text-xs",
    "root": "gap-0.5 rounded px-1.5 py-0",
  },
  "2xs": {
    "clear": "2xs",
    "label": "text-2xs",
    "root": "gap-0.5 rounded px-1 py-0",
  },
  "md": {
    "clear": "md",
    "label": "text-sm",
    "root": "gap-1 rounded-md px-2 py-0.5",
  },
  "2xl": {
    "clear": "lg",
    "label": "text-lg",
    "root": "gap-1.5 rounded-md px-3 py-1",
  },
  "lg": {
    "clear": "md",
    "label": "text-sm",
    "root": "gap-1 rounded-md px-2.5 py-0.5",
  },
  "xl": {
    "clear": "lg",
    "label": "text-base",
    "root": "gap-1 rounded-md px-2.5 py-1",
  },
  "sm": {
    "clear": "sm",
    "label": "text-xs",
    "root": "gap-0.5 rounded-md px-1.5 py-0.5",
  },
};
