/**
 * Per-token sizing for FileUpload dropzone, list, and attachment cards.
 */
export interface FileUploadSizeItem {
  /**
   * Classes for the actions cluster on a file card.
   */
  "actions": string;

  /**
   * Classes for the title + description stack on a file card.
   */
  "content": string;

  /**
   * Classes for the metadata line on a file card.
   */
  "description": string;

  /**
   * Classes for the dropzone surface.
   */
  "dropzone": string;

  /**
   * Classes for each file card root.
   */
  "item": string;

  /**
   * Classes for the selected-files list.
   */
  "list": string;

  /**
   * Classes for the media slot (icon or image preview).
   */
  "media": string;

  /**
   * Classes for the file name on a card.
   */
  "title": string;

  /**
   * Classes for the button-variant trigger wrapper.
   */
  "trigger": string;
}

/**
 * FileUpload size scale.
 */
export interface FileUploadSize {
  /**
   * Large size token.
   */
  "lg": FileUploadSizeItem;

  /**
   * Medium size token (default).
   */
  "md": FileUploadSizeItem;

  /**
   * Small size token.
   */
  "sm": FileUploadSizeItem;
}

/**
 * Default FileUpload size classes.
 */
export const sizeProps: FileUploadSize = {
  "md": {
    "list": "mt-3 flex flex-col gap-2",
    "trigger": "inline-flex items-center",
    "content": "flex min-w-0 flex-1 flex-col gap-0.5",
    "actions": "ms-auto flex shrink-0 items-center gap-1",
    "description": "m-0 truncate text-xs text-dark-500 dark:text-dark-400",
    "title":
      "m-0 truncate text-sm font-medium text-dark-900 dark:text-dark-100",
    "dropzone":
      "flex min-h-36 w-full flex-col items-center justify-center gap-1.5 rounded-lg px-6 py-10 text-center",
    "item":
      "flex w-full items-center gap-3 rounded-xl border border-dark-200 bg-white px-2.5 py-2 dark:border-dark-700 dark:bg-dark-900",
    "media":
      "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-dark-100 text-dark-500 dark:bg-dark-800 dark:text-dark-400 [&_img]:size-full [&_img]:object-cover [&_svg]:size-5",
  },
  "lg": {
    "list": "mt-4 flex flex-col gap-2.5",
    "trigger": "inline-flex items-center",
    "content": "flex min-w-0 flex-1 flex-col gap-1",
    "actions": "ms-auto flex shrink-0 items-center gap-1",
    "description": "m-0 truncate text-sm text-dark-500 dark:text-dark-400",
    "title":
      "m-0 truncate text-base font-medium text-dark-900 dark:text-dark-100",
    "dropzone":
      "flex min-h-44 w-full flex-col items-center justify-center gap-2 rounded-xl px-8 py-14 text-center",
    "item":
      "flex w-full items-center gap-3 rounded-2xl border border-dark-200 bg-white px-3 py-2.5 dark:border-dark-700 dark:bg-dark-900",
    "media":
      "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-dark-100 text-dark-500 dark:bg-dark-800 dark:text-dark-400 [&_img]:size-full [&_img]:object-cover [&_svg]:size-6",
  },
  "sm": {
    "list": "mt-2 flex flex-col gap-1.5",
    "trigger": "inline-flex items-center",
    "content": "flex min-w-0 flex-1 flex-col gap-0.5",
    "actions": "ms-auto flex shrink-0 items-center gap-0.5",
    "title":
      "m-0 truncate text-xs font-medium text-dark-900 dark:text-dark-100",
    "description":
      "m-0 truncate text-[0.65rem] text-dark-500 dark:text-dark-400",
    "dropzone":
      "flex min-h-28 w-full flex-col items-center justify-center gap-1 rounded-md px-4 py-6 text-center",
    "item":
      "flex w-full items-center gap-2 rounded-lg border border-dark-200 bg-white px-2 py-1.5 dark:border-dark-700 dark:bg-dark-900",
    "media":
      "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-dark-100 text-dark-500 dark:bg-dark-800 dark:text-dark-400 [&_img]:size-full [&_img]:object-cover [&_svg]:size-4",
  },
};
