// prettier-ignore
export interface FormFieldVariantItem {
  /**
   * Structural classes for the input container (`<div>` wrapper).
   */
  "container": string;
}

// prettier-ignore
export interface FormFieldVariant {
  "filled": FormFieldVariantItem;
  "notched": FormFieldVariantItem;
  "outline": FormFieldVariantItem;
  "stacked": FormFieldVariantItem;
  "underlined": FormFieldVariantItem;
}

// prettier-ignore
export const variantProps: FormFieldVariant = {
  "filled": {
    "container": "bg-gray-100 dark:bg-gray-800 border-transparent ring-1 ring-inset ring-transparent focus-within:ring-2",
  },
  "notched": {
    "container": "",
  },
  "outline": {
    "container": "bg-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus-within:ring-2",
  },
  "stacked": {
    "container": "",
  },
  "underlined": {
    "container": "rounded-none bg-transparent shadow-none ring-0 border-0 border-b-2 border-gray-300 dark:border-gray-600 focus-within:ring-0",
  },
};
