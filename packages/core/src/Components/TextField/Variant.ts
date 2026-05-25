// prettier-ignore
export interface TextFieldVariantItem {
  /**
   * Structural classes for the input container (`<div>` wrapper).
   */
  "container": string;

  /**
   * Optional extra classes merged on the container for this variant.
   */
  "input"?: string;

  /**
   * Optional extra classes for the inline-start adornment region.
   */
  "start"?: string;

  /**
   * Optional extra classes for the inline-end adornment region.
   */
  "end"?: string;
}

// prettier-ignore
export interface TextFieldVariant {
  "filled": TextFieldVariantItem;
  "outline": TextFieldVariantItem;
  "underlined": TextFieldVariantItem;
}

// prettier-ignore
export const variantProps: TextFieldVariant = {
  "outline": {
    "container":
      "bg-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus-within:ring-2",
  },
  "filled": {
    "container":
      "bg-gray-100 dark:bg-gray-800 border-transparent ring-1 ring-inset ring-transparent focus-within:ring-2",
  },
  "underlined": {
    "container":
      "rounded-none bg-transparent shadow-none ring-0 border-0 border-b-2 border-gray-300 dark:border-gray-600 focus-within:ring-0",
  },
};
