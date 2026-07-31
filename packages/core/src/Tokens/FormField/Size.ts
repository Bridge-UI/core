export interface FormFieldSizeItem {
  /**
   * Fixed height on the input container (`<div>`), plain or with slots.
   * Stacked variants use `min-h-* h-auto` instead.
   */
  "container": string;

  /**
   * Min height and growth for the container when the control is a `<textarea>`.
   */
  "containerTextarea": string;

  /**
   * Container sizing when a `<textarea>` uses the compact TextField-like profile (`likeInput`).
   */
  "containerTextareaLikeInput": string;

  /**
   * Min height for the stacked control row (label + input adornments).
   */
  "controlRow"?: string;

  /**
   * Typography and block padding for the native control (`<input>`, etc.).
   */
  "input": string;

  /**
   * Inline-end padding on the container when the end slot is absent.
   */
  "insetEnd": string;

  /**
   * Inline-start padding on the container when the start slot is absent.
   */
  "insetStart": string;

  /**
   * Block-start padding on the stacked body when side slots are present.
   */
  "insetTop"?: string;

  /**
   * Horizontal padding on the container when no start/end slot is present.
   */
  "padding": string;

  /**
   * Typography for the error message below the control.
   */
  "text": string;

  /**
   * Typography and block padding for a native `<textarea>`.
   */
  "textarea": string;

  /**
   * Vertical padding for a `<textarea>` in the compact TextField-like profile (`likeInput`).
   */
  "textareaLikeInput": string;
}

export interface FormFieldSize {
  /**
   * Extra extra large size token (per variant).
   */
  "2xl": {
    /**
     * Filled variant sizing.
     */
    "filled": FormFieldSizeItem;
    /**
     * Notched outline variant sizing.
     */
    "notched": FormFieldSizeItem;
    /**
     * Outline variant sizing.
     */
    "outline": FormFieldSizeItem;
    /**
     * Stacked label variant sizing.
     */
    "stacked": FormFieldSizeItem;
    /**
     * Underlined variant sizing.
     */
    "underlined": FormFieldSizeItem;
  };

  /**
   * Extra extra small size token (per variant).
   */
  "2xs": {
    /**
     * Filled variant sizing.
     */
    "filled": FormFieldSizeItem;
    /**
     * Notched outline variant sizing.
     */
    "notched": FormFieldSizeItem;
    /**
     * Outline variant sizing.
     */
    "outline": FormFieldSizeItem;
    /**
     * Stacked label variant sizing.
     */
    "stacked": FormFieldSizeItem;
    /**
     * Underlined variant sizing.
     */
    "underlined": FormFieldSizeItem;
  };

  /**
   * Large size token (per variant).
   */
  "lg": {
    /**
     * Filled variant sizing.
     */
    "filled": FormFieldSizeItem;
    /**
     * Notched outline variant sizing.
     */
    "notched": FormFieldSizeItem;
    /**
     * Outline variant sizing.
     */
    "outline": FormFieldSizeItem;
    /**
     * Stacked label variant sizing.
     */
    "stacked": FormFieldSizeItem;
    /**
     * Underlined variant sizing.
     */
    "underlined": FormFieldSizeItem;
  };

  /**
   * Medium size token (per variant).
   */
  "md": {
    /**
     * Filled variant sizing.
     */
    "filled": FormFieldSizeItem;
    /**
     * Notched outline variant sizing.
     */
    "notched": FormFieldSizeItem;
    /**
     * Outline variant sizing.
     */
    "outline": FormFieldSizeItem;
    /**
     * Stacked label variant sizing.
     */
    "stacked": FormFieldSizeItem;
    /**
     * Underlined variant sizing.
     */
    "underlined": FormFieldSizeItem;
  };

  /**
   * Small size token (per variant).
   */
  "sm": {
    /**
     * Filled variant sizing.
     */
    "filled": FormFieldSizeItem;
    /**
     * Notched outline variant sizing.
     */
    "notched": FormFieldSizeItem;
    /**
     * Outline variant sizing.
     */
    "outline": FormFieldSizeItem;
    /**
     * Stacked label variant sizing.
     */
    "stacked": FormFieldSizeItem;
    /**
     * Underlined variant sizing.
     */
    "underlined": FormFieldSizeItem;
  };

  /**
   * Extra large size token (per variant).
   */
  "xl": {
    /**
     * Filled variant sizing.
     */
    "filled": FormFieldSizeItem;
    /**
     * Notched outline variant sizing.
     */
    "notched": FormFieldSizeItem;
    /**
     * Outline variant sizing.
     */
    "outline": FormFieldSizeItem;
    /**
     * Stacked label variant sizing.
     */
    "stacked": FormFieldSizeItem;
    /**
     * Underlined variant sizing.
     */
    "underlined": FormFieldSizeItem;
  };

  /**
   * Extra small size token (per variant).
   */
  "xs": {
    /**
     * Filled variant sizing.
     */
    "filled": FormFieldSizeItem;
    /**
     * Notched outline variant sizing.
     */
    "notched": FormFieldSizeItem;
    /**
     * Outline variant sizing.
     */
    "outline": FormFieldSizeItem;
    /**
     * Stacked label variant sizing.
     */
    "stacked": FormFieldSizeItem;
    /**
     * Underlined variant sizing.
     */
    "underlined": FormFieldSizeItem;
  };
}

export const sizeProps: FormFieldSize = {
  "xs": {
    "filled": {
      "text": "text-xs",
      "padding": "px-2",
      "insetEnd": "pe-2",
      "container": "h-7",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-16 h-auto",
      "containerTextareaLikeInput": "min-h-7 h-auto",
      "textareaLikeInput": "py-[calc((1.75rem-1lh)/2)]",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-tight",
      "textarea":
        "px-0 block text-xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
    "outline": {
      "text": "text-xs",
      "padding": "px-2",
      "insetEnd": "pe-2",
      "container": "h-7",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-16 h-auto",
      "containerTextareaLikeInput": "min-h-7 h-auto",
      "textareaLikeInput": "py-[calc((1.75rem-1lh)/2)]",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-tight",
      "textarea":
        "px-0 block text-xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
    "notched": {
      "text": "text-xs",
      "padding": "px-2",
      "insetEnd": "pe-2",
      "container": "h-7",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-16 h-auto",
      "containerTextareaLikeInput": "min-h-7 h-auto",
      "textareaLikeInput": "py-[calc((1.75rem-1lh)/2)]",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-tight",
      "textarea":
        "px-0 block text-xs min-h-0 leading-tight pt-3 pb-2 w-full h-auto",
    },
    "underlined": {
      "text": "text-xs",
      "padding": "px-2",
      "insetEnd": "pe-2",
      "container": "h-7",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-16 h-auto",
      "containerTextareaLikeInput": "min-h-7 h-auto",
      "textareaLikeInput": "py-[calc((1.75rem-1lh)/2)]",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-tight",
      "textarea":
        "px-0 block text-xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
    "stacked": {
      "text": "text-xs",
      "insetTop": "pt-1",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "padding": "px-2 pt-1",
      "controlRow": "min-h-6",
      "container": "min-h-12 h-auto",
      "textareaLikeInput": "py-1.25",
      "containerTextarea": "min-h-20 h-auto",
      "containerTextareaLikeInput": "min-h-12 h-auto",
      "input": "px-0 text-xs h-auto min-h-0 w-full py-0 leading-tight",
      "textarea":
        "px-0 block text-xs h-auto min-h-0 w-full py-1.5 leading-tight self-stretch",
    },
  },
  "2xl": {
    "filled": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "containerTextarea": "min-h-32 h-auto",
      "textareaLikeInput": "py-[calc((3rem-1lh)/2)]",
      "containerTextareaLikeInput": "min-h-12 h-auto",
      "input": "px-0 text-lg py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-lg min-h-0 leading-normal py-2 w-full h-auto",
    },
    "outline": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "containerTextarea": "min-h-32 h-auto",
      "textareaLikeInput": "py-[calc((3rem-1lh)/2)]",
      "containerTextareaLikeInput": "min-h-12 h-auto",
      "input": "px-0 text-lg py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-lg min-h-0 leading-normal py-2 w-full h-auto",
    },
    "underlined": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "containerTextarea": "min-h-32 h-auto",
      "textareaLikeInput": "py-[calc((3rem-1lh)/2)]",
      "containerTextareaLikeInput": "min-h-12 h-auto",
      "input": "px-0 text-lg py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-lg min-h-0 leading-normal py-2 w-full h-auto",
    },
    "notched": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "containerTextarea": "min-h-32 h-auto",
      "textareaLikeInput": "py-[calc((3rem-1lh)/2)]",
      "containerTextareaLikeInput": "min-h-12 h-auto",
      "input": "px-0 text-lg py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-lg min-h-0 leading-normal pt-3 pb-2 w-full h-auto",
    },
    "stacked": {
      "text": "text-lg",
      "insetEnd": "pe-4",
      "insetTop": "pt-1.5",
      "insetStart": "ps-4",
      "padding": "px-4 pt-1.5",
      "controlRow": "min-h-10",
      "container": "min-h-16 h-auto",
      "textareaLikeInput": "py-1.25",
      "containerTextarea": "min-h-36 h-auto",
      "containerTextareaLikeInput": "min-h-16 h-auto",
      "input": "px-0 text-lg h-auto min-h-0 w-full py-0 leading-normal",
      "textarea":
        "px-0 block text-lg h-auto min-h-0 w-full py-2 leading-normal self-stretch",
    },
  },
  "lg": {
    "filled": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "containerTextarea": "min-h-24 h-auto",
      "containerTextareaLikeInput": "min-h-10 h-auto",
      "textareaLikeInput": "py-[calc((2.5rem-1lh)/2)]",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
    "outline": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "containerTextarea": "min-h-24 h-auto",
      "containerTextareaLikeInput": "min-h-10 h-auto",
      "textareaLikeInput": "py-[calc((2.5rem-1lh)/2)]",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
    "underlined": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "containerTextarea": "min-h-24 h-auto",
      "containerTextareaLikeInput": "min-h-10 h-auto",
      "textareaLikeInput": "py-[calc((2.5rem-1lh)/2)]",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
    "notched": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "containerTextarea": "min-h-24 h-auto",
      "containerTextareaLikeInput": "min-h-10 h-auto",
      "textareaLikeInput": "py-[calc((2.5rem-1lh)/2)]",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-sm min-h-0 leading-normal pt-3 pb-2 w-full h-auto",
    },
    "stacked": {
      "text": "text-sm",
      "insetTop": "pt-1",
      "insetEnd": "pe-3",
      "insetStart": "ps-3",
      "padding": "px-3 pt-1",
      "controlRow": "min-h-9",
      "container": "min-h-14 h-auto",
      "textareaLikeInput": "py-1.25",
      "containerTextarea": "min-h-28 h-auto",
      "containerTextareaLikeInput": "min-h-14 h-auto",
      "input": "px-0 text-sm h-auto min-h-0 w-full py-0 leading-normal",
      "textarea":
        "px-0 block text-sm h-auto min-h-0 w-full py-2 leading-normal self-stretch",
    },
  },
  "sm": {
    "filled": {
      "text": "text-xs",
      "padding": "px-2",
      "insetEnd": "pe-2",
      "container": "h-8",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-[4.5rem] h-auto",
      "textareaLikeInput": "py-[calc((2rem-1lh)/2)]",
      "containerTextareaLikeInput": "min-h-8 h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-xs min-h-0 leading-normal py-1.5 w-full h-auto",
    },
    "outline": {
      "text": "text-xs",
      "padding": "px-2",
      "insetEnd": "pe-2",
      "container": "h-8",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-[4.5rem] h-auto",
      "textareaLikeInput": "py-[calc((2rem-1lh)/2)]",
      "containerTextareaLikeInput": "min-h-8 h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-xs min-h-0 leading-normal py-1.5 w-full h-auto",
    },
    "notched": {
      "text": "text-xs",
      "padding": "px-2",
      "insetEnd": "pe-2",
      "container": "h-8",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-[4.5rem] h-auto",
      "textareaLikeInput": "py-[calc((2rem-1lh)/2)]",
      "containerTextareaLikeInput": "min-h-8 h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-xs min-h-0 leading-normal pt-3 pb-2 w-full h-auto",
    },
    "underlined": {
      "text": "text-xs",
      "padding": "px-2",
      "insetEnd": "pe-2",
      "container": "h-8",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-[4.5rem] h-auto",
      "textareaLikeInput": "py-[calc((2rem-1lh)/2)]",
      "containerTextareaLikeInput": "min-h-8 h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-xs min-h-0 leading-normal py-1.5 w-full h-auto",
    },
    "stacked": {
      "text": "text-xs",
      "insetTop": "pt-1",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "padding": "px-2 pt-1",
      "controlRow": "min-h-7",
      "textareaLikeInput": "py-1.25",
      "container": "min-h-[3.125rem] h-auto",
      "containerTextarea": "min-h-24 h-auto",
      "containerTextareaLikeInput": "min-h-[3.125rem] h-auto",
      "input": "px-0 text-xs h-auto min-h-0 w-full py-0 leading-normal",
      "textarea":
        "px-0 block text-xs h-auto min-h-0 w-full py-1.5 leading-normal self-stretch",
    },
  },
  "md": {
    "filled": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "containerTextarea": "min-h-20 h-auto",
      "containerTextareaLikeInput": "min-h-9 h-auto",
      "textareaLikeInput": "py-[calc((2.25rem-1lh)/2)]",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
    "outline": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "containerTextarea": "min-h-20 h-auto",
      "containerTextareaLikeInput": "min-h-9 h-auto",
      "textareaLikeInput": "py-[calc((2.25rem-1lh)/2)]",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
    "underlined": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "containerTextarea": "min-h-20 h-auto",
      "containerTextareaLikeInput": "min-h-9 h-auto",
      "textareaLikeInput": "py-[calc((2.25rem-1lh)/2)]",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
    "notched": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "containerTextarea": "min-h-20 h-auto",
      "containerTextareaLikeInput": "min-h-9 h-auto",
      "textareaLikeInput": "py-[calc((2.25rem-1lh)/2)]",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-sm min-h-0 leading-normal pt-3 pb-2 w-full h-auto",
    },
    "stacked": {
      "text": "text-sm",
      "insetTop": "pt-1",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "controlRow": "min-h-8",
      "padding": "px-2.5 pt-1",
      "textareaLikeInput": "py-1.25",
      "container": "min-h-[3.25rem] h-auto",
      "containerTextarea": "min-h-24 h-auto",
      "containerTextareaLikeInput": "min-h-[3.25rem] h-auto",
      "input": "px-0 text-sm h-auto min-h-0 w-full py-0 leading-normal",
      "textarea":
        "px-0 block text-sm h-auto min-h-0 w-full py-2 leading-normal self-stretch",
    },
  },
  "2xs": {
    "filled": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "containerTextarea": "min-h-16 h-auto",
      "containerTextareaLikeInput": "min-h-6 h-auto",
      "textareaLikeInput": "py-[calc((1.5rem-1lh)/2)]",
      "input": "px-0 text-2xs py-0 h-full min-h-0 leading-tight",
      "textarea":
        "px-0 block text-2xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
    "outline": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "containerTextarea": "min-h-16 h-auto",
      "containerTextareaLikeInput": "min-h-6 h-auto",
      "textareaLikeInput": "py-[calc((1.5rem-1lh)/2)]",
      "input": "px-0 text-2xs py-0 h-full min-h-0 leading-tight",
      "textarea":
        "px-0 block text-2xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
    "notched": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "containerTextarea": "min-h-16 h-auto",
      "containerTextareaLikeInput": "min-h-6 h-auto",
      "textareaLikeInput": "py-[calc((1.5rem-1lh)/2)]",
      "input": "px-0 text-2xs py-0 h-full min-h-0 leading-tight",
      "textarea":
        "px-0 block text-2xs min-h-0 leading-tight pt-3 pb-2 w-full h-auto",
    },
    "underlined": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "containerTextarea": "min-h-16 h-auto",
      "containerTextareaLikeInput": "min-h-6 h-auto",
      "textareaLikeInput": "py-[calc((1.5rem-1lh)/2)]",
      "input": "px-0 text-2xs py-0 h-full min-h-0 leading-tight",
      "textarea":
        "px-0 block text-2xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
    "stacked": {
      "text": "text-2xs",
      "insetTop": "pt-1",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "controlRow": "min-h-5",
      "padding": "px-1.5 pt-1",
      "textareaLikeInput": "py-1.25",
      "container": "min-h-[2.75rem] h-auto",
      "containerTextarea": "min-h-20 h-auto",
      "containerTextareaLikeInput": "min-h-[2.75rem] h-auto",
      "input": "px-0 text-2xs h-auto min-h-0 w-full py-0 leading-tight",
      "textarea":
        "px-0 block text-2xs h-auto min-h-0 w-full py-1.5 leading-tight self-stretch",
    },
  },
  "xl": {
    "filled": {
      "text": "text-base",
      "padding": "px-3.5",
      "container": "h-11",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "containerTextarea": "min-h-28 h-auto",
      "containerTextareaLikeInput": "min-h-11 h-auto",
      "textareaLikeInput": "py-[calc((2.75rem-1lh)/2)]",
      "input": "px-0 text-base py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-base min-h-0 leading-normal py-2 w-full h-auto",
    },
    "outline": {
      "text": "text-base",
      "padding": "px-3.5",
      "container": "h-11",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "containerTextarea": "min-h-28 h-auto",
      "containerTextareaLikeInput": "min-h-11 h-auto",
      "textareaLikeInput": "py-[calc((2.75rem-1lh)/2)]",
      "input": "px-0 text-base py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-base min-h-0 leading-normal py-2 w-full h-auto",
    },
    "underlined": {
      "text": "text-base",
      "padding": "px-3.5",
      "container": "h-11",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "containerTextarea": "min-h-28 h-auto",
      "containerTextareaLikeInput": "min-h-11 h-auto",
      "textareaLikeInput": "py-[calc((2.75rem-1lh)/2)]",
      "input": "px-0 text-base py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-base min-h-0 leading-normal py-2 w-full h-auto",
    },
    "notched": {
      "text": "text-base",
      "padding": "px-3.5",
      "container": "h-11",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "containerTextarea": "min-h-28 h-auto",
      "containerTextareaLikeInput": "min-h-11 h-auto",
      "textareaLikeInput": "py-[calc((2.75rem-1lh)/2)]",
      "input": "px-0 text-base py-0 h-full min-h-0 leading-normal",
      "textarea":
        "px-0 block text-base min-h-0 leading-normal pt-3 pb-2 w-full h-auto",
    },
    "stacked": {
      "text": "text-base",
      "insetTop": "pt-1.5",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "controlRow": "min-h-9",
      "padding": "px-3.5 pt-1.5",
      "textareaLikeInput": "py-1.25",
      "container": "min-h-[3.75rem] h-auto",
      "containerTextarea": "min-h-32 h-auto",
      "containerTextareaLikeInput": "min-h-[3.75rem] h-auto",
      "input": "px-0 text-base h-auto min-h-0 w-full py-0 leading-normal",
      "textarea":
        "px-0 block text-base h-auto min-h-0 w-full py-2 leading-normal self-stretch",
    },
  },
};
