/**
 * Per-variant structural classes for the track and segment triggers.
 * Inactive text uses `dark-*`; selected accents come from color tokens.
 */
export interface ToggleGroupVariantItem {
  /**
   * Classes for each segment trigger (unselected base).
   */
  "item": string;

  /**
   * Extra structural classes for the selected segment (combine with color).
   */
  "itemSelected": string;

  /**
   * Classes for the track container.
   */
  "root": string;
}

/**
 * ToggleGroup visual variants.
 */
export interface ToggleGroupVariant {
  /**
   * Selected segment uses a border/ring accent without soft fill.
   */
  "outline": ToggleGroupVariantItem;

  /**
   * Soft filled selected segment inside the track (default).
   */
  "solid": ToggleGroupVariantItem;
}

/**
 * Default toggle group variant class maps.
 */
export const variantProps: ToggleGroupVariant = {
  "solid": {
    "itemSelected": "",
    "root":
      "inline-flex w-fit items-center border border-dark-200 bg-white dark:border-dark-700 dark:bg-dark-900",
    "item":
      "text-dark-600 aria-[checked=false]:hover:text-dark-800 aria-[checked=false]:hover:bg-dark-500/10 dark:text-dark-400 dark:aria-[checked=false]:hover:text-dark-200 dark:aria-[checked=false]:hover:bg-dark-500/15",
  },
  "outline": {
    "itemSelected": "ring-1 ring-inset ring-current",
    "root":
      "inline-flex w-fit items-center border border-dark-200 bg-white dark:border-dark-700 dark:bg-dark-900",
    "item":
      "text-dark-600 aria-[checked=false]:hover:text-dark-800 aria-[checked=false]:hover:bg-dark-500/10 dark:text-dark-400 dark:aria-[checked=false]:hover:text-dark-200 dark:aria-[checked=false]:hover:bg-dark-500/15",
  },
};
