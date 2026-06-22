export interface CardRoundedItem {
  /**
   * Footer corner radius classes.
   */
  "footer": string;

  /**
   * Header corner radius classes.
   */
  "header": string;

  /**
   * Root corner radius classes.
   */
  "root": string;
}

export interface CardRounded {
  /**
   * Border radius classes for the `2xl` token.
   */
  "2xl": CardRoundedItem;

  /**
   * Border radius classes for the `3xl` token.
   */
  "3xl": CardRoundedItem;

  /**
   * Border radius classes for the `4xl` token.
   */
  "4xl": CardRoundedItem;

  /**
   * Full width or fully rounded token.
   */
  "full": CardRoundedItem;

  /**
   * Border radius classes for the `lg` token.
   */
  "lg": CardRoundedItem;

  /**
   * Border radius classes for the `md` token.
   */
  "md": CardRoundedItem;

  /**
   * No effect (empty token).
   */
  "none": CardRoundedItem;

  /**
   * Border radius classes for the `sm` token.
   */
  "sm": CardRoundedItem;

  /**
   * Border radius classes for the `xl` token.
   */
  "xl": CardRoundedItem;

  /**
   * Border radius classes for the `xs` token.
   */
  "xs": CardRoundedItem;
}

export const roundedProps: CardRounded = {
  "xs": {
    "root": "rounded-xs",
    "header": "rounded-t-xs",
    "footer": "rounded-b-xs",
  },
  "sm": {
    "root": "rounded-sm",
    "header": "rounded-t-sm",
    "footer": "rounded-b-sm",
  },
  "md": {
    "root": "rounded-md",
    "header": "rounded-t-md",
    "footer": "rounded-b-md",
  },
  "lg": {
    "root": "rounded-lg",
    "header": "rounded-t-lg",
    "footer": "rounded-b-lg",
  },
  "xl": {
    "root": "rounded-xl",
    "header": "rounded-t-xl",
    "footer": "rounded-b-xl",
  },
  "2xl": {
    "root": "rounded-2xl",
    "header": "rounded-t-2xl",
    "footer": "rounded-b-2xl",
  },
  "3xl": {
    "root": "rounded-3xl",
    "header": "rounded-t-3xl",
    "footer": "rounded-b-3xl",
  },
  "4xl": {
    "root": "rounded-4xl",
    "header": "rounded-t-4xl",
    "footer": "rounded-b-4xl",
  },
  "none": {
    "root": "rounded-none",
    "header": "rounded-t-none",
    "footer": "rounded-b-none",
  },
  "full": {
    "root": "rounded-full",
    "header": "rounded-t-full",
    "footer": "rounded-b-full",
  },
};
