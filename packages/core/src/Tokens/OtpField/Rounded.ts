export interface OtpFieldRoundedItem {
  /**
   * Border radius on each pin cell.
   */
  "pin": string;
}

export interface OtpFieldRounded {
  "2xl": OtpFieldRoundedItem;
  "3xl": OtpFieldRoundedItem;
  "4xl": OtpFieldRoundedItem;
  "full": OtpFieldRoundedItem;
  "lg": OtpFieldRoundedItem;
  "md": OtpFieldRoundedItem;
  "none": OtpFieldRoundedItem;
  "sm": OtpFieldRoundedItem;
  "xl": OtpFieldRoundedItem;
  "xs": OtpFieldRoundedItem;
}

export const roundedProps: OtpFieldRounded = {
  "xs": { "pin": "rounded-xs" },
  "sm": { "pin": "rounded-sm" },
  "md": { "pin": "rounded-md" },
  "lg": { "pin": "rounded-lg" },
  "xl": { "pin": "rounded-xl" },
  "2xl": { "pin": "rounded-2xl" },
  "3xl": { "pin": "rounded-3xl" },
  "4xl": { "pin": "rounded-4xl" },
  "none": { "pin": "rounded-none" },
  "full": { "pin": "rounded-full" },
};
