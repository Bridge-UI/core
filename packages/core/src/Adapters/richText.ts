// ** External Imports
import { isNil, isString } from "es-toolkit/compat";

/**
 * Toolbar actions Bridge knows about (v1).
 */
export const RICH_TEXT_TOOLS = [
  "bold",
  "link",
  "italic",
  "strike",
  "heading1",
  "heading2",
  "heading3",
  "codeBlock",
  "underline",
  "blockquote",
  "bulletList",
  "orderedList",
] as const;

/**
 * Toolbar action id used by {@link RichTextEditorAdapter} and public `tools` props.
 */
export type RichTextTool = (typeof RICH_TEXT_TOOLS)[number];

/**
 * Controlled / emitted document format.
 */
export type RichTextFormat = "html" | "json";

/**
 * Engine-agnostic JSON document.
 * Shape is defined by the mounted adapter (e.g. ProseMirror / TipTap JSON).
 */
export type RichTextJSON = Record<string, unknown>;

/**
 * Controlled document value for a given {@link RichTextFormat}.
 */
export type RichTextValue = string | RichTextJSON;

/**
 * Optional payload for {@link RichTextEditorHandle.run} (e.g. link `href`).
 */
export type RichTextToolPayload = {
  /**
   * Target URL when running the `link` tool.
   */
  href?: string;

  /**
   * Heading level when running a generic heading command.
   * Prefer `heading1` / `heading2` / `heading3` tools when possible.
   */
  level?: 1 | 2 | 3;
};

/**
 * Options passed to {@link RichTextEditorAdapter.mount}.
 */
export type RichTextMountOptions = {
  /**
   * `aria-describedby` on the editable root.
   */
  ariaDescribedBy?: string;

  /**
   * `aria-disabled` on the editable root.
   */
  ariaDisabled?: boolean;

  /**
   * `aria-invalid` on the editable root.
   */
  ariaInvalid?: boolean;

  /**
   * `aria-readonly` on the editable root.
   */
  ariaReadonly?: boolean;

  /**
   * Disable editing and command execution.
   */
  disabled?: boolean;

  /**
   * Host element the engine mounts into.
   */
  element: HTMLElement;

  /**
   * Document format for `value` / `onChange` / handle get/set.
   */
  format: RichTextFormat;

  /**
   * Optional `id` applied to the editable root (for FormField label association).
   * Prefer the contenteditable node, not a non-editable wrapper.
   */
  id?: string;

  /**
   * Called whenever the document changes.
   */
  onChange: (value: RichTextValue) => void;

  /**
   * Called when the selection changes (toolbar active state).
   */
  onSelectionChange?: () => void;

  /**
   * Empty-state hint in the content area.
   */
  placeholder?: string;

  /**
   * View-only surface; commands should no-op.
   */
  readOnly?: boolean;

  /**
   * Toolbar actions the editor should support.
   */
  tools: RichTextTool[];

  /**
   * Initial document for the mount `format`.
   */
  value?: RichTextValue;
};

/**
 * Accessibility and placeholder updates applied after mount.
 */
export type RichTextA11yOptions = {
  /**
   * `aria-describedby` on the editable root.
   */
  ariaDescribedBy?: string;

  /**
   * `aria-disabled` on the editable root.
   */
  ariaDisabled?: boolean;

  /**
   * `aria-invalid` on the editable root.
   */
  ariaInvalid?: boolean;

  /**
   * `aria-readonly` on the editable root.
   */
  ariaReadonly?: boolean;

  /**
   * Optional `id` on the editable root (FormField label association).
   */
  id?: string;

  /**
   * Empty-state hint in the content area.
   */
  placeholder?: string;
};

/**
 * Per-editor handle returned by {@link RichTextEditorAdapter.mount}.
 */
export interface RichTextEditorHandle {
  /**
   * Blurs the editable surface when supported.
   */
  blur?: () => void;

  /**
   * Whether `tool` can run in the current selection / state.
   */
  can: (tool: RichTextTool) => boolean;

  /**
   * Tears down the editor instance.
   */
  destroy: () => void;

  /**
   * Focuses the editable surface.
   */
  focus: () => void;

  /**
   * Returns the current document in the mount `format`.
   */
  getValue: () => RichTextValue;

  /**
   * Whether `tool` is active in the current selection.
   */
  isActive: (tool: RichTextTool) => boolean;

  /**
   * Runs a toolbar command (toggle mark, set link, …).
   */
  run: (tool: RichTextTool, payload?: RichTextToolPayload) => void;

  /**
   * Updates a11y attributes and the empty-state placeholder after mount.
   */
  setA11y: (options: RichTextA11yOptions) => void;

  /**
   * Updates the disabled flag after mount.
   */
  setDisabled: (disabled: boolean) => void;

  /**
   * Updates the read-only flag after mount.
   */
  setReadOnly: (readOnly: boolean) => void;

  /**
   * Replaces the document. Must match the mount `format`.
   */
  setValue: (value: RichTextValue) => void;
}

/**
 * Pluggable rich-text engine for Bridge UI.
 * Apps provide an adapter via `BridgeUIProvider` `global.richText`.
 *
 * Unlike Date / Icon / I18n adapters (singleton services), this is a
 * **factory**: each {@link mount} returns a per-instance handle.
 *
 * See `packages/{react,vue}/Adapters/Examples` for sample implementations.
 */
export interface RichTextEditorAdapter {
  /**
   * Mounts an editor into `options.element` and returns a handle.
   */
  mount: (options: RichTextMountOptions) => RichTextEditorHandle;
}

/**
 * Default toolbar set for RichTextEditor when `tools` is omitted.
 */
export const DEFAULT_RICH_TEXT_TOOLS: readonly RichTextTool[] = [
  "bold",
  "italic",
  "underline",
  "strike",
  "link",
  "bulletList",
  "orderedList",
  "heading1",
  "heading2",
  "heading3",
  "blockquote",
  "codeBlock",
];

/**
 * Accessible English labels for toolbar tools (gettext-style i18n keys).
 */
export const RICH_TEXT_TOOL_LABELS: Record<RichTextTool, string> = {
  bold: "Bold",
  link: "Link",
  italic: "Italic",
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  underline: "Underline",
  strike: "Strikethrough",
  codeBlock: "Code block",
  blockquote: "Blockquote",
  bulletList: "Bullet list",
  orderedList: "Ordered list",
};

/**
 * Semantic icon name for each toolbar tool.
 */
export const RICH_TEXT_TOOL_ICONS: Record<RichTextTool, string> = {
  bold: "bold",
  link: "link",
  italic: "italic",
  codeBlock: "code",
  bulletList: "list",
  blockquote: "quote",
  heading1: "heading1",
  heading2: "heading2",
  heading3: "heading3",
  underline: "underline",
  strike: "strikethrough",
  orderedList: "listOrdered",
};

/**
 * Applies Bridge a11y attributes to the engine's editable root.
 */
export function applyRichTextEditableA11y(
  editable: HTMLElement,
  options: RichTextA11yOptions,
): void {
  if (!isNil(options.id) && options.id.length > 0) {
    editable.id = options.id;
  }

  editable.setAttribute("role", "textbox");
  editable.setAttribute("aria-multiline", "true");

  if (options.ariaReadonly === true) {
    editable.setAttribute("aria-readonly", "true");
  } else {
    editable.removeAttribute("aria-readonly");
  }

  if (options.ariaDisabled === true) {
    editable.setAttribute("aria-disabled", "true");
  } else {
    editable.removeAttribute("aria-disabled");
  }

  if (options.ariaInvalid === true) {
    editable.setAttribute("aria-invalid", "true");
  } else {
    editable.removeAttribute("aria-invalid");
  }

  if (!isNil(options.ariaDescribedBy) && options.ariaDescribedBy.length > 0) {
    editable.setAttribute("aria-describedby", options.ariaDescribedBy);
  } else {
    editable.removeAttribute("aria-describedby");
  }
}

/**
 * Returns whether `value` is a known {@link RichTextTool}.
 */
export function isRichTextTool(value: unknown): value is RichTextTool {
  return (
    isString(value) && (RICH_TEXT_TOOLS as readonly string[]).includes(value)
  );
}

/**
 * Compares controlled values for sync (HTML string or JSON document).
 */
export function richTextValuesEqual(
  a: undefined | RichTextValue,
  b: undefined | RichTextValue,
): boolean {
  if (a === b) {
    return true;
  }

  if (isNil(a) || isNil(b)) {
    return false;
  }

  if (isString(a) || isString(b)) {
    return a === b;
  }

  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}
