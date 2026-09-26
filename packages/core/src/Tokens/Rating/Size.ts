export interface RatingSize {
  /**
   * Icon size classes for the `2xl` token.
   */
  "2xl": string;

  /**
   * Icon size classes for the `2xs` token.
   */
  "2xs": string;

  /**
   * Icon size classes for the `lg` token.
   */
  "lg": string;

  /**
   * Icon size classes for the `md` token.
   */
  "md": string;

  /**
   * Icon size classes for the `sm` token.
   */
  "sm": string;

  /**
   * Icon size classes for the `xl` token.
   */
  "xl": string;

  /**
   * Icon size classes for the `xs` token.
   */
  "xs": string;
}

export const sizeProps: RatingSize = {
  "xs": "w-3 h-3",
  "sm": "w-4 h-4",
  "md": "w-5 h-5",
  "lg": "w-6 h-6",
  "xl": "w-7 h-7",
  "2xl": "w-8 h-8",
  "2xs": "w-2.5 h-2.5",
};
