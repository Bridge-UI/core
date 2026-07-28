export interface ProgressSize {
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
   * Height classes for the `xs` size token.
   */
  "xs": string;
}

export const sizeProps: ProgressSize = {
  "sm": "h-1",
  "lg": "h-2",
  "xs": "h-0.5",
  "md": "h-1.5",
};
