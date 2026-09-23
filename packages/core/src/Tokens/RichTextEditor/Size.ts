/**
 * Per-token sizing for RichTextEditor toolbar, content, and tool buttons.
 */
export interface RichTextEditorSizeItem {
  /**
   * Classes for the editable content surface.
   */
  "content": string;

  /**
   * Classes for the toolbar row.
   */
  "toolbar": string;

  /**
   * Classes for each toolbar tool button.
   */
  "toolbarButton": string;
}

/**
 * RichTextEditor size scale.
 */
export interface RichTextEditorSize {
  /**
   * Large size token.
   */
  "lg": RichTextEditorSizeItem;

  /**
   * Medium size token (default).
   */
  "md": RichTextEditorSizeItem;

  /**
   * Small size token.
   */
  "sm": RichTextEditorSizeItem;
}

/**
 * Default RichTextEditor size classes.
 */
export const sizeProps: RichTextEditorSize = {
  "md": {
    "toolbarButton": "inline-flex size-8 shrink-0 items-center justify-center",
    "toolbar":
      "flex flex-wrap items-center gap-0.5 border-b border-dark-200 p-1 dark:border-dark-700",
    "content":
      "min-h-28 w-full px-3 py-2 text-sm text-dark-900 outline-none dark:text-dark-100 [&_.ProseMirror]:min-h-28 [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-dark-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
  },
  "lg": {
    "toolbarButton": "inline-flex size-9 shrink-0 items-center justify-center",
    "toolbar":
      "flex flex-wrap items-center gap-1 border-b border-dark-200 p-1.5 dark:border-dark-700",
    "content":
      "min-h-36 w-full px-3.5 py-2.5 text-base text-dark-900 outline-none dark:text-dark-100 [&_.ProseMirror]:min-h-36 [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-dark-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
  },
  "sm": {
    "toolbarButton": "inline-flex size-7 shrink-0 items-center justify-center",
    "toolbar":
      "flex flex-wrap items-center gap-0.5 border-b border-dark-200 p-0.5 dark:border-dark-700",
    "content":
      "min-h-20 w-full px-2.5 py-1.5 text-xs text-dark-900 outline-none dark:text-dark-100 [&_.ProseMirror]:min-h-20 [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-dark-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
  },
};
