/**
 * Layout classes for NumberField increment and decrement controls.
 */
export interface NumberFieldControlVariantItem {
  /**
   * Classes for each stepper button.
   */
  "button": string;

  /**
   * Classes for the end stepper group (and the only group when not split).
   */
  "endGroup": string;

  /**
   * Classes for the start stepper group (`split` only).
   */
  "startGroup": string;
}

/**
 * Placement of NumberField increment and decrement controls.
 */
export interface NumberFieldControlVariant {
  /**
   * Decrement and increment in a row at the end of the field.
   */
  "inline": NumberFieldControlVariantItem;

  /**
   * Decrement at the start of the field and increment at the end.
   */
  "split": NumberFieldControlVariantItem;

  /**
   * Increment stacked above decrement at the end of the field.
   */
  "stacked": NumberFieldControlVariantItem;
}

/**
 * Default layout classes for NumberField stepper controls.
 */
export const controlVariantProps: NumberFieldControlVariant = {
  "stacked": {
    "startGroup": "",
    "button":
      "bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center",
    "endGroup":
      "bridge-end-adornment h-auto! flex min-h-0 min-w-9 self-stretch overflow-hidden my-0.5 me-0.5 flex-col gap-px",
  },
  "inline": {
    "startGroup": "",
    "button":
      "bridge-field-adornment-button inline-flex min-h-0 min-w-8 items-center justify-center self-stretch",
    "endGroup":
      "bridge-end-adornment h-auto! flex min-h-0 min-w-9 self-stretch overflow-hidden my-0.5 me-0.5 min-w-0 flex-row items-stretch",
  },
  "split": {
    "button":
      "bridge-field-adornment-button inline-flex min-h-0 min-w-8 flex-1 items-center justify-center",
    "endGroup":
      "bridge-end-adornment h-auto! flex min-h-0 min-w-9 self-stretch overflow-hidden my-0.5 me-0.5 flex-col",
    "startGroup":
      "bridge-start-adornment h-auto! flex min-h-0 min-w-9 self-stretch overflow-hidden my-0.5 ms-0.5 flex-col",
  },
};
