// ** External Imports
import { Children, isValidElement, type ReactNode } from "react";

// ** Core Imports
import {
  listboxOptionFromComposedItem,
  type ListboxOption,
} from "@bridge-ui/core/Domain";

/**
 * Walks composed `ListItem` children and collects options from `value` / `primary`.
 */
export function collectComposedListboxOptions(
  children: ReactNode,
): ListboxOption[] {
  const options: ListboxOption[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    const props = child.props as {
      children?: ReactNode;
      disabled?: boolean;
      primary?: unknown;
      secondary?: unknown;
      value?: ListboxOption["value"];
    };

    const option = listboxOptionFromComposedItem(props);

    if (option) {
      options.push(option);
    }

    if (props.children != null) {
      options.push(...collectComposedListboxOptions(props.children));
    }
  });

  return options;
}
