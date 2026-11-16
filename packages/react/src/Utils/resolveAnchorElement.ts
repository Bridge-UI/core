// ** External Imports
import type { RefObject } from "react";

/**
 * Element (or ref to one) an overlay is anchored to (`anchorEl`).
 */
export type AnchorElement = null | HTMLElement | RefObject<null | HTMLElement>;

/**
 * The element an `anchorEl` points to: the element itself or a ref's current
 * value. `null` when unset.
 */
export function resolveAnchorElement(
  anchor: undefined | AnchorElement,
): null | HTMLElement {
  if (anchor instanceof HTMLElement) {
    return anchor;
  }

  if (anchor && "current" in anchor) {
    return anchor.current;
  }

  return null;
}
