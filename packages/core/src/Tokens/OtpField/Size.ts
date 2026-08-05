export interface OtpFieldSizeItem {
  /**
   * Typography on the native pin `<input>`.
   */
  "input": string;

  /**
   * Fixed width/height for each pin cell.
   */
  "pin": string;
}

export interface OtpFieldSize {
  /**
   * Size scale token `2xl`.
   */
  "2xl": OtpFieldSizeItem;

  /**
   * Size scale token `2xs`.
   */
  "2xs": OtpFieldSizeItem;

  /**
   * Size scale token `lg`.
   */
  "lg": OtpFieldSizeItem;

  /**
   * Size scale token `md`.
   */
  "md": OtpFieldSizeItem;

  /**
   * Size scale token `sm`.
   */
  "sm": OtpFieldSizeItem;

  /**
   * Size scale token `xl`.
   */
  "xl": OtpFieldSizeItem;

  /**
   * Size scale token `xs`.
   */
  "xs": OtpFieldSizeItem;
}

export const sizeProps: OtpFieldSize = {
  "xs": {
    "pin": "h-7 w-7",
    "input": "text-xs leading-tight",
  },
  "sm": {
    "pin": "h-8 w-8",
    "input": "text-xs leading-normal",
  },
  "2xs": {
    "pin": "h-6 w-6",
    "input": "text-2xs leading-tight",
  },
  "md": {
    "pin": "h-10 w-10",
    "input": "text-sm leading-normal",
  },
  "lg": {
    "pin": "h-12 w-12",
    "input": "text-lg leading-normal",
  },
  "xl": {
    "pin": "h-14 w-14",
    "input": "text-xl leading-normal",
  },
  "2xl": {
    "pin": "h-16 w-16",
    "input": "text-2xl leading-normal",
  },
};
