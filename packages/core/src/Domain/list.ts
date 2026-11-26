// ** External Imports
import { get } from "es-toolkit/compat";

// ** Local Imports
import type { BridgeUIComponentsConfig } from "@/Config/types";
import { sizeProps, type ListSize, type ListSizeItem } from "@/Tokens/List";
import { mergeBridgeUILayeredClasses } from "@/Utils/merge";

/**
 * Library default `size` for `List` (and for `ListItem` / `ListSection`
 * outside a `List`).
 */
export const DEFAULT_LIST_SIZE = "md" satisfies keyof ListSize;

/**
 * Typography classes for a `List` size, through the `List` size tokens
 * (library tokens layered with registry `List.tokens.size`). Unknown sizes
 * fall back to {@link DEFAULT_LIST_SIZE}.
 */
export function resolveListSizeClasses(
  components: null | undefined | BridgeUIComponentsConfig,
  size: string | undefined,
): ListSizeItem {
  const classes = mergeBridgeUILayeredClasses<ListSize>(
    sizeProps,
    get(components, ["List", "tokens", "size"]),
  );

  return (get(classes, size ?? DEFAULT_LIST_SIZE) ??
    get(classes, DEFAULT_LIST_SIZE)) as ListSizeItem;
}
