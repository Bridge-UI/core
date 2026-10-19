// ** External Imports
import type { Attachment } from "svelte/attachments";

/**
 * Moves the element into `target` (a selector or element) while mounted, like
 * Vue's `<Teleport>`. `false` keeps it in place.
 */
export function portal(target: false | string | HTMLElement): Attachment {
  return (element) => {
    if (target === false) {
      return;
    }

    const container =
      typeof target === "string" ? document.querySelector(target) : target;

    if (!(container instanceof HTMLElement) || !(element instanceof Node)) {
      return;
    }

    container.appendChild(element);

    return () => {
      element.remove();
    };
  };
}
