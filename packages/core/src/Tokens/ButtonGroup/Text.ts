/**
 * Structural classes for `ButtonGroupText`.
 */
export interface ButtonGroupTextItem {
  /**
   * Classes for the text root.
   */
  "root": string;
}

/**
 * Default classes for text rendered inside a button group.
 */
export const textProps: ButtonGroupTextItem = {
  "root":
    "inline-flex items-center gap-2 whitespace-nowrap px-3 text-sm font-medium bg-dark-50 text-dark-700 dark:bg-dark-800 dark:text-dark-200",
};
