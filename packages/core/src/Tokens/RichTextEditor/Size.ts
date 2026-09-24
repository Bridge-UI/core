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
 * Content typography comes from `@tailwindcss/typography` (`prose` in theme.css).
 */
export const sizeProps: RichTextEditorSize = {
  "lg": {
    "toolbarButton": "shrink-0 leading-none [&_svg]:block",
    "toolbar":
      "flex flex-wrap items-center gap-1 border-b border-dark-200 px-1.5 py-2 dark:border-dark-700",
    "content":
      "prose max-w-none dark:prose-invert min-h-36 w-full px-3.5 py-2.5 outline-none [&_.ProseMirror]:min-h-36 [&_.ProseMirror]:outline-none [&_.ql-editor]:min-h-36 [&_.ql-editor]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-dark-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
  },
  "md": {
    "toolbarButton": "shrink-0 leading-none [&_svg]:block",
    "toolbar":
      "flex flex-wrap items-center gap-0.5 border-b border-dark-200 px-1 py-1.5 dark:border-dark-700",
    "content":
      "prose prose-sm max-w-none dark:prose-invert min-h-28 w-full px-3 py-2 outline-none [&_.ProseMirror]:min-h-28 [&_.ProseMirror]:outline-none [&_.ql-editor]:min-h-28 [&_.ql-editor]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-dark-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
  },
  "sm": {
    "toolbarButton": "shrink-0 leading-none [&_svg]:block",
    "toolbar":
      "flex flex-wrap items-center gap-0.5 border-b border-dark-200 px-0.5 py-1 dark:border-dark-700",
    "content":
      "prose prose-sm max-w-none dark:prose-invert min-h-20 w-full px-2.5 py-1.5 outline-none [&_.ProseMirror]:min-h-20 [&_.ProseMirror]:outline-none [&_.ql-editor]:min-h-20 [&_.ql-editor]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-dark-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
  },
};
