/**
 * How a field picker / listbox panel is rendered.
 *
 * - `menu` — anchored floating panel
 * - `modal` — centered dialog shell
 * - `drawer` — edge-docked sheet (typically bottom on mobile)
 * - `auto` — `menu` on desktop, `drawer` when `mobile` is true (default)
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
 * `undefined` and `"auto"` use `drawer` when `mobile`, otherwise `menu`.
 * Explicit `"menu"` always stays menu.
 */
export function resolveFieldOverlay(
  mode: undefined | FieldOverlayMode,
  mobile: boolean,
): ResolvedFieldOverlay {
  if (mode === "modal" || mode === "drawer") {
    return mode;
  }

  if (mode === "menu") {
    return "menu";
  }

  return mobile ? "drawer" : "menu";
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

/**
 * Resolves whether a field picker shows Cancel / Apply.
 * Explicit `showFooter` wins (instance prop, then registry `defaultProps`).
 * When unset, defaults to `true` for dialog shells (`modal` / `drawer`).
 */
export function resolveFieldShowFooter(
  showFooter: boolean | undefined,
  overlay: ResolvedFieldOverlay,
): boolean {
  if (showFooter !== undefined) {
    return showFooter;
  }

  return isFieldOverlayDialog(overlay);
}

/**
 * Actions passed to a custom field overlay footer slot on a picker or listbox.
 * `apply` commits the draft then closes; `cancel` discards then closes.
 * Do not confuse with FieldOverlay context helpers, which only close.
 */
export type FieldOverlayFooterSlotProps = {
  apply: () => void;
  cancel: () => void;
};
