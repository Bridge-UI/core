export interface IconSize {
  /**
   * Max-width classes for the `2xl` size token.
   */
  "2xl": string;

  /**
   * Max-width classes for the `2xs` size token.
   */
  "2xs": string;

  /**
   * Max-width classes for the `lg` size token.
   */
  "lg": string;

  /**
   * Max-width classes for the `md` size token.
   */
  "md": string;

  /**
   * Max-width classes for the `sm` size token.
   */
  "sm": string;

  /**
   * Max-width classes for the `xl` size token.
   */
  "xl": string;

  /**
   * Max-width classes for the `xs` size token.
   */
  "xs": string;
}

export const sizeProps: IconSize = {
  "xs": "w-3 h-3",
  "md": "w-4 h-4",
  "lg": "w-5 h-5",
  "xl": "w-6 h-6",
  "2xs": "w-2 h-2",
  "2xl": "w-7 h-7",
  "sm": "w-3.5 h-3.5",
};
