export interface LinkSize {
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

export const sizeProps: LinkSize = {
  "xs": "text-xs",
  "sm": "text-sm",
  "lg": "text-lg",
  "xl": "text-xl",
  "2xs": "text-2xs",
  "md": "text-base",
  "2xl": "text-2xl",
};
