export interface RadioSize {
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

export const sizeProps: RadioSize = {
  "xs": "w-3 h-3",
  "sm": "w-4 h-4",
  "md": "w-5 h-5",
  "lg": "w-6 h-6",
  "xl": "w-7 h-7",
  "2xl": "w-8 h-8",
  "2xs": "w-2.5 h-2.5",
};
