/**
 * Per-token sizing for empty-state root, media, copy, and actions.
 */
export interface EmptyStateSizeItem {
  /**
   * Classes for the actions row.
   */
  "actions": string;

  /**
   * Classes for the description.
   */
  "description": string;

  /**
   * Icon size token for the default `icon` (`Icon` `size` prop).
   */
  "icon": string;

  /**
   * Classes for the media wrapper.
   */
  "media": string;

  /**
   * Classes for the root stack.
   */
  "root": string;

  /**
   * Classes for the title.
   */
  "title": string;
}

/**
 * Empty-state size scale.
 */
export interface EmptyStateSize {
  /**
   * Large size token.
   */
  "lg": EmptyStateSizeItem;

  /**
   * Medium size token (default).
   */
  "md": EmptyStateSizeItem;

  /**
   * Small size token.
   */
  "sm": EmptyStateSizeItem;
}

/**
 * Default empty-state size classes.
 */
export const sizeProps: EmptyStateSize = {
  "sm": {
    "icon": "lg",
    "actions": "mt-0.5 flex flex-wrap items-center gap-2",
    "root": "flex w-full max-w-sm flex-col gap-2 px-4 py-6",
    "description": "m-0 text-xs text-dark-500 dark:text-dark-400",
    "media": "text-dark-400 dark:text-dark-500 [&_svg]:h-8 [&_svg]:w-8",
    "title": "m-0 text-sm font-semibold text-dark-900 dark:text-dark-100",
  },
  "md": {
    "icon": "xl",
    "actions": "mt-1 flex flex-wrap items-center gap-2",
    "root": "flex w-full max-w-md flex-col gap-3 px-6 py-10",
    "description": "m-0 text-sm text-dark-500 dark:text-dark-400",
    "media": "text-dark-400 dark:text-dark-500 [&_svg]:h-10 [&_svg]:w-10",
    "title": "m-0 text-base font-semibold text-dark-900 dark:text-dark-100",
  },
  "lg": {
    "icon": "2xl",
    "actions": "mt-2 flex flex-wrap items-center gap-3",
    "root": "flex w-full max-w-lg flex-col gap-4 px-8 py-14",
    "description": "m-0 text-base text-dark-500 dark:text-dark-400",
    "media": "text-dark-400 dark:text-dark-500 [&_svg]:h-12 [&_svg]:w-12",
    "title": "m-0 text-lg font-semibold text-dark-900 dark:text-dark-100",
  },
};
