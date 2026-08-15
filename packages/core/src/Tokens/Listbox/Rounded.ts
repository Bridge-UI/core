/**
 * Directional radius classes for a Listbox rounded token.
 */
export interface ListboxRoundedItem {
  /**
   * Top-only radius for bottom drawers (flush with the screen edge).
   */
  "drawer": string;

  /**
   * Full-corner radius for modal dialog surfaces.
   */
  "panel": string;
}

/**
 * Listbox surface radius scale (dialog overlays). Menu overlays still use
 * {@link MenuRounded} via the forwarded `rounded` prop on `Menu`.
 */
export interface ListboxRounded {
  /**
   * Border radius classes for the `2xl` token.
   */
  "2xl": ListboxRoundedItem;

  /**
   * Border radius classes for the `3xl` token.
   */
  "3xl": ListboxRoundedItem;

  /**
   * Border radius classes for the `4xl` token.
   */
  "4xl": ListboxRoundedItem;

  /**
   * Full width or fully rounded token.
   */
  "full": ListboxRoundedItem;

  /**
   * Border radius classes for the `lg` token.
   */
  "lg": ListboxRoundedItem;

  /**
   * Border radius classes for the `md` token.
   */
  "md": ListboxRoundedItem;

  /**
   * No effect (empty token).
   */
  "none": ListboxRoundedItem;

  /**
   * Border radius classes for the `sm` token.
   */
  "sm": ListboxRoundedItem;

  /**
   * Border radius classes for the `xl` token.
   */
  "xl": ListboxRoundedItem;

  /**
   * Border radius classes for the `xs` token.
   */
  "xs": ListboxRoundedItem;
}

export const roundedProps: ListboxRounded = {
  "none": {
    "panel": "rounded-none",
    "drawer": "rounded-none",
  },
  "xs": {
    "panel": "rounded-xs",
    "drawer": "rounded-t-xs rounded-b-none",
  },
  "sm": {
    "panel": "rounded-sm",
    "drawer": "rounded-t-sm rounded-b-none",
  },
  "md": {
    "panel": "rounded-md",
    "drawer": "rounded-t-md rounded-b-none",
  },
  "lg": {
    "panel": "rounded-lg",
    "drawer": "rounded-t-lg rounded-b-none",
  },
  "xl": {
    "panel": "rounded-xl",
    "drawer": "rounded-t-xl rounded-b-none",
  },
  "2xl": {
    "panel": "rounded-2xl",
    "drawer": "rounded-t-2xl rounded-b-none",
  },
  "3xl": {
    "panel": "rounded-3xl",
    "drawer": "rounded-t-3xl rounded-b-none",
  },
  "4xl": {
    "panel": "rounded-4xl",
    "drawer": "rounded-t-4xl rounded-b-none",
  },
  "full": {
    "panel": "rounded-full",
    "drawer": "rounded-t-full rounded-b-none",
  },
};
