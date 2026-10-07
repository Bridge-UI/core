export interface FormFieldVariantItem {
  /**
   * Structural classes for the input container (`<div>` wrapper).
   */
  "container": string;

  /**
   * Container background when disabled (skipped while invalid).
   */
  "containerDisabled"?: string;

  /**
   * Corner on the label row (notched outline).
   */
  "corner"?: string;

  /**
   * Corner background when disabled (notched outline).
   */
  "cornerDisabled"?: string;

  /**
   * Label inside the container (notched outline).
   */
  "label"?: string;

  /**
   * Label background when disabled (notched outline). Split so the top half
   * matches the surface and the bottom half matches the disabled container.
   */
  "labelDisabled"?: string;

  /**
   * Row above the control with label and corner (notched / stacked).
   */
  "labelRow"?: string;
}

export interface FormFieldVariant {
  /**
   * Filled visual variant.
   */
  "filled": FormFieldVariantItem;

  /**
   * Notched outline visual variant.
   */
  "notched": FormFieldVariantItem;

  /**
   * Outline visual variant.
   */
  "outline": FormFieldVariantItem;

  /**
   * Stacked label visual variant.
   */
  "stacked": FormFieldVariantItem;

  /**
   * Underlined visual variant.
   */
  "underlined": FormFieldVariantItem;
}

export const variantProps: FormFieldVariant = {
  "underlined": {
    "container":
      "rounded-none bg-transparent shadow-none ring-0 border-0 border-b-2 border-dark-300 dark:border-dark-600 focus-within:ring-0",
  },
  "outline": {
    "containerDisabled": "bg-dark-100 dark:bg-dark-700/50",
    "container":
      "bg-white dark:bg-dark-800 ring-1 ring-inset ring-dark-300 dark:ring-dark-500 focus-within:ring-2",
  },
  "filled": {
    "containerDisabled": "bg-dark-50 dark:bg-dark-700/40",
    "container":
      "bg-dark-100 dark:bg-dark-700 border-transparent ring-1 ring-inset ring-transparent focus-within:ring-2",
  },
  "stacked": {
    "containerDisabled": "bg-dark-50 dark:bg-dark-700/40",
    "labelRow": "flex w-full shrink-0 gap-x-2 px-0 pt-1.5 pb-0.5",
    "container":
      "bg-dark-100 dark:bg-dark-700 ring-1 ring-inset ring-dark-200 dark:ring-dark-600 focus-within:ring-2",
  },
  "notched": {
    "containerDisabled": "bg-dark-100 dark:bg-dark-700/50",
    "labelRow":
      "pointer-events-none absolute inset-x-0 top-0 z-[1] flex -translate-y-1/2 gap-x-2 px-2.5",
    "corner":
      "pointer-events-auto shrink-0 bg-white px-1 text-dark-500 dark:bg-dark-800 dark:text-dark-400",
    "labelDisabled":
      "bg-linear-to-b from-white from-50% to-dark-100 to-50% dark:from-dark-800 dark:to-dark-700/50",
    "cornerDisabled":
      "bg-linear-to-b from-white from-50% to-dark-100 to-50% dark:from-dark-800 dark:to-dark-700/50",
    "container":
      "relative bg-white dark:bg-dark-800 ring-1 ring-inset ring-dark-300 dark:ring-dark-500 focus-within:ring-2",
    "label":
      "pointer-events-auto min-w-0 bg-white px-1 font-medium leading-none text-dark-700 dark:bg-dark-800 dark:text-dark-300",
  },
};
