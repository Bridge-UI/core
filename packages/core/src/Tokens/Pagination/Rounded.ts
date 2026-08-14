/**
 * Per-part radius classes for a pagination `rounded` token.
 */
export interface PaginationRoundedItem {
  /**
   * All-corner radius for ghost items and ellipsis.
   */
  "item": string;

  /**
   * Trailing (right) radius for the last outlined control.
   */
  "itemEnd": string;

  /**
   * Leading (left) radius for the first outlined control.
   */
  "itemStart": string;

  /**
   * Radius for the outlined list group shell.
   */
  "list": string;
}

/**
 * Pagination border-radius scale.
 */
export interface PaginationRounded {
  /**
   * Border radius classes for the `2xl` token.
   */
  "2xl": PaginationRoundedItem;

  /**
   * Border radius classes for the `3xl` token.
   */
  "3xl": PaginationRoundedItem;

  /**
   * Border radius classes for the `4xl` token.
   */
  "4xl": PaginationRoundedItem;

  /**
   * Full / pill radius token.
   */
  "full": PaginationRoundedItem;

  /**
   * Border radius classes for the `lg` token.
   */
  "lg": PaginationRoundedItem;

  /**
   * Border radius classes for the `md` token (default).
   */
  "md": PaginationRoundedItem;

  /**
   * No radius.
   */
  "none": PaginationRoundedItem;

  /**
   * Border radius classes for the `sm` token.
   */
  "sm": PaginationRoundedItem;

  /**
   * Border radius classes for the `xl` token.
   */
  "xl": PaginationRoundedItem;

  /**
   * Border radius classes for the `xs` token.
   */
  "xs": PaginationRoundedItem;
}

/**
 * Default pagination rounded class maps.
 */
export const roundedProps: PaginationRounded = {
  "xs": {
    "item": "rounded-xs",
    "list": "rounded-xs",
    "itemEnd": "rounded-r-xs",
    "itemStart": "rounded-l-xs",
  },
  "sm": {
    "item": "rounded-sm",
    "list": "rounded-sm",
    "itemEnd": "rounded-r-sm",
    "itemStart": "rounded-l-sm",
  },
  "md": {
    "item": "rounded-md",
    "list": "rounded-md",
    "itemEnd": "rounded-r-md",
    "itemStart": "rounded-l-md",
  },
  "lg": {
    "item": "rounded-lg",
    "list": "rounded-lg",
    "itemEnd": "rounded-r-lg",
    "itemStart": "rounded-l-lg",
  },
  "xl": {
    "item": "rounded-xl",
    "list": "rounded-xl",
    "itemEnd": "rounded-r-xl",
    "itemStart": "rounded-l-xl",
  },
  "2xl": {
    "item": "rounded-2xl",
    "list": "rounded-2xl",
    "itemEnd": "rounded-r-2xl",
    "itemStart": "rounded-l-2xl",
  },
  "3xl": {
    "item": "rounded-3xl",
    "list": "rounded-3xl",
    "itemEnd": "rounded-r-3xl",
    "itemStart": "rounded-l-3xl",
  },
  "4xl": {
    "item": "rounded-4xl",
    "list": "rounded-4xl",
    "itemEnd": "rounded-r-4xl",
    "itemStart": "rounded-l-4xl",
  },
  "none": {
    "item": "rounded-none",
    "list": "rounded-none",
    "itemEnd": "rounded-r-none",
    "itemStart": "rounded-l-none",
  },
  "full": {
    "item": "rounded-full",
    "list": "rounded-full",
    "itemEnd": "rounded-r-full",
    "itemStart": "rounded-l-full",
  },
};
