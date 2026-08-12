// ** External Imports
import { get, isEmpty, isNil, isString } from "es-toolkit/compat";
import { defineComponent, type PropType, type Slots } from "vue";

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
 * Stable host for programmatic render functions (e.g. Tabs `items` API).
 * Prefer native `<slot>` everywhere else.
 *
 * @example
 * ```vue
 * <RenderFn :fn="item.panel" />
 * ```
 */
export const RenderFn = defineComponent({
  name: "RenderFn",
  setup(props) {
    return () => {
      return props.fn?.() ?? null;
    };
  },
  props: {
    fn: {
      default: undefined,
      type: Function as PropType<undefined | (() => unknown)>,
    },
  },
});
