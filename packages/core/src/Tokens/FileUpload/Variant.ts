/**
 * Per-token layout for FileUpload variants.
 */
export interface FileUploadVariantItem {
  /**
   * Classes for the dropzone / trigger surface.
   */
  "surface": string;
}

/**
 * FileUpload visual variants (`button` trigger vs `dropzone` surface).
 */
export interface FileUploadVariant {
  /**
   * Compact button trigger (hidden once a single file is selected).
   */
  "button": FileUploadVariantItem;

  /**
   * Large dashed drop surface.
   */
  "dropzone": FileUploadVariantItem;
}

/**
 * Default FileUpload variant classes.
 */
export const variantProps: FileUploadVariant = {
  "button": {
    "surface": "",
  },
  "dropzone": {
    "surface":
      "border border-dashed border-dark-300 bg-dark-50 text-dark-600 transition-colors dark:border-dark-600 dark:bg-dark-900/40 dark:text-dark-300",
  },
};
