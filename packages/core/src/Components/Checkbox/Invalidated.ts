export interface CheckboxInvalidated {
  "base": string;
  "checked": string;
  "focus": string;
}

export const invalidatedProps: CheckboxInvalidated = {
  "focus": "ring-error-500/30",
  "checked": "bg-error-600 border-error-600",
  "base": "border-gray-300 dark:border-gray-600",
};
