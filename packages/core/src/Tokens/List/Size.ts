/**
 * Per-token typography for `List` rows and section titles.
 */
export interface ListSizeItem {
  /**
   * Selected icon size classes on non-listbox rows.
   */
  "icon": string;

  /**
   * Base font size on the row (slot content inherits it).
   */
  "item": string;

  /**
   * Font size for the item primary label.
   */
  "primary": string;

  /**
   * Font size for the item secondary description.
   */
  "secondary": string;

  /**
   * Font size for `ListSection` titles.
   */
  "section": string;
}

/**
 * List size scale, aligned with the `Text` typography scale.
 */
export interface ListSize {
  /**
   * Large size token.
   */
  "lg": ListSizeItem;

  /**
   * Medium size token (default).
   */
  "md": ListSizeItem;

  /**
   * Small size token.
   */
  "sm": ListSizeItem;
}

export const sizeProps: ListSize = {
  "sm": {
    "icon": "size-3",
    "item": "text-xs",
    "primary": "text-xs",
    "section": "text-2xs",
    "secondary": "text-2xs",
  },
  "md": {
    "item": "text-sm",
    "icon": "size-3.5",
    "primary": "text-sm",
    "section": "text-xs",
    "secondary": "text-xs",
  },
  "lg": {
    "icon": "size-4",
    "item": "text-base",
    "section": "text-sm",
    "primary": "text-base",
    "secondary": "text-sm",
  },
};
