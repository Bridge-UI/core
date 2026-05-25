// prettier-ignore
export interface TextFieldSizeItem {
  /**
   * Fixed height on the input container (`<div>`), plain or with slots.
   */
  "container": string;

  /**
   * Horizontal padding on the container when no start/end slot is present.
   */
  "padding": string;

  /**
   * Typography and horizontal padding for the native `<input>`.
   */
  "input": string;

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
    "container": "h-6",
    "padding": "px-1.5",
    "insetEnd": "pe-1.5",
    "insetStart": "ps-1.5",
    "input": "text-2xs px-0.5 py-0 h-full min-h-0 leading-tight",
  },
  "xs": {
    "padding": "px-2",
    "container": "h-7",
    "insetEnd": "pe-2",
    "insetStart": "ps-2",
    "input": "text-xs px-0.5 py-0 h-full min-h-0 leading-tight",
  },
  "sm": {
    "padding": "px-2",
    "container": "h-8",
    "insetEnd": "pe-2",
    "insetStart": "ps-2",
    "input": "text-xs px-1 py-0 h-full min-h-0 leading-normal",
  },
  "md": {
    "container": "h-9",
    "padding": "px-2.5",
    "insetEnd": "pe-2.5",
    "insetStart": "ps-2.5",
    "input": "text-sm px-1 py-0 h-full min-h-0 leading-normal",
  },
  "lg": {
    "padding": "px-3",
    "insetEnd": "pe-3",
    "container": "h-10",
    "insetStart": "ps-3",
    "input": "text-sm px-1.5 py-0 h-full min-h-0 leading-normal",
  },
  "xl": {
    "container": "h-11",
    "padding": "px-3.5",
    "insetEnd": "pe-3.5",
    "insetStart": "ps-3.5",
    "input": "text-base px-2 py-0 h-full min-h-0 leading-normal",
  },
  "2xl": {
    "padding": "px-4",
    "insetEnd": "pe-4",
    "container": "h-12",
    "insetStart": "ps-4",
    "input": "text-lg px-2.5 py-0 h-full min-h-0 leading-normal",
  },
};
