export interface CardVariantItem {
  /**
   * Border classes for the card shell.
   */
  "border": string;

  /**
   * Footer region classes.
   */
  "footer": string;

  /**
   * Root shell classes.
   */
  "root": string;

  /**
   * Text color classes for the body and title. Empty by default, so card
   * content inherits the surrounding text color.
   */
  "text": string;
}

export interface CardVariant {
  /**
   * Elevated visual variant.
   */
  "elevated": CardVariantItem;

  /**
   * Flat visual variant.
   */
  "flat": CardVariantItem;

  /**
   * `outlined` visual variant.
   */
  "outlined": CardVariantItem;

  /**
   * Plain visual variant.
   */
  "plain": CardVariantItem;

  /**
   * Text color classes.
   */
  "text": CardVariantItem;

  /**
   * Tonal visual variant.
   */
  "tonal": CardVariantItem;
}

export const variantProps: CardVariant = {
  "flat": {
    "text": "",
    "border": "",
    "root": "bg-white dark:bg-dark-800",
    "footer": "bg-white dark:bg-dark-800",
  },
  "text": {
    "text": "",
    "root": "bg-transparent",
    "footer": "bg-transparent",
    "border": "border-dark-200 dark:border-dark-600",
  },
  "elevated": {
    "text": "",
    "root": "bg-white dark:bg-dark-800",
    "footer": "bg-dark-50 dark:bg-dark-800",
    "border": "border-dark-200 dark:border-dark-600",
  },
  "tonal": {
    "text": "",
    "root": "bg-dark-100 dark:bg-dark-800/60",
    "footer": "bg-dark-200/50 dark:bg-dark-700/50",
    "border": "border-dark-200/70 dark:border-dark-600/70",
  },
  "outlined": {
    "text": "",
    "footer": "bg-transparent",
    "border": "border-dark-200 dark:border-dark-600",
    "root": "border border-dark-200 bg-transparent dark:border-dark-600",
  },
  "plain": {
    "text": "",
    "footer": "bg-transparent",
    "border": "border-transparent",
    "root":
      "bg-transparent opacity-60 transition-opacity hover:bg-dark-50 hover:opacity-100 dark:hover:bg-dark-800/50",
  },
};
