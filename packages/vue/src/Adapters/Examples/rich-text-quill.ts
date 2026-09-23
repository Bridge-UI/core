/**
 * Quill rich-text adapter. Wire via `BridgeUIProvider` `global.richText`.
 * Requires the optional `quill` peer.
 *
 * Framework-agnostic: uses Quill against a host DOM node (Bridge owns the
 * toolbar — Quill’s built-in toolbar is disabled).
 *
 * Apps should import Quill core styles once (e.g. `quill/dist/quill.core.css`).
 * JSON format uses Quill’s Delta (`{ ops: [...] }`), not TipTap/ProseMirror JSON.
 */

// ** External Imports
import { isNil, isPlainObject, isString } from "es-toolkit/compat";
import type { Delta as QuillDelta } from "quill";
import Quill from "quill";

// ** Core Imports
import type {
  RichTextEditorAdapter,
  RichTextEditorHandle,
  RichTextFormat,
  RichTextJSON,
  RichTextMountOptions,
  RichTextTool,
  RichTextToolPayload,
  RichTextValue,
} from "@bridge-ui/core/Adapters";

type QuillFormats = Record<string, unknown>;

/**
 * Reads the current document in the mount `format`.
 */
function readValue(quill: Quill, format: RichTextFormat): RichTextValue {
  if (format === "json") {
    return quill.getContents() as unknown as RichTextJSON;
  }

  return quill.getSemanticHTML();
}

/**
 * Whether `value` looks like a Quill Delta document.
 */
function isQuillDelta(value: RichTextValue): value is RichTextJSON {
  return (
    isPlainObject(value) && Array.isArray((value as { ops?: unknown }).ops)
  );
}

/**
 * Applies HTML or Delta content without emitting Bridge `onChange`.
 */
function writeValue(
  quill: Quill,
  format: RichTextFormat,
  value: RichTextValue,
): void {
  if (format === "json") {
    if (isQuillDelta(value)) {
      quill.setContents(value as unknown as QuillDelta, "silent");
      return;
    }

    quill.setContents([], "silent");
    return;
  }

  const html = isString(value) ? value : "";

  quill.setContents([], "silent");

  if (html.length > 0) {
    quill.clipboard.dangerouslyPasteHTML(0, html, "silent");
  }
}

/**
 * Maps a Bridge tool id to Quill `getFormat` active state.
 */
function isToolActive(quill: Quill, tool: RichTextTool): boolean {
  const formats = quill.getFormat() as QuillFormats;

  switch (tool) {
    case "bold":
      return formats.bold === true;
    case "italic":
      return formats.italic === true;
    case "underline":
      return formats.underline === true;
    case "strike":
      return formats.strike === true;
    case "link":
      return isString(formats.link) && formats.link.length > 0;
    case "bulletList":
      return formats.list === "bullet";
    case "orderedList":
      return formats.list === "ordered";
    case "heading1":
      return formats.header === 1;
    case "heading2":
      return formats.header === 2;
    case "heading3":
      return formats.header === 3;
    case "blockquote":
      return formats.blockquote === true;
    case "codeBlock":
      return formats["code-block"] === true;
    default:
      return false;
  }
}

/**
 * Toggles a boolean Quill format.
 */
function toggleBooleanFormat(quill: Quill, name: string): void {
  const formats = quill.getFormat() as QuillFormats;

  quill.format(name, formats[name] === true ? false : true);
}

/**
 * Runs a toolbar command on the Quill editor.
 */
function runTool(
  quill: Quill,
  tool: RichTextTool,
  payload?: RichTextToolPayload,
): void {
  switch (tool) {
    case "bold":
      toggleBooleanFormat(quill, "bold");
      return;
    case "italic":
      toggleBooleanFormat(quill, "italic");
      return;
    case "underline":
      toggleBooleanFormat(quill, "underline");
      return;
    case "strike":
      toggleBooleanFormat(quill, "strike");
      return;
    case "link": {
      if (!isNil(payload?.href) && payload.href.length > 0) {
        quill.format("link", payload.href);
        return;
      }

      if (isToolActive(quill, "link")) {
        quill.format("link", false);
      }

      return;
    }
    case "bulletList": {
      const formats = quill.getFormat() as QuillFormats;

      quill.format("list", formats.list === "bullet" ? false : "bullet");
      return;
    }
    case "orderedList": {
      const formats = quill.getFormat() as QuillFormats;

      quill.format("list", formats.list === "ordered" ? false : "ordered");
      return;
    }
    case "heading1": {
      const formats = quill.getFormat() as QuillFormats;

      quill.format("header", formats.header === 1 ? false : 1);
      return;
    }
    case "heading2": {
      const formats = quill.getFormat() as QuillFormats;

      quill.format("header", formats.header === 2 ? false : 2);
      return;
    }
    case "heading3": {
      const formats = quill.getFormat() as QuillFormats;

      quill.format("header", formats.header === 3 ? false : 3);
      return;
    }
    case "blockquote":
      toggleBooleanFormat(quill, "blockquote");
      return;
    case "codeBlock":
      toggleBooleanFormat(quill, "code-block");
      return;
    default:
      return;
  }
}

/**
 * Creates a Quill-backed {@link RichTextEditorAdapter} for Bridge UI.
 */
export function createQuillRichTextAdapter(): RichTextEditorAdapter {
  return {
    mount(options: RichTextMountOptions): RichTextEditorHandle {
      let disabled = options.disabled === true;
      let readOnly = options.readOnly === true;

      const quill = new Quill(options.element, {
        theme: "snow",
        readOnly: disabled || readOnly,
        placeholder: options.placeholder ?? "",
        modules: {
          toolbar: false,
        },
      });

      if (!isNil(options.value)) {
        writeValue(quill, options.format, options.value);
      }

      const onTextChange = (_delta: unknown, _old: unknown, source: string) => {
        if (source === "silent") {
          return;
        }

        options.onChange(readValue(quill, options.format));
      };

      const onSelectionChange = () => {
        options.onSelectionChange?.();
      };

      quill.on("text-change", onTextChange);
      quill.on("selection-change", onSelectionChange);

      const syncEditable = () => {
        quill.enable(!(disabled || readOnly));
      };

      return {
        focus: () => {
          quill.focus();
        },
        blur: () => {
          (quill.root as HTMLElement).blur();
        },
        getValue: () => {
          return readValue(quill, options.format);
        },
        isActive: (tool: RichTextTool) => {
          return isToolActive(quill, tool);
        },
        setDisabled: (next: boolean) => {
          disabled = next;
          syncEditable();
        },
        setReadOnly: (next: boolean) => {
          readOnly = next;
          syncEditable();
        },
        setValue: (value: RichTextValue) => {
          writeValue(quill, options.format, value);
        },
        can: (tool: RichTextTool) => {
          if (disabled || readOnly) {
            return false;
          }

          void tool;
          return true;
        },
        run: (tool: RichTextTool, payload?: RichTextToolPayload) => {
          if (disabled || readOnly) {
            return;
          }

          runTool(quill, tool, payload);
        },
        destroy: () => {
          quill.off("text-change", onTextChange);
          quill.off("selection-change", onSelectionChange);
          quill.disable();

          // Quill wraps the host; clear so remounts start clean.
          options.element.innerHTML = "";
          options.element.classList.remove("ql-container", "ql-snow");
        },
      };
    },
  };
}
