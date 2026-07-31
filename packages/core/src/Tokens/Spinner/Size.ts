export interface SpinnerSize {
  /**
   * Width/height classes for the `lg` size token.
   */
  "lg": string;

  /**
   * Width/height classes for the `md` size token.
   */
  "md": string;

  /**
   * Width/height classes for the `sm` size token.
   */
  "sm": string;

  /**
   * Width/height classes for the `xs` size token.
   */
  "xs": string;
}

export const sizeProps: SpinnerSize = {
  "xs": "size-4",
  "sm": "size-6",
  "md": "size-10",
  "lg": "size-14",
};
