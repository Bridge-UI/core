/**
 * Layout classes for one FileUpload orientation.
 */
export interface FileUploadOrientationItem {
  /**
   * Classes for the actions cluster.
   */
  "actions": string;

  /**
   * Classes for the title + description stack.
   */
  "content": string;

  /**
   * Classes for each file card root.
   */
  "item": string;

  /**
   * Classes for the selected-files list.
   */
  "list": string;

  /**
   * Classes for the media slot.
   */
  "media": string;
}

/**
 * File card layout. `horizontal` places media beside the name.
 * `vertical` stacks the media above the name.
 */
export interface FileUploadOrientation {
  /**
   * Media beside the file name. List stacks cards.
   */
  "horizontal": FileUploadOrientationItem;

  /**
   * Media above the file name. List lays cards in a row.
   */
  "vertical": FileUploadOrientationItem;
}

/**
 * Default FileUpload orientation classes.
 * Later classes win over the size token when both set the same utility.
 */
export const orientationProps: FileUploadOrientation = {
  "horizontal": {
    "media": "",
    "content": "min-w-0 flex-1",
    "list": "flex-col flex-nowrap",
    "actions": "static end-auto top-auto z-auto ms-auto",
    "item": "static w-full max-w-none shrink flex-row items-center",
  },
  "vertical": {
    "list": "flex-row flex-wrap",
    "content": "w-full flex-none",
    "media": "aspect-square h-auto w-full",
    "actions": "absolute end-1 top-1 z-10 ms-0",
    "item": "relative w-28 max-w-full shrink-0 flex-col items-stretch",
  },
};
