// ** External Imports
import { get, isEmpty, isNil, isString } from "es-toolkit/compat";
import { defineComponent, type PropType, type Slot, type Slots } from "vue";

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
 * Renders `slots[name]()` when present, otherwise a text `fallback`.
 * Stable component identity — avoids remounts when Vue recreates slot functions.
 *
 * @example
 * ```vue
 * <SlotOrProp name="title" :slots="slots" :fallback="merged.title" />
 * ```
 */
export const SlotOrProp = defineComponent({
  name: "SlotOrProp",
  props: {
    name: {
      type: String,
      required: true,
    },
    slots: {
      default: undefined,
      type: Object as PropType<VueSlots>,
    },
    fallback: {
      default: undefined,
      type: [Number, String] as PropType<null | number | string | undefined>,
    },
  },
  setup(props) {
    return () => {
      const slotFn = get(props.slots, props.name) as Slot | undefined;

      if (!isNil(slotFn)) {
        return slotFn();
      }

      if (!isPropPresent(props.fallback)) {
        return null;
      }

      return String(props.fallback);
    };
  },
});
