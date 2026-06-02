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
    "root": "bg-white dark:bg-dark-800",
    "text": "text-dark-700 dark:text-dark-400",
    "border": "",
    "footer": "bg-white dark:bg-dark-800",
  },
  "text": {
    "root": "bg-transparent",
    "text": "text-dark-700 dark:text-dark-400",
    "border": "border-dark-200 dark:border-dark-600",
    "footer": "bg-transparent",
  },
  "plain": {
    "root": "bg-transparent opacity-60 transition-opacity hover:bg-dark-50 hover:opacity-100 dark:hover:bg-dark-800/50",
    "text": "text-dark-700 dark:text-dark-400",
    "border": "border-transparent",
    "footer": "bg-transparent",
  },
  "tonal": {
    "root": "bg-dark-100 dark:bg-dark-800/60",
    "text": "text-dark-800 dark:text-dark-300",
    "border": "border-dark-200/70 dark:border-dark-600/70",
    "footer": "bg-dark-200/50 dark:bg-dark-700/50",
  },
  "elevated": {
    "root": "bg-white dark:bg-dark-800",
    "text": "text-dark-700 dark:text-dark-400",
    "border": "border-dark-200 dark:border-dark-600",
    "footer": "bg-dark-50 dark:bg-dark-800",
  },
  "outlined": {
    "root": "border border-dark-200 bg-transparent dark:border-dark-600",
    "text": "text-dark-700 dark:text-dark-400",
    "border": "border-dark-200 dark:border-dark-600",
    "footer": "bg-transparent",
  },
};
