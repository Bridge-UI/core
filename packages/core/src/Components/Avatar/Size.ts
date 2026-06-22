export interface AvatarSize {
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

export const sizeProps: AvatarSize = {
  "xs": "w-7 h-7 text-xs",
  "sm": "w-8 h-8 text-sm",
  "2xs": "w-6 h-6 text-2xs",
  "md": "w-10 h-10 text-sm",
  "xl": "w-14 h-14 text-lg",
  "2xl": "w-16 h-16 text-xl",
  "lg": "w-12 h-12 text-base",
};
