// ** External Imports
import { isNil, kebabCase } from "es-toolkit/compat";

/**
 * Serializes a style object (`{ insetInlineStart: "10%" }`) to an inline
 * `style` string. Svelte's `style` attribute does not accept objects.
 * Numbers are written as-is; `undefined` / `null` entries are skipped.
 */
export function styleToString(
  style: undefined | Record<string, undefined | null | number | string>,
): undefined | string {
  if (isNil(style)) {
    return undefined;
  }

  const declarations = Object.entries(style)
    .filter(([, value]) => !isNil(value))
    .map(([key, value]) => `${kebabCase(key)}: ${value}`);

  return declarations.length > 0 ? declarations.join("; ") : undefined;
}

/**
 * Joins inline style strings in order (later declarations win).
 */
export function joinStyles(
  ...styles: Array<undefined | null | string>
): undefined | string {
  const joined = styles
    .filter((style): style is string => Boolean(style?.trim()))
    .join("; ");

  return joined || undefined;
}
