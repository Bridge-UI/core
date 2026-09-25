/**
 * Chrome classes for one file-card upload state.
 */
export interface FileUploadStateItem {
  /**
   * Classes for the metadata line.
   */
  "description": string;

  /**
   * Classes for the card root.
   */
  "item": string;

  /**
   * Classes for the media slot.
   */
  "media": string;

  /**
   * Classes for the file name.
   */
  "title": string;
}

/**
 * Upload-state chrome. Applied only when the item has a `state`.
 */
export interface FileUploadState {
  /**
   * Finished upload.
   */
  "done": FileUploadStateItem;

  /**
   * Failed upload.
   */
  "error": FileUploadStateItem;

  /**
   * Selected, not uploading yet.
   */
  "idle": FileUploadStateItem;

  /**
   * Server-side work after the bytes are sent.
   */
  "processing": FileUploadStateItem;

  /**
   * Bytes in flight.
   */
  "uploading": FileUploadStateItem;
}

/**
 * Default upload-state classes.
 */
export const stateProps: FileUploadState = {
  "done": {
    "item": "",
    "media": "",
    "title": "",
    "description": "",
  },
  "idle": {
    "media": "",
    "title": "",
    "description": "",
    "item": "border-dashed",
  },
  "uploading": {
    "item": "",
    "media": "",
    "description": "",
    "title": "animate-pulse",
  },
  "processing": {
    "item": "",
    "media": "",
    "description": "",
    "title": "animate-pulse",
  },
  "error": {
    "title": "text-error-700 dark:text-error-300",
    "item": "border-error-300 dark:border-error-700",
    "description": "text-error-600 dark:text-error-400",
    "media":
      "bg-error-50 text-error-600 dark:bg-error-950/40 dark:text-error-300",
  },
};
