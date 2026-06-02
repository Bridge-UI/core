// prettier-ignore
export interface CardVariantItem {
  "root": string;
  "text": string;
  "border": string;
  "footer": string;
}

// prettier-ignore
export interface CardVariant {
  "flat": CardVariantItem;
  "text": CardVariantItem;
  "plain": CardVariantItem;
  "tonal": CardVariantItem;
  "elevated": CardVariantItem;
  "outlined": CardVariantItem;
}

// prettier-ignore
export const variantProps: CardVariant = {
  "flat": {
    "root": "bg-white dark:bg-secondary-800",
    "text": "text-secondary-700 dark:text-secondary-400",
    "border": "",
    "footer": "bg-white dark:bg-secondary-800",
  },
  "text": {
    "root": "bg-transparent",
    "text": "text-secondary-700 dark:text-secondary-400",
    "border": "border-secondary-200 dark:border-secondary-600",
    "footer": "bg-transparent",
  },
  "plain": {
    "root": "bg-transparent opacity-60 transition-opacity hover:bg-secondary-50 hover:opacity-100 dark:hover:bg-secondary-800/50",
    "text": "text-secondary-700 dark:text-secondary-400",
    "border": "border-transparent",
    "footer": "bg-transparent",
  },
  "tonal": {
    "root": "bg-secondary-100 dark:bg-secondary-800/60",
    "text": "text-secondary-800 dark:text-secondary-300",
    "border": "border-secondary-200/70 dark:border-secondary-600/70",
    "footer": "bg-secondary-200/50 dark:bg-secondary-700/50",
  },
  "elevated": {
    "root": "bg-white dark:bg-secondary-800",
    "text": "text-secondary-700 dark:text-secondary-400",
    "border": "border-secondary-200 dark:border-secondary-600",
    "footer": "bg-secondary-50 dark:bg-secondary-800",
  },
  "outlined": {
    "root": "border border-secondary-200 bg-transparent dark:border-secondary-600",
    "text": "text-secondary-700 dark:text-secondary-400",
    "border": "border-secondary-200 dark:border-secondary-600",
    "footer": "bg-transparent",
  },
};
