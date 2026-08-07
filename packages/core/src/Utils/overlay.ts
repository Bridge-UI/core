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
 * Layout direction for dual-panel range pickers (date / time).
 */
export type RangePickerOrientation = "vertical" | "horizontal";

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

/**
 * Picks range-picker orientation. Explicit `orientation` wins.
 * On mobile, drawer / modal shells default to vertical so dual panels stack
 * instead of forcing horizontal scroll.
 */
export function resolveRangePickerOrientation(
  orientation: undefined | RangePickerOrientation,
  overlay: ResolvedFieldOverlay,
  mobile: boolean,
): RangePickerOrientation {
  if (orientation) {
    return orientation;
  }

  if (mobile && (overlay === "drawer" || overlay === "modal")) {
    return "vertical";
  }

  return "horizontal";
}

/**
 * Whether the resolved overlay is a dialog shell (`modal` / `drawer`).
 */
export function isFieldOverlayDialog(overlay: ResolvedFieldOverlay): boolean {
  return overlay === "modal" || overlay === "drawer";
}
