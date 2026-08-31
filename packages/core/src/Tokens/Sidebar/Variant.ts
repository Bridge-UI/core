/**
 * Per-variant chrome for the gap, fixed panel, and main inset.
 */
export interface SidebarVariantItem {
  /**
   * Classes for the in-flow gap spacer.
   */
  "gap": string;

  /**
   * Classes for `SidebarInset` (main content).
   */
  "inset": string;

  /**
   * Classes for the inner panel surface.
   */
  "panel": string;
}

/**
 * Sidebar visual layout: flush rail (`sidebar`) or padded main (`inset`).
 */
export interface SidebarVariant {
  /**
   * Main content is inset with margin and rounding.
   */
  "inset": SidebarVariantItem;

  /**
   * Flush rail that shares an edge with the main column. Default.
   */
  "sidebar": SidebarVariantItem;
}

/**
 * Default sidebar variant class maps.
 */
export const variantProps: SidebarVariant = {
  "sidebar": {
    "inset":
      "relative flex min-h-svh min-w-0 flex-1 flex-col bg-white dark:bg-dark-900",
    "gap":
      "relative hidden w-[var(--bridge-sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear md:block",
    "panel":
      "border-dark-200 bg-white data-[side=left]:border-e data-[side=right]:border-s dark:border-dark-700 dark:bg-dark-800",
  },
  "inset": {
    "panel": "bg-white p-2 dark:bg-dark-800",
    "inset":
      "relative m-2 flex min-h-svh min-w-0 flex-1 flex-col rounded-xl bg-white shadow-sm dark:bg-dark-900",
    "gap":
      "relative hidden w-[var(--bridge-sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear md:block group-data-[collapsible=icon]:w-[calc(var(--bridge-sidebar-width-icon)+1rem)]",
  },
};
