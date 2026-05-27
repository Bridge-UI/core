// prettier-ignore
export interface FormFieldSizeItem {
  /**
   * Typography for the error message below the control.
   */
  "error": string;

  /**
   * Typography for the primary label in the header row.
   */
  "label": string;

  /**
   * Typography for the corner label in the header row.
   */
  "corner": string;

  /**
   * Typography for the helper text below the control.
   */
  "description": string;

  /**
   * Fixed height on the input container (`<div>`), plain or with slots.
   */
  "container": string;

  /**
   * Horizontal padding on the container when no start/end slot is present.
   */
  "padding": string;

  /**
   * Typography and horizontal padding for the native control (`<input>`, etc.).
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
export interface FormFieldSize {
  "2xs": FormFieldSizeItem;
  "xs": FormFieldSizeItem;
  "sm": FormFieldSizeItem;
  "md": FormFieldSizeItem;
  "lg": FormFieldSizeItem;
  "xl": FormFieldSizeItem;
  "2xl": FormFieldSizeItem;
}

// prettier-ignore
export const sizeProps: FormFieldSize = {
  "2xs": {
    "error": "text-2xs",
    "label": "text-2xs",
    "corner": "text-2xs",
    "description": "text-2xs",
    "container": "h-6",
    "padding": "px-1.5",
    "insetEnd": "pe-1.5",
    "insetStart": "ps-1.5",
    "input": "text-2xs px-0.5 py-0 h-full min-h-0 leading-tight",
  },
  "xs": {
    "error": "text-xs",
    "label": "text-xs",
    "corner": "text-xs",
    "description": "text-xs",
    "padding": "px-2",
    "container": "h-7",
    "insetEnd": "pe-2",
    "insetStart": "ps-2",
    "input": "text-xs px-0.5 py-0 h-full min-h-0 leading-tight",
  },
  "sm": {
    "error": "text-xs",
    "label": "text-xs",
    "corner": "text-xs",
    "description": "text-xs",
    "padding": "px-2",
    "container": "h-8",
    "insetEnd": "pe-2",
    "insetStart": "ps-2",
    "input": "text-xs px-1 py-0 h-full min-h-0 leading-normal",
  },
  "md": {
    "error": "text-sm",
    "label": "text-sm",
    "corner": "text-sm",
    "description": "text-sm",
    "container": "h-9",
    "padding": "px-2.5",
    "insetEnd": "pe-2.5",
    "insetStart": "ps-2.5",
    "input": "text-sm px-1 py-0 h-full min-h-0 leading-normal",
  },
  "lg": {
    "error": "text-sm",
    "label": "text-sm",
    "corner": "text-sm",
    "description": "text-sm",
    "padding": "px-3",
    "insetEnd": "pe-3",
    "container": "h-10",
    "insetStart": "ps-3",
    "input": "text-sm px-1.5 py-0 h-full min-h-0 leading-normal",
  },
  "xl": {
    "error": "text-base",
    "label": "text-base",
    "corner": "text-base",
    "description": "text-base",
    "container": "h-11",
    "padding": "px-3.5",
    "insetEnd": "pe-3.5",
    "insetStart": "ps-3.5",
    "input": "text-base px-2 py-0 h-full min-h-0 leading-normal",
  },
  "2xl": {
    "error": "text-lg",
    "label": "text-lg",
    "corner": "text-lg",
    "description": "text-lg",
    "padding": "px-4",
    "insetEnd": "pe-4",
    "container": "h-12",
    "insetStart": "ps-4",
    "input": "text-lg px-2.5 py-0 h-full min-h-0 leading-normal",
  },
};
