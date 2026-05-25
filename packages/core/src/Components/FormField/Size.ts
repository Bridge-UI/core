// prettier-ignore
export interface FormFieldSizeItem {
  "error": string;
  "label": string;
  "corner": string;
  "description": string;
}

// prettier-ignore
export interface FormFieldSize {
  "2xs": FormFieldSizeItem;
  "xs": FormFieldSizeItem;
  "sm": FormFieldSizeItem;
  "md": FormFieldSizeItem;
  "lg": FormFieldSizeItem;
  "xl": FormFieldSizeItem;
  "2xl": FormFieldSizeItem;
}

// prettier-ignore
export const sizeProps: FormFieldSize = {
  "2xs": {
    "error": "text-2xs",
    "label": "text-2xs",
    "corner": "text-2xs",
    "description": "text-2xs",
  },
  "xs": {
    "error": "text-xs",
    "label": "text-xs",
    "corner": "text-xs",
    "description": "text-xs",
  },
  "sm": {
    "error": "text-xs",
    "label": "text-xs",
    "corner": "text-xs",
    "description": "text-xs",
  },
  "md": {
    "error": "text-sm",
    "label": "text-sm",
    "corner": "text-sm",
    "description": "text-sm",
  },
  "lg": {
    "error": "text-sm",
    "label": "text-sm",
    "corner": "text-sm",
    "description": "text-sm",
  },
  "xl": {
    "error": "text-base",
    "label": "text-base",
    "corner": "text-base",
    "description": "text-base",
  },
  "2xl": {
    "error": "text-lg",
    "label": "text-lg",
    "corner": "text-lg",
    "description": "text-lg",
  },
};
