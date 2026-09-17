/**
 * Overlay-specific sizing for Listbox options, check icons, and status messages.
 */
export interface ListboxSizeOverlayItem {
  /**
   * Check icon size classes on selected options.
   */
  "check": string;

  /**
   * Typography and padding for empty / loading message rows.
   */
  "message": string;

  /**
   * Padding on the interactive option row.
   */
  "option": string;

  /**
   * Typography for the option primary label.
   */
  "primary": string;

  /**
   * Typography for the option secondary description.
   */
  "secondary": string;
}

/**
 * Per-token sizing for Listbox options, check icons, and status messages.
 */
export interface ListboxSizeItem {
  /**
   * Compact padding / type for anchored menu overlays.
   */
  "menu": ListboxSizeOverlayItem;

  /**
   * Larger padding / type for dialog overlays (`modal` / `drawer`).
   */
  "panel": ListboxSizeOverlayItem;
}

/**
 * Listbox size scale aligned with FormField / Select (`2xs` … `2xl`).
 */
export interface ListboxSize {
  /**
   * Extra extra large size token.
   */
  "2xl": ListboxSizeItem;

  /**
   * Extra extra small size token.
   */
  "2xs": ListboxSizeItem;

  /**
   * Large size token.
   */
  "lg": ListboxSizeItem;

  /**
   * Medium size token (default).
   */
  "md": ListboxSizeItem;

  /**
   * Small size token.
   */
  "sm": ListboxSizeItem;

  /**
   * Extra large size token.
   */
  "xl": ListboxSizeItem;

  /**
   * Extra small size token.
   */
  "xs": ListboxSizeItem;
}

export const sizeProps: ListboxSize = {
  "md": {
    "panel": {
      "check": "size-4",
      "option": "px-2 py-2 text-sm",
      "secondary": "mt-0.5 text-xs",
      "message": "px-2 py-3 text-sm",
      "primary": "text-sm font-medium leading-normal",
    },
    "menu": {
      "check": "size-4",
      "secondary": "mt-0.5 text-xs",
      "message": "px-2 py-3 text-sm",
      "option": "px-2 py-1.5 text-sm",
      "primary": "text-sm font-medium leading-normal",
    },
  },
  "2xl": {
    "menu": {
      "check": "size-5",
      "secondary": "mt-0.5 text-sm",
      "message": "px-3 py-3 text-lg",
      "option": "px-3 py-2.5 text-lg",
      "primary": "text-lg font-medium leading-normal",
    },
    "panel": {
      "check": "size-5",
      "secondary": "mt-0.5 text-sm",
      "message": "px-3 py-3 text-lg",
      "option": "px-3 py-2.5 text-lg",
      "primary": "text-lg font-medium leading-normal",
    },
  },
  "sm": {
    "panel": {
      "check": "size-4",
      "secondary": "mt-0.5 text-xs",
      "message": "px-2 py-3 text-sm",
      "option": "px-2 py-1.5 text-sm",
      "primary": "text-sm font-medium leading-normal",
    },
    "menu": {
      "check": "size-3.5",
      "option": "px-2 py-1 text-xs",
      "secondary": "mt-0.5 text-2xs",
      "message": "px-2 py-2.5 text-xs",
      "primary": "text-xs font-medium leading-normal",
    },
  },
  "2xs": {
    "panel": {
      "check": "size-3",
      "option": "px-2 py-1 text-xs",
      "message": "px-2 py-2 text-xs",
      "secondary": "mt-0.5 text-2xs",
      "primary": "text-xs font-medium leading-normal",
    },
    "menu": {
      "check": "size-3",
      "secondary": "mt-0.5 text-2xs",
      "message": "px-2 py-2 text-2xs",
      "option": "px-2 py-0.5 text-2xs",
      "primary": "text-2xs font-medium leading-normal",
    },
  },
  "xs": {
    "menu": {
      "check": "size-3",
      "option": "px-2 py-1 text-xs",
      "message": "px-2 py-2 text-xs",
      "secondary": "mt-0.5 text-2xs",
      "primary": "text-xs font-medium leading-normal",
    },
    "panel": {
      "check": "size-3.5",
      "secondary": "mt-0.5 text-2xs",
      "option": "px-2 py-1.5 text-xs",
      "message": "px-2 py-2.5 text-xs",
      "primary": "text-xs font-medium leading-normal",
    },
  },
  "lg": {
    "menu": {
      "check": "size-4",
      "option": "px-2 py-2 text-sm",
      "secondary": "mt-0.5 text-xs",
      "message": "px-2 py-3 text-sm",
      "primary": "text-sm font-medium leading-normal",
    },
    "panel": {
      "check": "size-5",
      "secondary": "mt-0.5 text-sm",
      "option": "px-2 py-2.5 text-base",
      "message": "px-2 py-3.5 text-base",
      "primary": "text-base font-medium leading-normal",
    },
  },
  "xl": {
    "panel": {
      "check": "size-5",
      "secondary": "mt-0.5 text-sm",
      "message": "px-3 py-3 text-lg",
      "option": "px-3 py-2.5 text-lg",
      "primary": "text-lg font-medium leading-normal",
    },
    "menu": {
      "check": "size-5",
      "secondary": "mt-0.5 text-sm",
      "option": "px-2 py-2.5 text-base",
      "message": "px-2 py-3.5 text-base",
      "primary": "text-base font-medium leading-normal",
    },
  },
};
