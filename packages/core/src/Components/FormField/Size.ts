// prettier-ignore
export interface FormFieldSizeItem {
  /**
   * Typography for the error message below the control.
   */
  "text": string;

  /**
   * Typography and block padding for the native control (`<input>`, etc.).
   */
  "input": string;

  /**
   * Horizontal padding on the container when no start/end slot is present.
   */
  "padding": string;

  /**
   * Typography and block padding for a native `<textarea>` or other multiline / growing control.
   */
  "textarea": string;

  /**
   * Inline-end padding on the container when the end slot is absent.
   */
  "insetEnd": string;

  /**
   * Block-start padding on the stacked body when side slots are present.
   */
  "insetTop"?: string;

  /**
   * Fixed height on the input container (`<div>`), plain or with slots.
   */
  "container": string;

  /**
   * Min height for the stacked control row (label + input adornments).
   */
  "controlRow"?: string;

  /**
   * Inline-start padding on the container when the start slot is absent.
   */
  "insetStart": string;

  /**
   * Min height and growth for the container when the control is a `<textarea>`.
   */
  "containerTextarea": string;
}

// prettier-ignore
export interface FormFieldSize {
  "2xs": {
    "filled": FormFieldSizeItem;
    "notched": FormFieldSizeItem;
    "outline": FormFieldSizeItem;
    "stacked": FormFieldSizeItem;
    "underlined": FormFieldSizeItem;
  };
  "xs": {
    "filled": FormFieldSizeItem;
    "notched": FormFieldSizeItem;
    "outline": FormFieldSizeItem;
    "stacked": FormFieldSizeItem;
    "underlined": FormFieldSizeItem;
  };
  "sm": {
    "filled": FormFieldSizeItem;
    "notched": FormFieldSizeItem;
    "outline": FormFieldSizeItem;
    "stacked": FormFieldSizeItem;
    "underlined": FormFieldSizeItem;
  };
  "md": {
    "filled": FormFieldSizeItem;
    "notched": FormFieldSizeItem;
    "outline": FormFieldSizeItem;
    "stacked": FormFieldSizeItem;
    "underlined": FormFieldSizeItem;
  };
  "lg": {
    "filled": FormFieldSizeItem;
    "notched": FormFieldSizeItem;
    "outline": FormFieldSizeItem;
    "stacked": FormFieldSizeItem;
    "underlined": FormFieldSizeItem;
  };
  "xl": {
    "filled": FormFieldSizeItem;
    "notched": FormFieldSizeItem;
    "outline": FormFieldSizeItem;
    "stacked": FormFieldSizeItem;
    "underlined": FormFieldSizeItem;
  };
  "2xl": {
    "filled": FormFieldSizeItem;
    "notched": FormFieldSizeItem;
    "outline": FormFieldSizeItem;
    "stacked": FormFieldSizeItem;
    "underlined": FormFieldSizeItem;
  };
}

// prettier-ignore
export const sizeProps: FormFieldSize = {
  "2xs": {
    "filled": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "containerTextarea": "min-h-16 h-auto",
      "input": "px-0 text-2xs py-0 h-full min-h-0 leading-tight",
      "textarea": "px-0 block text-2xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
    "notched": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "containerTextarea": "min-h-16 h-auto",
      "input": "px-0 text-2xs py-0 h-full min-h-0 leading-tight",
      "textarea": "px-0 block text-2xs min-h-0 leading-tight pt-3 pb-2 w-full h-auto",
    },
    "outline": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "containerTextarea": "min-h-16 h-auto",
      "input": "px-0 text-2xs py-0 h-full min-h-0 leading-tight",
      "textarea": "px-0 block text-2xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
    "stacked": {
      "text": "text-2xs",
      "insetTop": "pt-1",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "controlRow": "min-h-5",
      "padding": "px-1.5 pt-1",
      "container": "min-h-[2.75rem] h-auto",
      "containerTextarea": "min-h-20 h-auto",
      "input": "px-0 text-2xs h-auto min-h-0 w-full py-0 leading-tight",
      "textarea": "px-0 block text-2xs h-auto min-h-0 w-full py-1.5 leading-tight self-stretch",
    },
    "underlined": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "containerTextarea": "min-h-16 h-auto",
      "input": "px-0 text-2xs py-0 h-full min-h-0 leading-tight",
      "textarea": "px-0 block text-2xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
  },
  "xs": {
    "filled": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-7",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-16 h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-tight",
      "textarea": "px-0 block text-xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
    "notched": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-7",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-16 h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-tight",
      "textarea": "px-0 block text-xs min-h-0 leading-tight pt-3 pb-2 w-full h-auto",
    },
    "outline": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-7",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-16 h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-tight",
      "textarea": "px-0 block text-xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
    "stacked": {
      "text": "text-xs",
      "insetTop": "pt-1",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "padding": "px-2 pt-1",
      "controlRow": "min-h-6",
      "container": "min-h-12 h-auto",
      "containerTextarea": "min-h-20 h-auto",
      "input": "px-0 text-xs h-auto min-h-0 w-full py-0 leading-tight",
      "textarea": "px-0 block text-xs h-auto min-h-0 w-full py-1.5 leading-tight self-stretch",
    },
    "underlined": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-7",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-16 h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-tight",
      "textarea": "px-0 block text-xs min-h-0 leading-tight py-1.5 w-full h-auto",
    },
  },
  "sm": {
    "filled": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-8",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-[4.5rem] h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-xs min-h-0 leading-normal py-1.5 w-full h-auto",
    },
    "notched": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-8",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-[4.5rem] h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-xs min-h-0 leading-normal pt-3 pb-2 w-full h-auto",
    },
    "outline": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-8",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-[4.5rem] h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-xs min-h-0 leading-normal py-1.5 w-full h-auto",
    },
    "stacked": {
      "text": "text-xs",
      "insetTop": "pt-1",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "padding": "px-2 pt-1",
      "controlRow": "min-h-7",
      "container": "min-h-[3.125rem] h-auto",
      "containerTextarea": "min-h-24 h-auto",
      "input": "px-0 text-xs h-auto min-h-0 w-full py-0 leading-normal",
      "textarea": "px-0 block text-xs h-auto min-h-0 w-full py-1.5 leading-normal self-stretch",
    },
    "underlined": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-8",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "containerTextarea": "min-h-[4.5rem] h-auto",
      "input": "px-0 text-xs py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-xs min-h-0 leading-normal py-1.5 w-full h-auto",
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
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
    "notched": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "containerTextarea": "min-h-20 h-auto",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-sm min-h-0 leading-normal pt-3 pb-2 w-full h-auto",
    },
    "outline": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "containerTextarea": "min-h-20 h-auto",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
    "stacked": {
      "text": "text-sm",
      "insetTop": "pt-1",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "controlRow": "min-h-8",
      "padding": "px-2.5 pt-1",
      "container": "min-h-[3.25rem] h-auto",
      "containerTextarea": "min-h-24 h-auto",
      "input": "px-0 text-sm h-auto min-h-0 w-full py-0 leading-normal",
      "textarea": "px-0 block text-sm h-auto min-h-0 w-full py-2 leading-normal self-stretch",
    },
    "underlined": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "containerTextarea": "min-h-20 h-auto",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
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
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
    "notched": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "containerTextarea": "min-h-24 h-auto",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-sm min-h-0 leading-normal pt-3 pb-2 w-full h-auto",
    },
    "outline": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "containerTextarea": "min-h-24 h-auto",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
    "stacked": {
      "text": "text-sm",
      "insetTop": "pt-1",
      "insetEnd": "pe-3",
      "insetStart": "ps-3",
      "padding": "px-3 pt-1",
      "controlRow": "min-h-9",
      "container": "min-h-14 h-auto",
      "containerTextarea": "min-h-28 h-auto",
      "input": "px-0 text-sm h-auto min-h-0 w-full py-0 leading-normal",
      "textarea": "px-0 block text-sm h-auto min-h-0 w-full py-2 leading-normal self-stretch",
    },
    "underlined": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "containerTextarea": "min-h-24 h-auto",
      "input": "px-0 text-sm py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-sm min-h-0 leading-normal py-2 w-full h-auto",
    },
  },
  "xl": {
    "filled": {
      "text": "text-base",
      "container": "h-11",
      "padding": "px-3.5",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "containerTextarea": "min-h-28 h-auto",
      "input": "px-0 text-base py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-base min-h-0 leading-normal py-2 w-full h-auto",
    },
    "notched": {
      "text": "text-base",
      "container": "h-11",
      "padding": "px-3.5",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "containerTextarea": "min-h-28 h-auto",
      "input": "px-0 text-base py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-base min-h-0 leading-normal pt-3 pb-2 w-full h-auto",
    },
    "outline": {
      "text": "text-base",
      "container": "h-11",
      "padding": "px-3.5",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "containerTextarea": "min-h-28 h-auto",
      "input": "px-0 text-base py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-base min-h-0 leading-normal py-2 w-full h-auto",
    },
    "stacked": {
      "text": "text-base",
      "insetTop": "pt-1.5",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "controlRow": "min-h-9",
      "padding": "px-3.5 pt-1.5",
      "container": "min-h-[3.75rem] h-auto",
      "containerTextarea": "min-h-32 h-auto",
      "input": "px-0 text-base h-auto min-h-0 w-full py-0 leading-normal",
      "textarea": "px-0 block text-base h-auto min-h-0 w-full py-2 leading-normal self-stretch",
    },
    "underlined": {
      "text": "text-base",
      "container": "h-11",
      "padding": "px-3.5",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "containerTextarea": "min-h-28 h-auto",
      "input": "px-0 text-base py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-base min-h-0 leading-normal py-2 w-full h-auto",
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
      "input": "px-0 text-lg py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-lg min-h-0 leading-normal py-2 w-full h-auto",
    },
    "notched": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "containerTextarea": "min-h-32 h-auto",
      "input": "px-0 text-lg py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-lg min-h-0 leading-normal pt-3 pb-2 w-full h-auto",
    },
    "outline": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "containerTextarea": "min-h-32 h-auto",
      "input": "px-0 text-lg py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-lg min-h-0 leading-normal py-2 w-full h-auto",
    },
    "stacked": {
      "text": "text-lg",
      "insetEnd": "pe-4",
      "insetTop": "pt-1.5",
      "insetStart": "ps-4",
      "padding": "px-4 pt-1.5",
      "controlRow": "min-h-10",
      "container": "min-h-16 h-auto",
      "containerTextarea": "min-h-36 h-auto",
      "input": "px-0 text-lg h-auto min-h-0 w-full py-0 leading-normal",
      "textarea": "px-0 block text-lg h-auto min-h-0 w-full py-2 leading-normal self-stretch",
    },
    "underlined": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "containerTextarea": "min-h-32 h-auto",
      "input": "px-0 text-lg py-0 h-full min-h-0 leading-normal",
      "textarea": "px-0 block text-lg min-h-0 leading-normal py-2 w-full h-auto",
    },
  },
};
