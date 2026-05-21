// prettier-ignore
export interface TextFieldSizeItem {
  /**
   * Typography classes for the native `<input>`.
   */
  "input": string;

  /**
   * Min-height on the container when start/end slots or icons are present.
   */
  "container": string;

  /**
   * Padding on the container when there are no start/end slots.
   */
  "padding": string;

  /**
   * Inline-start padding on the container when the start slot is absent.
   */
  "insetStart": string;

  /**
   * Inline-end padding on the container when the end slot is absent.
   */
  "insetEnd": string;
}

// prettier-ignore
export interface TextFieldSize {
  "xs": TextFieldSizeItem;
  "sm": TextFieldSizeItem;
  "md": TextFieldSizeItem;
  "lg": TextFieldSizeItem;
  "xl": TextFieldSizeItem;
}

// prettier-ignore
export const sizeProps: TextFieldSize = {
  "xs": {
    "input": "text-xs",
    "insetEnd": "pe-2",
    "insetStart": "ps-2",
    "container": "min-h-8",
    "padding": "px-2 py-1",
  },
  "sm": {
    "input": "text-sm",
    "insetEnd": "pe-2.5",
    "insetStart": "ps-2.5",
    "container": "min-h-9",
    "padding": "px-2.5 py-1.5",
  },
  "md": {
    "input": "text-sm",
    "insetEnd": "pe-3",
    "insetStart": "ps-3",
    "padding": "px-3 py-2",
    "container": "min-h-10",
  },
  "lg": {
    "input": "text-base",
    "insetEnd": "pe-3.5",
    "insetStart": "ps-3.5",
    "container": "min-h-11",
    "padding": "px-3.5 py-2.5",
  },
  "xl": {
    "input": "text-lg",
    "insetEnd": "pe-4",
    "insetStart": "ps-4",
    "container": "min-h-12",
    "padding": "px-4 py-3",
  },
};
