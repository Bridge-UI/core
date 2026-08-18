/**
 * Swatch sizing for ColorPicker presets and ColorField start preview.
 */
export interface ColorPickerSizeItem {
  /**
   * Start swatch inside ColorField, aligned with FormField density.
   */
  "fieldSwatch": string;

  /**
   * Preset swatch inside ColorPicker.
   */
  "swatch": string;
}

/**
 * ColorPicker size scale aligned with FormField (`2xs` … `2xl`).
 */
export interface ColorPickerSize {
  /**
   * Size scale token `2xl`.
   */
  "2xl": ColorPickerSizeItem;

  /**
   * Size scale token `2xs`.
   */
  "2xs": ColorPickerSizeItem;

  /**
   * Size scale token `lg`.
   */
  "lg": ColorPickerSizeItem;

  /**
   * Size scale token `md`.
   */
  "md": ColorPickerSizeItem;

  /**
   * Size scale token `sm`.
   */
  "sm": ColorPickerSizeItem;

  /**
   * Size scale token `xl`.
   */
  "xl": ColorPickerSizeItem;

  /**
   * Size scale token `xs`.
   */
  "xs": ColorPickerSizeItem;
}

export const sizeProps: ColorPickerSize = {
  "xs": {
    "swatch": "h-5 w-5",
    "fieldSwatch": "h-3 w-3",
  },
  "md": {
    "swatch": "h-6 w-6",
    "fieldSwatch": "h-4 w-4",
  },
  "xl": {
    "swatch": "h-7 w-7",
    "fieldSwatch": "h-5 w-5",
  },
  "2xl": {
    "swatch": "h-8 w-8",
    "fieldSwatch": "h-6 w-6",
  },
  "sm": {
    "swatch": "h-5 w-5",
    "fieldSwatch": "h-3.5 w-3.5",
  },
  "lg": {
    "swatch": "h-6 w-6",
    "fieldSwatch": "h-4.5 w-4.5",
  },
  "2xs": {
    "swatch": "h-4 w-4",
    "fieldSwatch": "h-2.5 w-2.5",
  },
};
