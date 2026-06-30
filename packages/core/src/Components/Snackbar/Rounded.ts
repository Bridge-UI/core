export interface SnackbarRoundedItem {
  /**
   * Base snackbar radius classes.
   */
  "base": string;

  /**
   * Bottom right corner radius classes.
   */
  "br": string;

  /**
   * Top right corner radius classes.
   */
  "tr": string;
}

export interface SnackbarRounded {
  /**
   * Border radius classes for the `2xl` token.
   */
  "2xl": SnackbarRoundedItem;

  /**
   * Border radius classes for the `3xl` token.
   */
  "3xl": SnackbarRoundedItem;

  /**
   * Border radius classes for the `4xl` token.
   */
  "4xl": SnackbarRoundedItem;

  /**
   * Full width or fully rounded token.
   */
  "full": SnackbarRoundedItem;

  /**
   * Border radius classes for the `lg` token.
   */
  "lg": SnackbarRoundedItem;

  /**
   * Border radius classes for the `md` token.
   */
  "md": SnackbarRoundedItem;

  /**
   * No effect (empty token).
   */
  "none": SnackbarRoundedItem;

  /**
   * Border radius classes for the `sm` token.
   */
  "sm": SnackbarRoundedItem;

  /**
   * Border radius classes for the `xl` token.
   */
  "xl": SnackbarRoundedItem;

  /**
   * Border radius classes for the `xs` token.
   */
  "xs": SnackbarRoundedItem;
}

export const roundedProps: SnackbarRounded = {
  "xs": {
    "base": "rounded-xs",
    "br": "rounded-br-xs",
    "tr": "rounded-tr-xs",
  },
  "sm": {
    "base": "rounded-sm",
    "br": "rounded-br-sm",
    "tr": "rounded-tr-sm",
  },
  "md": {
    "base": "rounded-md",
    "br": "rounded-br-md",
    "tr": "rounded-tr-md",
  },
  "lg": {
    "base": "rounded-lg",
    "br": "rounded-br-lg",
    "tr": "rounded-tr-lg",
  },
  "xl": {
    "base": "rounded-xl",
    "br": "rounded-br-xl",
    "tr": "rounded-tr-xl",
  },
  "2xl": {
    "base": "rounded-2xl",
    "br": "rounded-br-2xl",
    "tr": "rounded-tr-2xl",
  },
  "3xl": {
    "base": "rounded-3xl",
    "br": "rounded-br-3xl",
    "tr": "rounded-tr-3xl",
  },
  "4xl": {
    "base": "rounded-4xl",
    "br": "rounded-br-4xl",
    "tr": "rounded-tr-4xl",
  },
  "none": {
    "base": "rounded-none",
    "br": "rounded-br-none",
    "tr": "rounded-tr-none",
  },
  "full": {
    "base": "rounded-full",
    "br": "rounded-br-full",
    "tr": "rounded-tr-full",
  },
};
