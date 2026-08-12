/**
 * Per-color expanded-state classes for accordion triggers and indicators.
 */
export interface AccordionColorItem {
  /**
   * Accent color for the expand indicator when the item is expanded.
   */
  "indicator": string;

  /**
   * Text accent for the expanded trigger label.
   */
  "triggerExpanded": string;
}

/**
 * Accordion color tokens (expanded accent).
 */
export interface AccordionColor {
  /**
   * `dark` semantic color palette.
   */
  "dark": AccordionColorItem;

  /**
   * `error` semantic color palette.
   */
  "error": AccordionColorItem;

  /**
   * Info semantic color palette.
   */
  "info": AccordionColorItem;

  /**
   * `primary` semantic color palette.
   */
  "primary": AccordionColorItem;

  /**
   * `secondary` semantic color palette.
   */
  "secondary": AccordionColorItem;

  /**
   * `success` semantic color palette.
   */
  "success": AccordionColorItem;

  /**
   * `warning` semantic color palette.
   */
  "warning": AccordionColorItem;
}

/**
 * Default accordion color maps (expanded accent).
 */
export const colorProps: AccordionColor = {
  "dark": {
    "indicator": "text-dark-800 dark:text-dark-100",
    "triggerExpanded": "text-dark-900 dark:text-dark-50",
  },
  "info": {
    "indicator": "text-info-600 dark:text-info-400",
    "triggerExpanded": "text-info-700 dark:text-info-300",
  },
  "error": {
    "indicator": "text-error-600 dark:text-error-400",
    "triggerExpanded": "text-error-700 dark:text-error-300",
  },
  "primary": {
    "indicator": "text-primary-600 dark:text-primary-400",
    "triggerExpanded": "text-primary-700 dark:text-primary-300",
  },
  "success": {
    "indicator": "text-success-600 dark:text-success-400",
    "triggerExpanded": "text-success-700 dark:text-success-300",
  },
  "warning": {
    "indicator": "text-warning-600 dark:text-warning-400",
    "triggerExpanded": "text-warning-700 dark:text-warning-300",
  },
  "secondary": {
    "indicator": "text-secondary-600 dark:text-secondary-400",
    "triggerExpanded": "text-secondary-700 dark:text-secondary-300",
  },
};
