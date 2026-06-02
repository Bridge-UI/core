/**
 * Resolves where a portal should mount.
 * Returns `null` when rendering in place (`teleportTo={false}`).
 */
export function resolveModalPortalElement(
  teleportTo: string | false | undefined,
): HTMLElement | null {
  if (teleportTo === false) {
    return null;
  }

  if (typeof document === "undefined") {
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
  event: Pick<MouseEvent, "currentTarget" | "target">,
): boolean {
  return event.target === event.currentTarget;
}
