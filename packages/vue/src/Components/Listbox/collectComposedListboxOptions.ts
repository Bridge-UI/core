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
  const list = Array.isArray(nodes) ? nodes : nodes == null ? [] : [nodes];

  for (const node of list) {
    if (!node || typeof node !== "object") {
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

    if (Array.isArray(vnode.children)) {
      options.push(...collectComposedListboxOptions(vnode.children));
      continue;
    }

    if (
      vnode.children &&
      typeof vnode.children === "object" &&
      "default" in (vnode.children as object)
    ) {
      const childSlot = (vnode.children as { default?: () => unknown }).default;

      if (typeof childSlot === "function") {
        options.push(...collectComposedListboxOptions(childSlot()));
      }
    }
  }

  return options;
}
