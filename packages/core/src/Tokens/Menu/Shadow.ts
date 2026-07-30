export interface MenuShadow {
  /**
   * Box shadow classes for the `2xl` token.
   */
  "2xl": string;

  /**
   * Box shadow classes for the `2xs` token.
   */
  "2xs": string;

  /**
   * Inner shadow token.
   */
  "inner": string;

  /**
   * Box shadow classes for the `lg` token.
   */
  "lg": string;

  /**
   * Box shadow classes for the `md` token.
   */
  "md": string;

  /**
   * No effect (empty token).
   */
  "none": string;

  /**
   * Box shadow classes for the `sm` token.
   */
  "sm": string;

  /**
   * Box shadow classes for the `xl` token.
   */
  "xl": string;

  /**
   * Box shadow classes for the `xs` token.
   */
  "xs": string;
}

export const shadowProps: MenuShadow = {
  "xs": "shadow-xs",
  "sm": "shadow-sm",
  "md": "shadow-md",
  "lg": "shadow-lg",
  "xl": "shadow-xl",
  "2xs": "shadow-2xs",
  "2xl": "shadow-2xl",
  "none": "shadow-none",
  "inner": "inset-shadow-sm",
};
