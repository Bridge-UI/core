export interface ModalSize {
  /**
   * Max-width classes for the `2xl` size token.
   */
  "2xl": string;

  /**
   * Max-width classes for the `3xl` size token.
   */
  "3xl": string;

  /**
   * Max-width classes for the `4xl` size token.
   */
  "4xl": string;

  /**
   * Max-width classes for the `5xl` size token.
   */
  "5xl": string;

  /**
   * Max-width classes for the `6xl` size token.
   */
  "6xl": string;

  /**
   * Max-width classes for the `7xl` size token.
   */
  "7xl": string;

  /**
   * Full width or fully rounded token.
   */
  "full": string;

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

export const sizeProps: ModalSize = {
  "xs": "sm:max-w-xs",
  "sm": "sm:max-w-sm",
  "md": "sm:max-w-md",
  "lg": "sm:max-w-lg",
  "xl": "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  "6xl": "sm:max-w-6xl",
  "7xl": "sm:max-w-7xl",
  "full": "sm:max-w-full",
};
