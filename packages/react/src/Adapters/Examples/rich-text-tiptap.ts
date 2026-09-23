/**
 * TipTap (ProseMirror) rich-text adapter. Wire via `BridgeUIProvider`
 * `global.richText`. Requires the optional `@tiptap/*` peers.
 *
 * Framework-agnostic: uses `@tiptap/core` `Editor` against a host DOM node.
 */

// ** External Imports
import { Editor } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { isNil, isString } from "es-toolkit/compat";

// ** Core Imports
import type {
  RichTextEditorAdapter,
  RichTextEditorHandle,
  RichTextFormat,
  RichTextMountOptions,
  RichTextTool,
  RichTextToolPayload,
  RichTextValue,
} from "@bridge-ui/core/Adapters";

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
 * Maps a Bridge tool id to TipTap `isActive` / command names.
 */
function isToolActive(editor: Editor, tool: RichTextTool): boolean {
  switch (tool) {
    case "bold":
      return editor.isActive("bold");
    case "italic":
      return editor.isActive("italic");
    case "underline":
      return editor.isActive("underline");
    case "strike":
      return editor.isActive("strike");
    case "link":
      return editor.isActive("link");
    case "bulletList":
      return editor.isActive("bulletList");
    case "orderedList":
      return editor.isActive("orderedList");
    case "heading1":
      return editor.isActive("heading", { level: 1 });
    case "heading2":
      return editor.isActive("heading", { level: 2 });
    case "heading3":
      return editor.isActive("heading", { level: 3 });
    case "blockquote":
      return editor.isActive("blockquote");
    case "codeBlock":
      return editor.isActive("codeBlock");
    default:
      return false;
  }
}

/**
 * Whether `tool` can run in the current editor state.
 */
function canRunTool(editor: Editor, tool: RichTextTool): boolean {
  switch (tool) {
    case "bold":
      return editor.can().chain().focus().toggleBold().run();
    case "italic":
      return editor.can().chain().focus().toggleItalic().run();
    case "underline":
      return editor.can().chain().focus().toggleUnderline().run();
    case "strike":
      return editor.can().chain().focus().toggleStrike().run();
    case "link":
      return true;
    case "bulletList":
      return editor.can().chain().focus().toggleBulletList().run();
    case "orderedList":
      return editor.can().chain().focus().toggleOrderedList().run();
    case "heading1":
      return editor.can().chain().focus().toggleHeading({ level: 1 }).run();
    case "heading2":
      return editor.can().chain().focus().toggleHeading({ level: 2 }).run();
    case "heading3":
      return editor.can().chain().focus().toggleHeading({ level: 3 }).run();
    case "blockquote":
      return editor.can().chain().focus().toggleBlockquote().run();
    case "codeBlock":
      return editor.can().chain().focus().toggleCodeBlock().run();
    default:
      return false;
  }
}

/**
 * Runs a toolbar command on the TipTap editor.
 */
function runTool(
  editor: Editor,
  tool: RichTextTool,
  payload?: RichTextToolPayload,
): void {
  switch (tool) {
    case "bold":
      editor.chain().focus().toggleBold().run();
      return;
    case "italic":
      editor.chain().focus().toggleItalic().run();
      return;
    case "underline":
      editor.chain().focus().toggleUnderline().run();
      return;
    case "strike":
      editor.chain().focus().toggleStrike().run();
      return;
    case "link": {
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

      return;
    }
    case "bulletList":
      editor.chain().focus().toggleBulletList().run();
      return;
    case "orderedList":
      editor.chain().focus().toggleOrderedList().run();
      return;
    case "heading1":
      editor.chain().focus().toggleHeading({ level: 1 }).run();
      return;
    case "heading2":
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      return;
    case "heading3":
      editor.chain().focus().toggleHeading({ level: 3 }).run();
      return;
    case "blockquote":
      editor.chain().focus().toggleBlockquote().run();
      return;
    case "codeBlock":
      editor.chain().focus().toggleCodeBlock().run();
      return;
    default:
      return;
  }
}

/**
 * Creates a TipTap-backed {@link RichTextEditorAdapter} for Bridge UI.
 */
export function createTiptapRichTextAdapter(): RichTextEditorAdapter {
  return {
    mount(options: RichTextMountOptions): RichTextEditorHandle {
      let disabled = options.disabled === true;
      let readOnly = options.readOnly === true;

      const editor = new Editor({
        element: options.element,
        editable: !disabled && !readOnly,
        onSelectionUpdate: () => {
          options.onSelectionChange?.();
        },
        onUpdate: ({ editor: next }) => {
          options.onChange(readValue(next, options.format));
        },
        content:
          options.value ??
          (options.format === "json" ? { type: "doc", content: [] } : ""),
        extensions: [
          StarterKit,
          Underline,
          Link.configure({ openOnClick: false }),
          Placeholder.configure({
            placeholder: options.placeholder ?? "",
          }),
        ],
      });

      return {
        destroy: () => {
          editor.destroy();
        },
        blur: () => {
          editor.commands.blur();
        },
        focus: () => {
          editor.commands.focus();
        },
        getValue: () => {
          return readValue(editor, options.format);
        },
        isActive: (tool: RichTextTool) => {
          return isToolActive(editor, tool);
        },
        setDisabled: (next: boolean) => {
          disabled = next;
          editor.setEditable(!disabled && !readOnly, false);
        },
        setReadOnly: (next: boolean) => {
          readOnly = next;
          editor.setEditable(!disabled && !readOnly, false);
        },
        can: (tool: RichTextTool) => {
          if (disabled || readOnly) {
            return false;
          }

          return canRunTool(editor, tool);
        },
        run: (tool: RichTextTool, payload?: RichTextToolPayload) => {
          if (disabled || readOnly) {
            return;
          }

          runTool(editor, tool, payload);
        },
        setValue: (value: RichTextValue) => {
          const next =
            options.format === "html" ? (isString(value) ? value : "") : value;

          editor.commands.setContent(next, { emitUpdate: false });
        },
      };
    },
  };
}
