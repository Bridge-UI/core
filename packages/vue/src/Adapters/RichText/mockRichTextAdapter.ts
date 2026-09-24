/**
 * Minimal contenteditable mock for RichTextEditor component tests.
 * Avoids pulling TipTap into Vitest / Cypress component suites.
 */

// ** External Imports
import { isNil, isString } from "es-toolkit/compat";

// ** Core Imports
import {
  applyRichTextEditableA11y,
  type RichTextEditorAdapter,
  type RichTextEditorHandle,
  type RichTextMountOptions,
  type RichTextTool,
  type RichTextValue,
} from "@bridge-ui/core/Adapters";

function htmlFromValue(value: undefined | RichTextValue): string {
  if (isString(value)) {
    return value;
  }

  if (isNil(value)) {
    return "";
  }

  return isString(value.html) ? value.html : "";
}

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

      element.innerHTML = htmlFromValue(options.value);

      applyRichTextEditableA11y(element, options);
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
        setA11y: (next) => {
          applyRichTextEditableA11y(element, next);
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
          element.innerHTML = htmlFromValue(value);
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
      };
    },
  };
}
