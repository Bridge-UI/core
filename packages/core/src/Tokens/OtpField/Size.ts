export interface OtpFieldSizeItem {
  /**
   * Gap between pin cells.
   */
  "group": string;

  /**
   * Typography on the native pin `<input>`.
   */
  "input": string;

  /**
   * Fixed width/height for each pin cell.
   */
  "pin": string;

  /**
   * Typography for label, corner, description, and error message.
   */
  "text": string;
}

export interface OtpFieldSize {
  "2xl": OtpFieldSizeItem;
  "lg": OtpFieldSizeItem;
  "md": OtpFieldSizeItem;
  "sm": OtpFieldSizeItem;
  "xl": OtpFieldSizeItem;
  "xs": OtpFieldSizeItem;
}

export const sizeProps: OtpFieldSize = {
  "xs": {
    "pin": "h-7 w-7",
    "text": "text-xs",
    "group": "gap-1.5",
    "input": "text-xs leading-tight",
  },
  "sm": {
    "pin": "h-8 w-8",
    "text": "text-xs",
    "group": "gap-1.5",
    "input": "text-xs leading-normal",
  },
  "md": {
    "group": "gap-2",
    "text": "text-sm",
    "pin": "h-10 w-10",
    "input": "text-sm leading-normal",
  },
  "lg": {
    "group": "gap-2",
    "pin": "h-12 w-12",
    "text": "text-base",
    "input": "text-lg leading-normal",
  },
  "2xl": {
    "group": "gap-3",
    "text": "text-lg",
    "pin": "h-16 w-16",
    "input": "text-2xl leading-normal",
  },
  "xl": {
    "group": "gap-2.5",
    "pin": "h-14 w-14",
    "text": "text-base",
    "input": "text-xl leading-normal",
  },
};
