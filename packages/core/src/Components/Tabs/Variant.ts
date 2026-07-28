/**
 * Per-variant structural classes for the tab list and tab triggers.
 * Inactive text uses `dark-*`; selected accents come from color tokens.
 * Hover styles target unselected tabs only (`aria-selected=false`).
 * Underline uses `after:` (needs `after:content-['']`).
 */
export interface TabsVariantItem {
  /**
   * Classes for the tab list container.
   */
  "list": string;

  /**
   * Classes for each tab trigger (unselected base).
   */
  "tab": string;

  /**
   * Extra structural classes for the selected tab (combine with color).
   */
  "tabSelected": string;
}

/**
 * Tabs visual variants.
 */
export interface TabsVariant {
  /**
   * Bordered segmented control with bottom accent.
   */
  "enclosed": TabsVariantItem;

  /**
   * Underline indicator on the active tab. Default.
   */
  "line": TabsVariantItem;

  /**
   * Soft filled pill on the active tab.
   */
  "pill": TabsVariantItem;

  /**
   * Text color only; shared list border.
   */
  "plain": TabsVariantItem;

  /**
   * Soft fill plus underline on the active tab.
   */
  "solid": TabsVariantItem;
}

/**
 * Default tabs variant class maps (horizontal track / underline).
 * Vertical overrides live on orientation tokens.
 */
export const variantProps: TabsVariant = {
  "plain": {
    "tabSelected": "",
    "list": "border-b border-dark-200 dark:border-dark-700 gap-6",
    "tab":
      "rounded-none text-dark-600 aria-[selected=false]:hover:text-dark-800 dark:text-dark-400 dark:aria-[selected=false]:hover:text-dark-200",
  },
  "pill": {
    "list": "gap-1",
    "tabSelected": "",
    "tab":
      "rounded-md text-dark-500 aria-[selected=false]:hover:text-dark-700 aria-[selected=false]:hover:bg-dark-500/10 dark:text-dark-400 dark:aria-[selected=false]:hover:text-dark-200 dark:aria-[selected=false]:hover:bg-dark-500/15",
  },
  "line": {
    "tabSelected": "after:bg-current",
    "list": "border-b border-dark-200 dark:border-dark-700 gap-6",
    "tab":
      "relative rounded-none text-dark-500 aria-[selected=false]:hover:text-dark-700 dark:text-dark-400 dark:aria-[selected=false]:hover:text-dark-200 after:pointer-events-none after:absolute after:content-[''] after:rounded-none after:bg-transparent after:inset-x-0 after:-bottom-px after:h-0.5 after:w-auto -mb-px",
  },
  "solid": {
    "tabSelected": "after:bg-current",
    "list": "border-b border-dark-200 dark:border-dark-700 gap-1",
    "tab":
      "relative rounded-t-md rounded-b-none text-dark-500 aria-[selected=false]:hover:text-dark-700 dark:text-dark-400 dark:aria-[selected=false]:hover:text-dark-200 after:pointer-events-none after:absolute after:content-[''] after:rounded-none after:bg-transparent after:inset-x-0 after:-bottom-px after:h-0.5 after:w-auto -mb-px",
  },
  "enclosed": {
    "tabSelected": "after:bg-current",
    "list":
      "gap-0 overflow-hidden rounded-lg border border-dark-200 dark:border-dark-700 divide-x divide-dark-200 dark:divide-dark-700",
    "tab":
      "relative flex-1 rounded-none text-dark-500 aria-[selected=false]:hover:text-dark-700 dark:text-dark-400 dark:aria-[selected=false]:hover:text-dark-200 after:pointer-events-none after:absolute after:content-[''] after:rounded-none after:bg-transparent after:inset-x-0 after:bottom-0 after:h-0.5 after:w-auto",
  },
};
