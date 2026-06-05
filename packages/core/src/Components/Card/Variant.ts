// prettier-ignore
export interface CardVariantItem {
  "border": string;
  "footer": string;
  "root": string;
  "text": string;
}

// prettier-ignore
export interface CardVariant {
  "elevated": CardVariantItem;
  "flat": CardVariantItem;
  "outlined": CardVariantItem;
  "plain": CardVariantItem;
  "text": CardVariantItem;
  "tonal": CardVariantItem;
}

// prettier-ignore
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
    "root": "bg-transparent opacity-60 transition-opacity hover:bg-dark-50 hover:opacity-100 dark:hover:bg-dark-800/50",
  },
};
