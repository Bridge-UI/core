// prettier-ignore
export interface FormFieldSizeItem {
  /**
   * Typography for the error message below the control.
   */
  "text": string;

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
      "input": "text-2xs px-0.5 py-0 h-full min-h-0 leading-tight",
    },
    "notched": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "input": "text-2xs px-0.5 py-0 h-full min-h-0 leading-tight",
    },
    "outline": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "input": "text-2xs px-0.5 py-0 h-full min-h-0 leading-tight",
    },
    "stacked": {
      "text": "text-2xs",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "padding": "px-1.5 pt-1",
      "container": "min-h-[2.75rem] h-auto",
      "input": "text-2xs px-0.5 pb-1 pt-0 h-5 min-h-0 leading-tight",
    },
    "underlined": {
      "text": "text-2xs",
      "container": "h-6",
      "padding": "px-1.5",
      "insetEnd": "pe-1.5",
      "insetStart": "ps-1.5",
      "input": "text-2xs px-0.5 py-0 h-full min-h-0 leading-tight",
    },
  },
  "xs": {
    "filled": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-7",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "input": "text-xs px-0.5 py-0 h-full min-h-0 leading-tight",
    },
    "notched": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-7",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "input": "text-xs px-0.5 py-0 h-full min-h-0 leading-tight",
    },
    "outline": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-7",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "input": "text-xs px-0.5 py-0 h-full min-h-0 leading-tight",
    },
    "stacked": {
      "text": "text-xs",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "padding": "px-2 pt-1",
      "container": "min-h-12 h-auto",
      "input": "text-xs px-0.5 pb-1 pt-0 h-6 min-h-0 leading-tight",
    },
    "underlined": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-7",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "input": "text-xs px-0.5 py-0 h-full min-h-0 leading-tight",
    },
  },
  "sm": {
    "filled": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-8",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "input": "text-xs px-1 py-0 h-full min-h-0 leading-normal",
    },
    "notched": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-8",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "input": "text-xs px-1 py-0 h-full min-h-0 leading-normal",
    },
    "outline": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-8",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "input": "text-xs px-1 py-0 h-full min-h-0 leading-normal",
    },
    "stacked": {
      "text": "text-xs",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "padding": "px-2 pt-1",
      "container": "min-h-[3.125rem] h-auto",
      "input": "text-xs px-1 pb-1 pt-0 h-7 min-h-0 leading-normal",
    },
    "underlined": {
      "text": "text-xs",
      "padding": "px-2",
      "container": "h-8",
      "insetEnd": "pe-2",
      "insetStart": "ps-2",
      "input": "text-xs px-1 py-0 h-full min-h-0 leading-normal",
    },
  },
  "md": {
    "filled": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "input": "text-sm px-1 py-0 h-full min-h-0 leading-normal",
    },
    "notched": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "input": "text-sm px-1 py-0 h-full min-h-0 leading-normal",
    },
    "outline": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "input": "text-sm px-1 py-0 h-full min-h-0 leading-normal",
    },
    "stacked": {
      "text": "text-sm",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "padding": "px-2.5 pt-1",
      "container": "min-h-[3.25rem] h-auto",
      "input": "text-sm px-1 pb-1.5 pt-0 h-8 min-h-0 leading-normal",
    },
    "underlined": {
      "text": "text-sm",
      "container": "h-9",
      "padding": "px-2.5",
      "insetEnd": "pe-2.5",
      "insetStart": "ps-2.5",
      "input": "text-sm px-1 py-0 h-full min-h-0 leading-normal",
    },
  },
  "lg": {
    "filled": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "input": "text-sm px-1.5 py-0 h-full min-h-0 leading-normal",
    },
    "notched": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "input": "text-sm px-1.5 py-0 h-full min-h-0 leading-normal",
    },
    "outline": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "input": "text-sm px-1.5 py-0 h-full min-h-0 leading-normal",
    },
    "stacked": {
      "text": "text-sm",
      "insetEnd": "pe-3",
      "insetStart": "ps-3",
      "padding": "px-3 pt-1",
      "container": "min-h-14 h-auto",
      "input": "text-sm px-1.5 pb-1.5 pt-0 h-9 min-h-0 leading-normal",
    },
    "underlined": {
      "text": "text-sm",
      "padding": "px-3",
      "insetEnd": "pe-3",
      "container": "h-10",
      "insetStart": "ps-3",
      "input": "text-sm px-1.5 py-0 h-full min-h-0 leading-normal",
    },
  },
  "xl": {
    "filled": {
      "text": "text-base",
      "container": "h-11",
      "padding": "px-3.5",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "input": "text-base px-2 py-0 h-full min-h-0 leading-normal",
    },
    "notched": {
      "text": "text-base",
      "container": "h-11",
      "padding": "px-3.5",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "input": "text-base px-2 py-0 h-full min-h-0 leading-normal",
    },
    "outline": {
      "text": "text-base",
      "container": "h-11",
      "padding": "px-3.5",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "input": "text-base px-2 py-0 h-full min-h-0 leading-normal",
    },
    "stacked": {
      "text": "text-base",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "padding": "px-3.5 pt-1.5",
      "container": "min-h-[3.75rem] h-auto",
      "input": "text-base px-2 pb-2 pt-0 h-9 min-h-0 leading-normal",
    },
    "underlined": {
      "text": "text-base",
      "container": "h-11",
      "padding": "px-3.5",
      "insetEnd": "pe-3.5",
      "insetStart": "ps-3.5",
      "input": "text-base px-2 py-0 h-full min-h-0 leading-normal",
    },
  },
  "2xl": {
    "filled": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "input": "text-lg px-2.5 py-0 h-full min-h-0 leading-normal",
    },
    "notched": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "input": "text-lg px-2.5 py-0 h-full min-h-0 leading-normal",
    },
    "outline": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "input": "text-lg px-2.5 py-0 h-full min-h-0 leading-normal",
    },
    "stacked": {
      "text": "text-lg",
      "insetEnd": "pe-4",
      "insetStart": "ps-4",
      "padding": "px-4 pt-1.5",
      "container": "min-h-16 h-auto",
      "input": "text-lg px-2.5 pb-2 pt-0 h-10 min-h-0 leading-normal",
    },
    "underlined": {
      "text": "text-lg",
      "padding": "px-4",
      "insetEnd": "pe-4",
      "container": "h-12",
      "insetStart": "ps-4",
      "input": "text-lg px-2.5 py-0 h-full min-h-0 leading-normal",
    },
  },
};
