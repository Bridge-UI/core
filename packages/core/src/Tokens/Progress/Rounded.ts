export interface ProgressRounded {
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
}

export const roundedProps: ProgressRounded = {
  "sm": "rounded-sm",
  "md": "rounded-md",
  "lg": "rounded-lg",
  "none": "rounded-none",
  "full": "rounded-full",
};
