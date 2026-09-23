/**
 * Minimal contenteditable mock for RichTextEditor component tests.
 * Avoids pulling TipTap into Vitest / Cypress component suites.
 */

// ** Core Imports
import type {
  RichTextEditorAdapter,
  RichTextEditorHandle,
  RichTextMountOptions,
  RichTextTool,
  RichTextValue,
} from "@bridge-ui/core/Adapters";

/**
 * Creates a lightweight {@link RichTextEditorAdapter} for tests.
 */
export function createMockRichTextAdapter(): RichTextEditorAdapter {
  return {
    mount(options: RichTextMountOptions): RichTextEditorHandle {
      const { element } = options;
      let disabled = options.disabled === true;
      let readOnly = options.readOnly === true;
      const active = new Set<RichTextTool>();

      const syncEditable = () => {
        element.contentEditable = String(!(disabled || readOnly));
      };

      const emit = () => {
        const html = element.innerHTML;
        const value: RichTextValue =
          options.format === "json" ? { html, type: "doc" } : html;
        options.onChange(value);
        options.onSelectionChange?.();
      };

      if (typeof options.value === "string") {
        element.innerHTML = options.value;
      } else if (options.value && typeof options.value === "object") {
        const html = (options.value as { html?: string }).html;
        element.innerHTML = typeof html === "string" ? html : "";
      } else {
        element.innerHTML = "";
      }

      element.setAttribute("role", "textbox");
      syncEditable();

      const onInput = () => {
        emit();
      };

      element.addEventListener("input", onInput);

      return {
        blur: () => {
          element.blur();
        },
        focus: () => {
          element.focus();
        },
        can: () => {
          return !(disabled || readOnly);
        },
        isActive: (tool: RichTextTool) => {
          return active.has(tool);
        },
        setDisabled: (next: boolean) => {
          disabled = next;
          syncEditable();
        },
        setReadOnly: (next: boolean) => {
          readOnly = next;
          syncEditable();
        },
        destroy: () => {
          element.removeEventListener("input", onInput);
          element.contentEditable = "false";
        },
        getValue: () => {
          const html = element.innerHTML;
          return options.format === "json" ? { html, type: "doc" } : html;
        },
        run: (tool: RichTextTool) => {
          if (disabled || readOnly) {
            return;
          }

          if (active.has(tool)) {
            active.delete(tool);
          } else {
            active.add(tool);
          }

          options.onSelectionChange?.();
        },
        setValue: (value: RichTextValue) => {
          if (typeof value === "string") {
            element.innerHTML = value;
            return;
          }

          const html = (value as { html?: string }).html;
          element.innerHTML = typeof html === "string" ? html : "";
        },
      };
    },
  };
}
