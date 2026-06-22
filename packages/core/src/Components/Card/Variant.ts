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
   * Default text color classes.
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
    "border": "",
    "root": "bg-white dark:bg-dark-800",
    "footer": "bg-white dark:bg-dark-800",
    "text": "text-dark-700 dark:text-dark-400",
  },
  "text": {
    "root": "bg-transparent",
    "footer": "bg-transparent",
    "text": "text-dark-700 dark:text-dark-400",
    "border": "border-dark-200 dark:border-dark-600",
  },
  "elevated": {
    "root": "bg-white dark:bg-dark-800",
    "footer": "bg-dark-50 dark:bg-dark-800",
    "text": "text-dark-700 dark:text-dark-400",
    "border": "border-dark-200 dark:border-dark-600",
  },
  "tonal": {
    "root": "bg-dark-100 dark:bg-dark-800/60",
    "text": "text-dark-800 dark:text-dark-300",
    "footer": "bg-dark-200/50 dark:bg-dark-700/50",
    "border": "border-dark-200/70 dark:border-dark-600/70",
  },
  "outlined": {
    "footer": "bg-transparent",
    "text": "text-dark-700 dark:text-dark-400",
    "border": "border-dark-200 dark:border-dark-600",
    "root": "border border-dark-200 bg-transparent dark:border-dark-600",
  },
  "plain": {
    "footer": "bg-transparent",
    "border": "border-transparent",
    "text": "text-dark-700 dark:text-dark-400",
    "root":
      "bg-transparent opacity-60 transition-opacity hover:bg-dark-50 hover:opacity-100 dark:hover:bg-dark-800/50",
  },
};
