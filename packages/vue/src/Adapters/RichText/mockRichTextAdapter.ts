/**
 * Minimal contenteditable mock for RichTextEditor component tests.
 * Avoids pulling TipTap into Vitest / Cypress component suites.
 */

// ** External Imports
import { isNil } from "es-toolkit/compat";

// ** Core Imports
import type {
  RichTextEditorAdapter,
  RichTextEditorHandle,
  RichTextMountOptions,
  RichTextTool,
  RichTextValue,
} from "@bridge-ui/core/Adapters";

/**
 * Applies Bridge a11y attributes to the mock editable host.
 */
function applyEditableA11y(
  editable: HTMLElement,
  options: RichTextMountOptions,
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

      applyEditableA11y(element, options);
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
