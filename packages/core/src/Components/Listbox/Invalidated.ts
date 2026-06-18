export interface ListboxInvalidated {
  /**
   * Check icon on invalid selected options.
   */
  "check": string;

  /**
   * Clear icon in the combobox trigger (rest + hover) when invalid.
   */
  "clear": string;

  /**
   * Keyboard-highlighted option row when invalid.
   */
  "highlighted": string;

  /**
   * Selected option row when invalid.
   */
  "selected": string;

  /**
   * Selected value text in a combobox trigger (single select) when invalid.
   */
  "value": string;
}

export const invalidatedProps: ListboxInvalidated = {
  "highlighted": "bg-black/5 dark:bg-white/10",
  "check": "text-error-600 dark:text-error-400",
  "value": "text-error-700 dark:text-error-300",
  "selected":
    "bg-error-50 text-error-700 dark:bg-error-950/40 dark:text-error-300",
  "clear":
    "text-gray-400 hover:text-error-600 dark:text-gray-500 dark:hover:text-error-400",
};
