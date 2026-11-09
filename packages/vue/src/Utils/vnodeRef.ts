// ** External Imports
import type { ComponentPublicInstance } from "vue";

/**
 * Resolves a Vue template ref callback value to an HTMLElement.
 */
export function resolveVnodeRefElement(
  element: null | Element | ComponentPublicInstance,
): null | HTMLElement {
  if (element instanceof HTMLElement) {
    return element;
  }

  if (element && "$el" in element) {
    const el = element.$el;

    return el instanceof HTMLElement ? el : null;
  }

  return null;
}
