// ** External Imports
import type { ReactNode } from "react";

/** Slots object from component props (typed interfaces are accepted). */
export type SlotMap = object;

/**
 * Reads a named slot from the slot map.
 */
function readSlot(
  slots: SlotMap | undefined,
  name: string,
): ReactNode | undefined {
  if (slots == null) {
    return undefined;
  }

  return (slots as Record<string, ReactNode | undefined>)[name];
}

/**
 * Whether a named slot was passed to the component.
 */
export function hasNamedSlot(
  slots: SlotMap | undefined,
  name: string,
): boolean {
  return readSlot(slots, name) != null;
}

/**
 * Whether a prop value is considered present for fallback rendering.
 */
export function isPropPresent(value: unknown): value is ReactNode {
  if (value == null) {
    return false;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  return true;
}

/**
 * Whether a named slot or a fallback prop should render (slot wins when both exist).
 */
export function hasSlotOrProp(
  slots: SlotMap | undefined,
  name: string,
  prop: unknown,
): boolean {
  return hasNamedSlot(slots, name) || isPropPresent(prop);
}

/**
 * Renders the named slot when present; otherwise the fallback prop.
 */
export function resolveSlotOrProp({
  slots,
  name,
  fallback,
}: {
  slots?: SlotMap;
  name: string;
  fallback?: ReactNode;
}): ReactNode {
  const slot = readSlot(slots, name);

  if (slot != null) {
    return slot;
  }

  if (!isPropPresent(fallback)) {
    return null;
  }

  return fallback;
}
