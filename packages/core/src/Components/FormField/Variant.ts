// prettier-ignore
export interface FormFieldVariantItem {
  /**
   * Label inside the container (notched outline).
   */
  "label"?: string;

  /**
   * Corner on the label row (notched outline).
   */
  "corner"?: string;

  /**
   * Row above the control with label and corner (notched / stacked).
   */
  "labelRow"?: string;

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
    "labelRow": "pointer-events-none absolute inset-x-0 top-0 z-[1] flex -translate-y-1/2 gap-x-2 px-2.5",
    "corner": "pointer-events-auto shrink-0 bg-white px-1 text-gray-500 dark:bg-gray-900 dark:text-gray-400",
    "container": "relative bg-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus-within:ring-2",
    "label": "pointer-events-auto min-w-0 bg-white px-1 font-medium leading-none text-gray-700 group-data-[invalid]:text-error-600 dark:bg-gray-900 dark:text-gray-300 dark:group-data-[invalid]:text-error-400",
  },
  "outline": {
    "container": "bg-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus-within:ring-2",
  },
  "stacked": {
    "labelRow": "flex w-full shrink-0 gap-x-2 px-0 pt-1.5 pb-0.5",
    "container": "bg-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-200 dark:ring-gray-600 focus-within:ring-2",
  },
  "underlined": {
    "container": "rounded-none bg-transparent shadow-none ring-0 border-0 border-b-2 border-gray-300 dark:border-gray-600 focus-within:ring-0",
  },
};
