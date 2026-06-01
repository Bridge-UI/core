// ** External Imports
import { get, isEmpty, isNil, isString } from "es-toolkit/compat";
import type { Slot, Slots, VNodeChild } from "vue";

type VueSlots = Slots | Readonly<Slots> | undefined;

/**
 * Whether a prop value is considered present for fallback rendering.
 */
export function isPropPresent(value: unknown): boolean {
  if (isNil(value)) {
    return false;
  }

  if (isString(value)) {
    return !isEmpty(value);
  }

  return true;
}

/**
 * Whether a named slot was passed to the component.
 */
export function hasNamedSlot(slots: VueSlots, name: string): boolean {
  return !isNil(get(slots, name));
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
 * Render function for `<component :is="resolveNamedSlot(slots, name)" />`.
 * Returns `null` when the slot is absent, so a separate `v-if="hasNamedSlot(...)"` is
 * only needed for `v-if` / `v-else-if` layout chains—not to guard rendering.
 */
export function resolveNamedSlot(
  slots: VueSlots,
  name: string,
): () => VNodeChild | VNodeChild[] {
  return () => {
    const slotFn = get(slots, name) as Slot | undefined;

    if (isNil(slotFn)) {
      return null;
    }

    return slotFn();
  };
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
    const slotFn = get(slots, name);

    if (!isNil(slotFn)) {
      return slotFn();
    }

    if (!isPropPresent(fallback)) {
      return null;
    }

    return String(fallback);
  };
}

export type { Slot };
