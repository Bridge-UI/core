/**
 * How a field picker / listbox panel is rendered.
 *
 * - `menu` — anchored floating panel (desktop default)
 * - `modal` — centered dialog shell
 * - `drawer` — edge-docked sheet (typically bottom on mobile)
 * - `auto` — `menu` on desktop, `drawer` when `mobile` is true
 */
export type FieldOverlayMode = "auto" | "menu" | "modal" | "drawer";

/**
 * Concrete shell after resolving {@link FieldOverlayMode}.
 */
export type ResolvedFieldOverlay = "menu" | "modal" | "drawer";

/**
 * Resolves a field overlay mode into a concrete shell.
 * `undefined` and `"menu"` map to `menu`. `"auto"` uses `drawer` when `mobile`.
 */
export function resolveFieldOverlay(
  mode: undefined | FieldOverlayMode,
  mobile: boolean,
): ResolvedFieldOverlay {
  if (mode === "modal" || mode === "drawer") {
    return mode;
  }

  if (mode === "auto" && mobile) {
    return "drawer";
  }

  return "menu";
}
