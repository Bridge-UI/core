export interface MenuRounded {
  /**
   * Border radius classes for the `2xl` token.
   */
  "2xl": string;

  /**
   * Border radius classes for the `3xl` token.
   */
  "3xl": string;

  /**
   * Border radius classes for the `4xl` token.
   */
  "4xl": string;

  /**
   * Full width or fully rounded token.
   */
  "full": string;

  /**
   * Border radius classes for the `lg` token.
   */
  "lg": string;

  /**
   * Border radius classes for the `md` token.
   */
  "md": string;

  /**
   * No effect (empty token).
   */
  "none": string;

  /**
   * Border radius classes for the `sm` token.
   */
  "sm": string;

  /**
   * Border radius classes for the `xl` token.
   */
  "xl": string;

  /**
   * Border radius classes for the `xs` token.
   */
  "xs": string;
}

export const roundedProps: MenuRounded = {
  "xs": "rounded-xs",
  "sm": "rounded-sm",
  "md": "rounded-md",
  "lg": "rounded-lg",
  "xl": "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  "4xl": "rounded-4xl",
  "none": "rounded-none",
  "full": "rounded-full",
};
