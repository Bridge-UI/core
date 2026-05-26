// prettier-ignore
export interface TextareaSizeItem {
  /**
   * Typography and padding for the native `<textarea>`.
   */
  "input": string;
}

// prettier-ignore
export interface TextareaSize {
  "2xs": TextareaSizeItem;
  "xs": TextareaSizeItem;
  "sm": TextareaSizeItem;
  "md": TextareaSizeItem;
  "lg": TextareaSizeItem;
  "xl": TextareaSizeItem;
  "2xl": TextareaSizeItem;
}

// prettier-ignore
export const sizeProps: TextareaSize = {
  "2xs": {
    "input": "text-2xs px-1.5 py-0.5",
  },
  "xs": {
    "input": "text-xs px-2 py-1",
  },
  "sm": {
    "input": "text-xs px-2 py-1.5",
  },
  "md": {
    "input": "text-sm px-3 py-2",
  },
  "lg": {
    "input": "text-sm px-3.5 py-2.5",
  },
  "xl": {
    "input": "text-base px-4 py-3",
  },
  "2xl": {
    "input": "text-lg px-4 py-3",
  },
};
