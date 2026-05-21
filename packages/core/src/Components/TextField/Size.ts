// prettier-ignore
export interface TextFieldSizeItem {
  /**
   * Typography and padding classes for the native `<input>`.
   */
  "input": string;

  /**
   * Min-height on the container when start/end slots are present.
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
  "2xs": TextFieldSizeItem;
  "xs": TextFieldSizeItem;
  "sm": TextFieldSizeItem;
  "md": TextFieldSizeItem;
  "lg": TextFieldSizeItem;
  "xl": TextFieldSizeItem;
  "2xl": TextFieldSizeItem;
}

// prettier-ignore
export const sizeProps: TextFieldSize = {
  "2xs": {
    "insetEnd": "pe-1.5",
    "insetStart": "ps-1.5",
    "container": "min-h-6",
    "padding": "px-1.5 py-0.5",
    "input": "text-2xs px-0.5 py-0.5 leading-tight",
  },
  "xs": {
    "insetEnd": "pe-2",
    "insetStart": "ps-2",
    "container": "min-h-7",
    "padding": "px-2 py-0.5",
    "input": "text-xs px-0.5 py-0.5 leading-tight",
  },
  "sm": {
    "insetEnd": "pe-2",
    "insetStart": "ps-2",
    "container": "min-h-8",
    "padding": "px-2 py-1",
    "input": "text-xs px-1 py-1 leading-normal",
  },
  "md": {
    "insetEnd": "pe-2.5",
    "insetStart": "ps-2.5",
    "container": "min-h-9",
    "padding": "px-2.5 py-1",
    "input": "text-sm px-1 py-1 leading-normal",
  },
  "lg": {
    "insetEnd": "pe-3",
    "insetStart": "ps-3",
    "container": "min-h-10",
    "padding": "px-3 py-1.5",
    "input": "text-sm px-1.5 py-1.5 leading-normal",
  },
  "xl": {
    "insetEnd": "pe-3.5",
    "insetStart": "ps-3.5",
    "container": "min-h-11",
    "padding": "px-3.5 py-2",
    "input": "text-base px-2 py-2 leading-normal",
  },
  "2xl": {
    "insetEnd": "pe-4",
    "insetStart": "ps-4",
    "container": "min-h-12",
    "padding": "px-4 py-2.5",
    "input": "text-lg px-2.5 py-2.5 leading-normal",
  },
};
