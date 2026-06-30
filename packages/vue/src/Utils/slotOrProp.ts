// ** External Imports
import { get, isEmpty, isNil, isString } from "es-toolkit/compat";
import type { Slot, Slots, VNodeChild } from "vue";

type VueSlots = Slots | undefined | Readonly<Slots>;

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
 * Slot render function for `<component :is="resolveNamedSlot(slots, name)" />`.
 * Returns the slot function itself so `:is` keeps a stable identity across parent
 * re-renders (wrapping in a new render function would remount slot content and drop
 * native states such as `:hover` / `:active` during hold-repeat).
 */
export function resolveNamedSlot(
  slots: VueSlots,
  name: string,
): Slot | undefined {
  return get(slots, name) as Slot | undefined;
}

/**
 * Render target for `<component :is="resolveSlotOrProp(slots, name, fallback)" />`.
 * Returns the named slot function when present; otherwise a render function for the
 * fallback prop.
 */
export function resolveSlotOrProp(
  slots: VueSlots,
  name: string,
  fallback?: null | number | string,
): Slot | (() => null | VNodeChild) {
  const slotFn = get(slots, name) as Slot | undefined;

  if (!isNil(slotFn)) {
    return slotFn;
  }

  if (!isPropPresent(fallback)) {
    return () => null;
  }

  const text = String(fallback);

  return () => text;
}

export type { Slot };
