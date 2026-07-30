export interface FormFieldRoundedItem {
  /**
   * End adornment color classes.
   */
  "end": string;

  /**
   * Input text color classes.
   */
  "input": string;

  /**
   * Start adornment color classes.
   */
  "start": string;
}

export interface FormFieldRounded {
  /**
   * Border radius classes for the `2xl` token.
   */
  "2xl": FormFieldRoundedItem;

  /**
   * Border radius classes for the `3xl` token.
   */
  "3xl": FormFieldRoundedItem;

  /**
   * Border radius classes for the `4xl` token.
   */
  "4xl": FormFieldRoundedItem;

  /**
   * Full width or fully rounded token.
   */
  "full": FormFieldRoundedItem;

  /**
   * Border radius classes for the `lg` token.
   */
  "lg": FormFieldRoundedItem;

  /**
   * Border radius classes for the `md` token.
   */
  "md": FormFieldRoundedItem;

  /**
   * No effect (empty token).
   */
  "none": FormFieldRoundedItem;

  /**
   * Border radius classes for the `sm` token.
   */
  "sm": FormFieldRoundedItem;

  /**
   * Border radius classes for the `xl` token.
   */
  "xl": FormFieldRoundedItem;

  /**
   * Border radius classes for the `xs` token.
   */
  "xs": FormFieldRoundedItem;
}

export const roundedProps: FormFieldRounded = {
  "xs": {
    "end": "rounded-e-xs",
    "input": "rounded-xs",
    "start": "rounded-s-xs",
  },
  "sm": {
    "end": "rounded-e-sm",
    "input": "rounded-sm",
    "start": "rounded-s-sm",
  },
  "md": {
    "end": "rounded-e-md",
    "input": "rounded-md",
    "start": "rounded-s-md",
  },
  "lg": {
    "end": "rounded-e-lg",
    "input": "rounded-lg",
    "start": "rounded-s-lg",
  },
  "xl": {
    "end": "rounded-e-xl",
    "input": "rounded-xl",
    "start": "rounded-s-xl",
  },
  "none": {
    "end": "rounded-none",
    "input": "rounded-none",
    "start": "rounded-none",
  },
  "2xl": {
    "end": "rounded-e-2xl",
    "input": "rounded-2xl",
    "start": "rounded-s-2xl",
  },
  "3xl": {
    "end": "rounded-e-3xl",
    "input": "rounded-3xl",
    "start": "rounded-s-3xl",
  },
  "4xl": {
    "end": "rounded-e-4xl",
    "input": "rounded-4xl",
    "start": "rounded-s-4xl",
  },
  "full": {
    "end": "rounded-e-full",
    "input": "rounded-full",
    "start": "rounded-s-full",
  },
};
