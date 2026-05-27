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
  "primary": FormFieldColorItem;
  "secondary": FormFieldColorItem;
  "success": FormFieldColorItem;
  "error": FormFieldColorItem;
  "warning": FormFieldColorItem;
  "info": FormFieldColorItem;
}

// prettier-ignore
export const colorProps: FormFieldColor = {
  "dark": {
    "end": "group-focus-within:text-dark-500",
    "start": "group-focus-within:text-dark-500",
    "input": "focus-within:ring-dark-600",
    "underlined": "focus-within:border-dark-600",
  },
  "primary": {
    "end": "group-focus-within:text-primary-500",
    "start": "group-focus-within:text-primary-500",
    "input": "focus-within:ring-primary-600",
    "underlined": "focus-within:border-primary-600",
  },
  "secondary": {
    "end": "group-focus-within:text-secondary-500",
    "start": "group-focus-within:text-secondary-500",
    "input": "focus-within:ring-secondary-600",
    "underlined": "focus-within:border-secondary-600",
  },
  "success": {
    "end": "group-focus-within:text-success-500",
    "start": "group-focus-within:text-success-500",
    "input": "focus-within:ring-success-600",
    "underlined": "focus-within:border-success-600",
  },
  "error": {
    "end": "group-focus-within:text-error-500",
    "start": "group-focus-within:text-error-500",
    "input": "focus-within:ring-error-600",
    "underlined": "focus-within:border-error-600",
  },
  "warning": {
    "end": "group-focus-within:text-warning-500",
    "start": "group-focus-within:text-warning-500",
    "input": "focus-within:ring-warning-600",
    "underlined": "focus-within:border-warning-600",
  },
  "info": {
    "end": "group-focus-within:text-info-500",
    "start": "group-focus-within:text-info-500",
    "input": "focus-within:ring-info-600",
    "underlined": "focus-within:border-info-600",
  },
};
