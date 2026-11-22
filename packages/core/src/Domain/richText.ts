// ** External Imports
import { filter, forEach, isNil, isString, keys } from "es-toolkit/compat";

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
 * Toolbar action id used by `RichTextEditor` `tools`.
 */
export type RichTextTool = (typeof RICH_TEXT_TOOLS)[number];

/**
 * Controlled / emitted document format.
 */
export type RichTextFormat = "html" | "json";

/**
 * TipTap JSON document (`Editor.getJSON()`).
 */
export type RichTextJSON = Record<string, unknown>;

/**
 * Controlled document value for a given {@link RichTextFormat}.
 */
export type RichTextValue = string | RichTextJSON;

/**
 * Optional payload for a toolbar command (e.g. link `href`).
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
 * Accessibility and placeholder updates applied after mount.
 */
export type RichTextA11yOptions = {
  /**
   * Consumer `aria-*` attributes for the editable root (`aria-label`,
   * `aria-required`, …). Bridge-managed ones (`aria-describedby`,
   * `aria-invalid`, …) win; `null` / `undefined` remove the attribute.
   */
  ariaAttributes?: Record<string, unknown>;

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

  applyConsumerAriaAttributes(editable, options.ariaAttributes ?? {});

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
 * Consumer `aria-*` names applied per editable, so a later call can drop the
 * ones that went away.
 */
const consumerAriaNames = new WeakMap<HTMLElement, readonly string[]>();

/**
 * Sets the consumer `aria-*` attributes and removes the ones from the previous
 * call that are no longer passed.
 */
function applyConsumerAriaAttributes(
  editable: HTMLElement,
  attributes: Record<string, unknown>,
): void {
  const names = filter(keys(attributes), (name) => {
    return name.startsWith("aria-") && !isNil(attributes[name]);
  });

  forEach(consumerAriaNames.get(editable) ?? [], (name) => {
    if (!names.includes(name)) {
      editable.removeAttribute(name);
    }
  });

  forEach(names, (name) => {
    editable.setAttribute(name, String(attributes[name]));
  });

  consumerAriaNames.set(editable, names);
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
