export interface ModalBlur {
  /**
   * Backdrop blur classes for the `2xl` token.
   */
  "2xl": string;

  /**
   * Backdrop blur classes for the `3xl` token.
   */
  "3xl": string;

  /**
   * Backdrop blur classes for the `lg` token.
   */
  "lg": string;

  /**
   * Backdrop blur classes for the `md` token.
   */
  "md": string;

  /**
   * No effect (empty token).
   */
  "none": string;

  /**
   * Backdrop blur classes for the `sm` token.
   */
  "sm": string;

  /**
   * Backdrop blur classes for the `xl` token.
   */
  "xl": string;

  /**
   * Backdrop blur classes for the `xs` token.
   */
  "xs": string;
}

export const blurProps: ModalBlur = {
  "xs": "backdrop-blur-xs",
  "sm": "backdrop-blur-sm",
  "md": "backdrop-blur-md",
  "lg": "backdrop-blur-lg",
  "xl": "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
  "none": "backdrop-blur-none",
};
