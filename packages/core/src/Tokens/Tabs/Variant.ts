/**
 * Per-variant structural classes for the tab list and tab triggers.
 * Inactive text uses `dark-*`; selected text comes from color tokens.
 * Selected surface (fill, shadow, underline) lives on `tabSelected`.
 * Hover styles target unselected tabs only (`aria-selected=false`).
 * Underline uses `after:` (needs `after:content-['']`).
 */
export interface TabsVariantItem {
  /**
   * Classes for the tab list container (horizontal).
   */
  "list": string;

  /**
   * Extra list classes when orientation is vertical (side hairline, dividers).
   */
  "listVertical": string;

  /**
   * Classes for each tab trigger (unselected base).
   */
  "tab": string;

  /**
   * Extra structural classes for the selected tab (combine with color text).
   */
  "tabSelected": string;

  /**
   * Extra tab classes when orientation is vertical (indicator side).
   */
  "tabVertical": string;
}

/**
 * Tabs visual variants.
 */
export interface TabsVariant {
  /**
   * Bordered segmented control. Selected tab uses a quiet fill and a bottom accent.
   */
  "enclosed": TabsVariantItem;

  /**
   * Underline indicator on the active tab.
   */
  "line": TabsVariantItem;

  /**
   * Muted track with an elevated selected pill. Default.
   */
  "pill": TabsVariantItem;

  /**
   * Text weight and color on the selected tab; shared list border.
   */
  "plain": TabsVariantItem;

  /**
   * Quiet fill on a hairline track, with an underline on the selected tab.
   */
  "solid": TabsVariantItem;
}

/**
 * Default tabs variant class maps (horizontal track / underline).
 * Vertical chrome (`listVertical` / `tabVertical`) is composed in the hook.
 */
export const variantProps: TabsVariant = {
  "plain": {
    "tabVertical": "",
    "tabSelected": "font-semibold",
    "listVertical": "border-b-0 border-r",
    "list": "border-b border-dark-200 dark:border-dark-700 gap-6",
    "tab":
      "rounded-none text-dark-500 aria-[selected=false]:hover:text-dark-800 dark:text-dark-400 dark:aria-[selected=false]:hover:text-dark-200",
  },
  "pill": {
    "tabVertical": "",
    "listVertical": "",
    "tabSelected": "bg-white shadow-sm dark:bg-dark-900",
    "list":
      "inline-flex w-fit items-center bg-dark-100 dark:bg-dark-800 p-1 gap-1 rounded-lg",
    "tab":
      "rounded-md py-1 text-dark-500 aria-[selected=false]:hover:text-dark-700 aria-[selected=false]:hover:bg-dark-500/10 dark:text-dark-400 dark:aria-[selected=false]:hover:text-dark-200 dark:aria-[selected=false]:hover:bg-dark-500/15",
  },
  "line": {
    "tabSelected": "after:bg-current",
    "listVertical": "border-b-0 border-r",
    "list": "border-b border-dark-200 dark:border-dark-700 gap-6",
    "tabVertical":
      "after:inset-x-auto after:inset-y-0 after:left-auto after:right-0 after:-bottom-auto after:h-auto after:w-0.5 -mb-0 -mr-px",
    "tab":
      "relative rounded-none text-dark-500 aria-[selected=false]:hover:text-dark-700 dark:text-dark-400 dark:aria-[selected=false]:hover:text-dark-200 after:pointer-events-none after:absolute after:content-[''] after:rounded-none after:bg-transparent after:inset-x-0 after:-bottom-px after:h-0.5 after:w-auto -mb-px",
  },
  "solid": {
    "listVertical": "border-b-0 border-r",
    "list": "border-b border-dark-200 dark:border-dark-700 gap-1",
    "tabSelected": "after:bg-current bg-dark-100 dark:bg-dark-800",
    "tabVertical":
      "after:inset-x-auto after:inset-y-0 after:left-auto after:right-0 after:-bottom-auto after:h-auto after:w-0.5 -mb-0 -mr-px rounded-t-none rounded-l-md rounded-r-none",
    "tab":
      "relative rounded-t-md rounded-b-none text-dark-500 aria-[selected=false]:hover:text-dark-700 dark:text-dark-400 dark:aria-[selected=false]:hover:text-dark-200 after:pointer-events-none after:absolute after:content-[''] after:rounded-none after:bg-transparent after:inset-x-0 after:-bottom-px after:h-0.5 after:w-auto -mb-px",
  },
  "enclosed": {
    "listVertical": "divide-x-0 divide-y",
    "tabSelected":
      "after:bg-current bg-dark-100 font-semibold dark:bg-dark-800",
    "tabVertical":
      "after:inset-x-auto after:inset-y-0 after:left-auto after:right-0 after:bottom-auto after:h-auto after:w-0.5",
    "list":
      "gap-0 overflow-hidden rounded-lg border border-dark-200 dark:border-dark-700 divide-x divide-dark-200 dark:divide-dark-700",
    "tab":
      "relative flex-1 rounded-none text-dark-500 aria-[selected=false]:hover:text-dark-700 dark:text-dark-400 dark:aria-[selected=false]:hover:text-dark-200 after:pointer-events-none after:absolute after:content-[''] after:rounded-none after:bg-transparent after:inset-x-0 after:bottom-0 after:h-0.5 after:w-auto",
  },
};
