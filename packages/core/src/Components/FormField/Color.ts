// prettier-ignore
export interface FormFieldColorItem {
  "end": string;
  "input": string;
  "start": string;
  "underlined"?: string;
}

// prettier-ignore
export interface FormFieldColor {
  "dark": FormFieldColorItem;
  "error": FormFieldColorItem;
  "info": FormFieldColorItem;
  "primary": FormFieldColorItem;
  "secondary": FormFieldColorItem;
  "success": FormFieldColorItem;
  "warning": FormFieldColorItem;
}

// prettier-ignore
export const colorProps: FormFieldColor = {
  "dark": {
    "input": "focus-within:ring-dark-600",
    "end": "group-focus-within:text-dark-500",
    "start": "group-focus-within:text-dark-500",
    "underlined": "focus-within:border-dark-600",
  },
  "info": {
    "input": "focus-within:ring-info-600",
    "end": "group-focus-within:text-info-500",
    "start": "group-focus-within:text-info-500",
    "underlined": "focus-within:border-info-600",
  },
  "error": {
    "input": "focus-within:ring-error-600",
    "end": "group-focus-within:text-error-500",
    "start": "group-focus-within:text-error-500",
    "underlined": "focus-within:border-error-600",
  },
  "primary": {
    "input": "focus-within:ring-primary-600",
    "end": "group-focus-within:text-primary-500",
    "start": "group-focus-within:text-primary-500",
    "underlined": "focus-within:border-primary-600",
  },
  "success": {
    "input": "focus-within:ring-success-600",
    "end": "group-focus-within:text-success-500",
    "start": "group-focus-within:text-success-500",
    "underlined": "focus-within:border-success-600",
  },
  "warning": {
    "input": "focus-within:ring-warning-600",
    "end": "group-focus-within:text-warning-500",
    "start": "group-focus-within:text-warning-500",
    "underlined": "focus-within:border-warning-600",
  },
  "secondary": {
    "input": "focus-within:ring-secondary-600",
    "end": "group-focus-within:text-secondary-500",
    "start": "group-focus-within:text-secondary-500",
    "underlined": "focus-within:border-secondary-600",
  },
};
