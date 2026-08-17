/**
 * Per-token sizing for stepper indicators, labels, and content.
 */
export interface StepperSizeItem {
  /**
   * Horizontal connector `top` (circle radius) so the line stays centered per size.
   */
  "connector": string;

  /**
   * Vertical step body (optional `Step` children).
   */
  "content": string;

  /**
   * Secondary description under the label.
   */
  "description": string;

  /**
   * Icon size token for check / error / custom `Icon` (`size` prop).
   */
  "icon": string;

  /**
   * Circle indicator footprint and number size.
   */
  "indicator": string;

  /**
   * Step title.
   */
  "label": string;

  /**
   * Indicator half-size CSS var so vertical connectors stay on the circle center.
   */
  "track": string;
}

/**
 * Stepper size scale.
 */
export interface StepperSize {
  /**
   * Large size token.
   */
  "lg": StepperSizeItem;

  /**
   * Medium size token (default).
   */
  "md": StepperSizeItem;

  /**
   * Small size token.
   */
  "sm": StepperSizeItem;
}

/**
 * Default stepper size classes.
 */
export const sizeProps: StepperSize = {
  "md": {
    "icon": "sm",
    "connector": "top-4",
    "label": "text-sm font-medium",
    "description": "text-sm font-medium",
    "indicator": "size-8 text-sm font-medium",
    "track": "[--bridge-stepper-indicator-half:1rem]",
    "content": "pt-2 pb-2 text-sm text-dark-600 dark:text-dark-300",
  },
  "sm": {
    "icon": "xs",
    "connector": "top-3",
    "label": "text-xs font-medium",
    "description": "text-xs font-medium",
    "indicator": "size-6 text-xs font-medium",
    "track": "[--bridge-stepper-indicator-half:0.75rem]",
    "content": "pt-1.5 pb-1.5 text-xs text-dark-600 dark:text-dark-300",
  },
  "lg": {
    "icon": "md",
    "connector": "top-5",
    "label": "text-base font-medium",
    "description": "text-sm font-medium",
    "indicator": "size-10 text-base font-medium",
    "track": "[--bridge-stepper-indicator-half:1.25rem]",
    "content": "pt-2.5 pb-2.5 text-base text-dark-600 dark:text-dark-300",
  },
};
