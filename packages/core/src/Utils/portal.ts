// ** Local Imports
import { hasDocument } from "@/Utils/env";

/**
 * Resolves where a portal should mount.
 * Returns `null` when rendering in place (`teleportTo={false}`).
 */
export function resolveModalPortalElement(
  teleportTo: false | string | undefined,
): null | HTMLElement {
  if (teleportTo === false) {
    return null;
  }

  if (!hasDocument()) {
    return null;
  }

  const target = teleportTo ?? "body";

  if (target === "body") {
    return document.body;
  }

  const element = document.querySelector(target);

  return element instanceof HTMLElement ? element : document.body;
}

/**
 * Matches `click.self` — only the backdrop/wrapper itself was clicked.
 */
export function isModalBackdropClick(
  event: Pick<MouseEvent, "target" | "currentTarget">,
): boolean {
  return event.target === event.currentTarget;
}
