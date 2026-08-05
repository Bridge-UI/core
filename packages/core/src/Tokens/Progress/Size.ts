export interface ProgressSize {
  /**
   * Height classes for the `2xl` size token.
   */
  "2xl": string;

  /**
   * Height classes for the `2xs` size token.
   */
  "2xs": string;

  /**
   * Height classes for the `lg` size token.
   */
  "lg": string;

  /**
   * Height classes for the `md` size token.
   */
  "md": string;

  /**
   * Height classes for the `sm` size token.
   */
  "sm": string;

  /**
   * Height classes for the `xl` size token.
   */
  "xl": string;

  /**
   * Height classes for the `xs` size token.
   */
  "xs": string;
}

export const sizeProps: ProgressSize = {
  "sm": "h-1",
  "lg": "h-2",
  "2xl": "h-3",
  "2xs": "h-px",
  "xs": "h-0.5",
  "md": "h-1.5",
  "xl": "h-2.5",
};
