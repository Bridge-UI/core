export interface TableRoundedItem {
  /**
   * Footer corner radius classes (`tfoot` cells).
   */
  "footer": string;

  /**
   * Header corner radius classes (`thead` cells).
   */
  "header": string;

  /**
   * Root corner radius classes (table wrapper).
   */
  "root": string;
}

export interface TableRounded {
  /**
   * Border radius classes for the `2xl` token.
   */
  "2xl": TableRoundedItem;

  /**
   * Border radius classes for the `3xl` token.
   */
  "3xl": TableRoundedItem;

  /**
   * Border radius classes for the `4xl` token.
   */
  "4xl": TableRoundedItem;

  /**
   * Panel-max radius (`rounded-panel-full`).
   */
  "full": TableRoundedItem;

  /**
   * Border radius classes for the `lg` token.
   */
  "lg": TableRoundedItem;

  /**
   * Border radius classes for the `md` token.
   */
  "md": TableRoundedItem;

  /**
   * No rounding.
   */
  "none": TableRoundedItem;

  /**
   * Border radius classes for the `sm` token.
   */
  "sm": TableRoundedItem;

  /**
   * Border radius classes for the `xl` token.
   */
  "xl": TableRoundedItem;

  /**
   * Border radius classes for the `xs` token.
   */
  "xs": TableRoundedItem;
}

export const roundedProps: TableRounded = {
  "xs": {
    "root": "rounded-xs",
    "header":
      "[&_th:first-child]:rounded-ss-xs [&_th:last-child]:rounded-se-xs",
    "footer":
      "[&_td:first-child]:rounded-es-xs [&_td:last-child]:rounded-ee-xs",
  },
  "sm": {
    "root": "rounded-sm",
    "header":
      "[&_th:first-child]:rounded-ss-sm [&_th:last-child]:rounded-se-sm",
    "footer":
      "[&_td:first-child]:rounded-es-sm [&_td:last-child]:rounded-ee-sm",
  },
  "md": {
    "root": "rounded-md",
    "header":
      "[&_th:first-child]:rounded-ss-md [&_th:last-child]:rounded-se-md",
    "footer":
      "[&_td:first-child]:rounded-es-md [&_td:last-child]:rounded-ee-md",
  },
  "lg": {
    "root": "rounded-lg",
    "header":
      "[&_th:first-child]:rounded-ss-lg [&_th:last-child]:rounded-se-lg",
    "footer":
      "[&_td:first-child]:rounded-es-lg [&_td:last-child]:rounded-ee-lg",
  },
  "xl": {
    "root": "rounded-xl",
    "header":
      "[&_th:first-child]:rounded-ss-xl [&_th:last-child]:rounded-se-xl",
    "footer":
      "[&_td:first-child]:rounded-es-xl [&_td:last-child]:rounded-ee-xl",
  },
  "2xl": {
    "root": "rounded-2xl",
    "header":
      "[&_th:first-child]:rounded-ss-2xl [&_th:last-child]:rounded-se-2xl",
    "footer":
      "[&_td:first-child]:rounded-es-2xl [&_td:last-child]:rounded-ee-2xl",
  },
  "3xl": {
    "root": "rounded-3xl",
    "header":
      "[&_th:first-child]:rounded-ss-3xl [&_th:last-child]:rounded-se-3xl",
    "footer":
      "[&_td:first-child]:rounded-es-3xl [&_td:last-child]:rounded-ee-3xl",
  },
  "4xl": {
    "root": "rounded-4xl",
    "header":
      "[&_th:first-child]:rounded-ss-4xl [&_th:last-child]:rounded-se-4xl",
    "footer":
      "[&_td:first-child]:rounded-es-4xl [&_td:last-child]:rounded-ee-4xl",
  },
  "none": {
    "root": "rounded-none",
    "header":
      "[&_th:first-child]:rounded-ss-none [&_th:last-child]:rounded-se-none",
    "footer":
      "[&_td:first-child]:rounded-es-none [&_td:last-child]:rounded-ee-none",
  },
  "full": {
    "root": "rounded-panel-full",
    "header":
      "[&_th:first-child]:rounded-ss-panel-full [&_th:last-child]:rounded-se-panel-full",
    "footer":
      "[&_td:first-child]:rounded-es-panel-full [&_td:last-child]:rounded-ee-panel-full",
  },
};
