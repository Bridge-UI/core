// ** External Imports
import { get, isEmpty, isNil, isString } from "es-toolkit/compat";
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
  if (isNil(slots)) {
    return undefined;
  }

  return get(slots as Record<string, ReactNode | undefined>, name);
}

/**
 * Whether a named slot was passed to the component.
 */
export function hasNamedSlot(
  slots: SlotMap | undefined,
  name: string,
): boolean {
  return !isNil(readSlot(slots, name));
}

/**
 * Whether a prop value is considered present for fallback rendering.
 */
export function isPropPresent(value: unknown): value is ReactNode {
  if (isNil(value)) {
    return false;
  }

  if (isString(value)) {
    return !isEmpty(value);
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
  name,
  slots,
  fallback,
}: {
  fallback?: ReactNode;
  name: string;
  slots?: SlotMap;
}): ReactNode {
  const slot = readSlot(slots, name);

  if (!isNil(slot)) {
    return slot;
  }

  if (!isPropPresent(fallback)) {
    return null;
  }

  return fallback;
}
