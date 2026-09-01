// ** External Imports
import { isArray, isFunction, isNil, isObjectLike } from "es-toolkit/compat";

// ** Core Imports
import {
  listboxOptionFromComposedItem,
  type ListboxOption,
} from "@bridge-ui/core/Domain";

type ComposedVNode = {
  children?: unknown;
  props?: null | {
    disabled?: boolean;
    primary?: unknown;
    secondary?: unknown;
    value?: ListboxOption["value"];
  };
};

/**
 * Walks composed `ListItem` vnodes and collects options from `value` / `primary`.
 */
export function collectComposedListboxOptions(nodes: unknown): ListboxOption[] {
  const options: ListboxOption[] = [];
  const list = isArray(nodes) ? nodes : isNil(nodes) ? [] : [nodes];

  for (const node of list) {
    if (!isObjectLike(node)) {
      continue;
    }

    const vnode = node as ComposedVNode;
    const option = listboxOptionFromComposedItem({
      value: vnode.props?.value,
      primary: vnode.props?.primary,
      disabled: vnode.props?.disabled,
      secondary: vnode.props?.secondary,
    });

    if (option) {
      options.push(option);
    }

    if (isArray(vnode.children)) {
      options.push(...collectComposedListboxOptions(vnode.children));
      continue;
    }

    const slotChildren = vnode.children;

    if (isObjectLike(slotChildren) && "default" in (slotChildren as object)) {
      const childSlot = (slotChildren as { default?: () => unknown }).default;

      if (isFunction(childSlot)) {
        options.push(...collectComposedListboxOptions(childSlot()));
      }
    }
  }

  return options;
}
