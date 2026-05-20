// ** External Imports
import type { Slot, Slots, VNodeChild } from "vue";

type VueSlots = Slots | Readonly<Slots> | undefined;

/**
 * Whether a prop value is considered present for fallback rendering.
 */
export function isPropPresent(value: unknown): boolean {
  if (value == null) {
    return false;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  return true;
}

/**
 * Whether a named slot was passed to the component.
 */
export function hasNamedSlot(slots: VueSlots, name: string): boolean {
  return slots?.[name] != null;
}

/**
 * Whether a named slot or a fallback prop should render (slot wins when both exist).
 */
export function hasSlotOrProp(
  slots: VueSlots,
  name: string,
  prop: unknown,
): boolean {
  return hasNamedSlot(slots, name) || isPropPresent(prop);
}

/**
 * Render function for `<component :is="resolveSlotOrProp(slots, name, fallback)" />`.
 * Renders the named slot when present; otherwise the fallback prop.
 */
export function resolveSlotOrProp(
  slots: VueSlots,
  name: string,
  fallback?: string | number | null,
): () => VNodeChild | VNodeChild[] {
  return () => {
    const slotFn = slots?.[name];

    if (slotFn) {
      return slotFn();
    }

    if (!isPropPresent(fallback)) {
      return null;
    }

    return String(fallback);
  };
}

export type { Slot };
