// prettier-ignore
export interface TextFieldColorItem {
  "end": string;
  "input": string;
  "start": string;
}

// prettier-ignore
export interface TextFieldColor {
  "dark": TextFieldColorItem;
  "primary": TextFieldColorItem;
  "secondary": TextFieldColorItem;
  "success": TextFieldColorItem;
  "error": TextFieldColorItem;
  "warning": TextFieldColorItem;
  "info": TextFieldColorItem;
}

// prettier-ignore
export const colorProps: TextFieldColor = {
  "dark": {
    "end": "input-focus:text-dark-500",
    "start": "input-focus:text-dark-500",
    "input": "focus-within:ring-dark-600",
  },
  "primary": {
    "end": "input-focus:text-primary-500",
    "start": "input-focus:text-primary-500",
    "input": "focus-within:ring-primary-600",
  },
  "secondary": {
    "end": "input-focus:text-secondary-500",
    "start": "input-focus:text-secondary-500",
    "input": "focus-within:ring-secondary-600",
  },
  "success": {
    "end": "input-focus:text-success-500",
    "start": "input-focus:text-success-500",
    "input": "focus-within:ring-success-600",
  },
  "error": {
    "end": "input-focus:text-error-500",
    "start": "input-focus:text-error-500",
    "input": "focus-within:ring-error-600",
  },
  "warning": {
    "end": "input-focus:text-warning-500",
    "start": "input-focus:text-warning-500",
    "input": "focus-within:ring-warning-600",
  },
  "info": {
    "end": "input-focus:text-info-500",
    "start": "input-focus:text-info-500",
    "input": "focus-within:ring-info-600",
  },
};
