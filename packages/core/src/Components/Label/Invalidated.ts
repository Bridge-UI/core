export interface LabelInvalidated {
  /**
   * Label text color.
   */
  "label": string;

  /**
   * Required asterisk color.
   */
  "required": string;
}

export const invalidatedProps: LabelInvalidated = {
  "label": "text-error-600 dark:text-error-400",
  "required": "text-error-500 dark:text-error-500 select-none",
};
