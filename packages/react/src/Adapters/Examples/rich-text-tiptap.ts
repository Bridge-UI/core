/**
 * TipTap (ProseMirror) rich-text adapter. Wire via `BridgeUIProvider`
 * `global.richText`. Requires the optional `@tiptap/*` peers.
 *
 * Framework-agnostic: uses `@tiptap/core` `Editor` against a host DOM node.
 */

// ** External Imports
import { Editor } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { get, isNil, isString } from "es-toolkit/compat";

// ** Core Imports
import {
  applyRichTextEditableA11y,
  type RichTextEditorAdapter,
  type RichTextEditorHandle,
  type RichTextFormat,
  type RichTextMountOptions,
  type RichTextTool,
  type RichTextToolPayload,
  type RichTextValue,
} from "@bridge-ui/core/Adapters";

/**
 * Editable classes for this engine. Placeholder chrome stays here so core
 * tokens are not coupled to ProseMirror.
 */
const TIPTAP_EDITABLE_CLASS = [
  "flex-1",
  "outline-none",
  "[&_p.is-editor-empty:first-child::before]:h-0",
  "[&_p.is-editor-empty:first-child::before]:float-left",
  "[&_p.is-editor-empty:first-child::before]:text-dark-400",
  "[&_p.is-editor-empty:first-child::before]:pointer-events-none",
  "[&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
].join(" ");

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
 * Maps a Bridge tool id to TipTap `isActive` / command names.
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
 * Creates a TipTap-backed {@link RichTextEditorAdapter} for Bridge UI.
 */
export function createTiptapRichTextAdapter(): RichTextEditorAdapter {
  return {
    mount(options: RichTextMountOptions): RichTextEditorHandle {
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
    },
  };
}
