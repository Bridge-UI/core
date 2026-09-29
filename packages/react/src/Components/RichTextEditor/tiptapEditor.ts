/**
 * TipTap editor mounted into a host node owned by `RichTextEditor`.
 * Framework-agnostic: `@tiptap/core` `Editor` against a DOM element.
 */

// ** External Imports
import { Editor } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { get, isNil, isString } from "es-toolkit/compat";

// ** Core Imports
import {
  applyRichTextEditableA11y,
  type RichTextA11yOptions,
  type RichTextFormat,
  type RichTextTool,
  type RichTextToolPayload,
  type RichTextValue,
} from "@bridge-ui/core/Domain";

/**
 * Editable class styled by the Bridge `theme.css`.
 */
const TIPTAP_EDITABLE_CLASS = "bridge-rich-text-editable";

/**
 * Options for {@link mountTiptapEditor}.
 */
export type TiptapMountOptions = {
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
   * Host element the editor mounts into.
   */
  element: HTMLElement;

  /**
   * Document format for `value` / `onChange` / handle get/set.
   */
  format: RichTextFormat;

  /**
   * Optional `id` applied to the editable root (for FormField label association).
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
   * Initial document for the mount `format`.
   */
  value?: RichTextValue;
};

/**
 * Per-editor handle returned by {@link mountTiptapEditor}.
 */
export type TiptapEditorHandle = {
  /**
   * Blurs the editable surface when supported.
   */
  blur: () => void;

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
};

/**
 * Reads the current document in the mount `format`.
 */
function readValue(editor: Editor, format: RichTextFormat): RichTextValue {
  if (format === "json") {
    return editor.getJSON() as RichTextValue;
  }

  return editor.getHTML();
}

/**
 * Updates the TipTap placeholder and refreshes empty-state decorations.
 */
function setTiptapPlaceholder(editor: Editor, placeholder: string): void {
  const extension = editor.extensionManager.extensions.find((item) => {
    return item.name === "placeholder";
  });

  if (isNil(extension) || extension.options.placeholder === placeholder) {
    return;
  }

  extension.options.placeholder = placeholder;
  editor.view.dispatch(editor.state.tr);
}

const TOOL_IS_ACTIVE: Record<RichTextTool, (editor: Editor) => boolean> = {
  bold: (editor) => editor.isActive("bold"),
  link: (editor) => editor.isActive("link"),
  italic: (editor) => editor.isActive("italic"),
  strike: (editor) => editor.isActive("strike"),
  codeBlock: (editor) => editor.isActive("codeBlock"),
  underline: (editor) => editor.isActive("underline"),
  blockquote: (editor) => editor.isActive("blockquote"),
  bulletList: (editor) => editor.isActive("bulletList"),
  orderedList: (editor) => editor.isActive("orderedList"),
  heading1: (editor) => editor.isActive("heading", { level: 1 }),
  heading2: (editor) => editor.isActive("heading", { level: 2 }),
  heading3: (editor) => editor.isActive("heading", { level: 3 }),
};

const TOOL_CAN_RUN: Record<RichTextTool, (editor: Editor) => boolean> = {
  link: () => true,
  bold: (editor) => editor.can().toggleBold(),
  italic: (editor) => editor.can().toggleItalic(),
  strike: (editor) => editor.can().toggleStrike(),
  codeBlock: (editor) => editor.can().toggleCodeBlock(),
  underline: (editor) => editor.can().toggleUnderline(),
  blockquote: (editor) => editor.can().toggleBlockquote(),
  bulletList: (editor) => editor.can().toggleBulletList(),
  orderedList: (editor) => editor.can().toggleOrderedList(),
  heading1: (editor) => editor.can().toggleHeading({ level: 1 }),
  heading2: (editor) => editor.can().toggleHeading({ level: 2 }),
  heading3: (editor) => editor.can().toggleHeading({ level: 3 }),
};

const TOOL_RUN: Record<
  RichTextTool,
  (editor: Editor, payload?: RichTextToolPayload) => void
> = {
  bold: (editor) => editor.chain().focus().toggleBold().run(),
  italic: (editor) => editor.chain().focus().toggleItalic().run(),
  strike: (editor) => editor.chain().focus().toggleStrike().run(),
  codeBlock: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  underline: (editor) => editor.chain().focus().toggleUnderline().run(),
  blockquote: (editor) => editor.chain().focus().toggleBlockquote().run(),
  bulletList: (editor) => editor.chain().focus().toggleBulletList().run(),
  orderedList: (editor) => editor.chain().focus().toggleOrderedList().run(),
  heading1: (editor) =>
    editor.chain().focus().toggleHeading({ level: 1 }).run(),
  heading2: (editor) =>
    editor.chain().focus().toggleHeading({ level: 2 }).run(),
  heading3: (editor) =>
    editor.chain().focus().toggleHeading({ level: 3 }).run(),
  link: (editor, payload) => {
    if (!isNil(payload?.href) && payload.href.length > 0) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: payload.href })
        .run();
      return;
    }

    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    }
  },
};

/**
 * Maps a Bridge tool id to TipTap `isActive`.
 */
function isToolActive(editor: Editor, tool: RichTextTool): boolean {
  return get(TOOL_IS_ACTIVE, tool, () => false)(editor);
}

/**
 * Whether `tool` can run in the current editor state.
 * Must not call `.focus()` — capability checks run on every toolbar render.
 */
function canRunTool(editor: Editor, tool: RichTextTool): boolean {
  return get(TOOL_CAN_RUN, tool, () => false)(editor);
}

/**
 * Runs a toolbar command on the TipTap editor.
 */
function runTool(
  editor: Editor,
  tool: RichTextTool,
  payload?: RichTextToolPayload,
): void {
  get(TOOL_RUN, tool, () => undefined)(editor, payload);
}

/**
 * Mounts a TipTap editor into `options.element` and returns a handle.
 */
export function mountTiptapEditor(
  options: TiptapMountOptions,
): TiptapEditorHandle {
  let disabled = options.disabled === true;
  let readOnly = options.readOnly === true;
  let destroyed = false;

  const editor = new Editor({
    autofocus: false,
    element: options.element,
    editable: !disabled && !readOnly,
    onSelectionUpdate: () => {
      options.onSelectionChange?.();
    },
    editorProps: {
      attributes: {
        class: TIPTAP_EDITABLE_CLASS,
      },
    },
    onUpdate: ({ editor: next }) => {
      options.onChange(readValue(next, options.format));
    },
    content:
      options.value ??
      (options.format === "json" ? { type: "doc", content: [] } : ""),
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
      }),
      Placeholder.configure({
        placeholder: options.placeholder ?? "",
      }),
    ],
  });

  applyRichTextEditableA11y(editor.view.dom, options);

  return {
    getValue: () => {
      return readValue(editor, options.format);
    },
    blur: () => {
      if (!destroyed) {
        editor.commands.blur();
      }
    },
    focus: () => {
      if (!destroyed) {
        editor.commands.focus();
      }
    },
    isActive: (tool: RichTextTool) => {
      return !destroyed && isToolActive(editor, tool);
    },
    destroy: () => {
      if (destroyed) {
        return;
      }

      destroyed = true;
      editor.destroy();
    },
    can: (tool: RichTextTool) => {
      if (destroyed || disabled || readOnly) {
        return false;
      }

      return canRunTool(editor, tool);
    },
    setDisabled: (next: boolean) => {
      if (destroyed) {
        return;
      }

      disabled = next;
      editor.setEditable(!disabled && !readOnly, false);
    },
    setReadOnly: (next: boolean) => {
      if (destroyed) {
        return;
      }

      readOnly = next;
      editor.setEditable(!disabled && !readOnly, false);
    },
    run: (tool: RichTextTool, payload?: RichTextToolPayload) => {
      if (destroyed || disabled || readOnly) {
        return;
      }

      runTool(editor, tool, payload);
    },
    setA11y: (next) => {
      if (destroyed) {
        return;
      }

      applyRichTextEditableA11y(editor.view.dom, next);
      setTiptapPlaceholder(editor, next.placeholder ?? "");
    },
    setValue: (value: RichTextValue) => {
      if (destroyed) {
        return;
      }

      const next =
        options.format === "html" ? (isString(value) ? value : "") : value;

      editor.commands.setContent(next, { emitUpdate: false });
    },
  };
}
