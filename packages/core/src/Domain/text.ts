// ** External Imports
import { get } from "es-toolkit/compat";

// ** Local Imports
import type { BridgeUIComponentsConfig } from "@/Config/types";
import { sizeProps, type TextSize } from "@/Tokens/Text";
import { mergeBridgeUILayeredClasses } from "@/Utils/merge";

/**
 * Library default `size` for `Text` (and for text inside components without a
 * `size` prop).
 */
export const DEFAULT_TEXT_SIZE = "sm" satisfies keyof TextSize;

/**
 * Font-size classes for the default `Text` size: registry
 * `Text.defaultProps.size` (falls back to {@link DEFAULT_TEXT_SIZE}) through
 * the `Text` size tokens. Lets text that can't render a `Text` element (e.g.
 * picker buttons) follow the same global size.
 */
export function resolveDefaultTextSizeClass(
  components: null | undefined | BridgeUIComponentsConfig,
): string {
  const classes = mergeBridgeUILayeredClasses<TextSize>(
    sizeProps,
    get(components, ["Text", "tokens", "size"]),
  );

  const size = get(components, ["Text", "defaultProps", "size"]) as
    string | undefined;

  return get(classes, size ?? DEFAULT_TEXT_SIZE) ?? "";
}
